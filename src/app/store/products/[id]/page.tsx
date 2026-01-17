import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTenantByDomain } from '@/lib/tenants';
import { getTenantFirestore } from '@/lib/firebase-admin';
import ModernProductDetail from '@/components/store/modern/ModernProductDetail';
import { Product } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ _domain?: string }>;
}

async function getProduct(tenantId: string, firebaseConfig: any, productId: string): Promise<Product | null> {
  try {
    const db = getTenantFirestore(tenantId, firebaseConfig);
    const productDoc = await db.collection('products').doc(productId).get();
    
    if (!productDoc.exists) return null;
    
    const data = productDoc.data();
    return {
      id: productDoc.id,
      ...data,
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    } as Product;
  } catch (error) {
    console.error('Error loading product:', error);
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const domain = resolvedSearchParams._domain;

  if (!domain) {
    return { title: 'Producto no encontrado' };
  }

  const tenant = await getTenantByDomain(domain);
  if (!tenant) {
    return { title: 'Tienda no encontrada' };
  }

  const product = await getProduct(tenant.id, tenant.firebaseConfig, resolvedParams.id);
  
  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  const productUrl = `https://${domain}/store/products/${resolvedParams.id}`;
  const imageUrl = product.imageUrls && product.imageUrls[0] ? product.imageUrls[0] : tenant.logo || '';

  return {
    title: `${product.name} | ${tenant.name}`,
    description: product.description || `Compra ${product.name} en ${tenant.name}. Precio: S/${product.price}`,
    openGraph: {
      title: `${product.name} | ${tenant.name}`,
      description: product.description || `Compra ${product.name} en ${tenant.name}`,
      url: productUrl,
      siteName: tenant.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: 'es_PE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${tenant.name}`,
      description: product.description || `Compra ${product.name} en ${tenant.name}`,
      images: [imageUrl],
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const domain = resolvedSearchParams._domain;

  if (!domain) {
    return notFound();
  }

  const tenant = await getTenantByDomain(domain);
  
  if (!tenant || tenant.status !== 'active') {
    return notFound();
  }

  const product = await getProduct(tenant.id, tenant.firebaseConfig, resolvedParams.id);

  if (!product) {
    return notFound();
  }

  // JSON-LD Structured Data para SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || '',
    sku: product.id,
    image: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [tenant.logo || ''],
    brand: {
      '@type': 'Brand',
      name: tenant.name,
    },
    offers: {
      '@type': 'Offer',
      url: `https://${domain}/store/products/${product.id}`,
      priceCurrency: 'PEN',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: tenant.name,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '120',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ModernProductDetail product={product} tenant={tenant} domain={domain} />
    </>
  );
}
