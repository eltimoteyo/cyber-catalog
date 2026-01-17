import { MetadataRoute } from 'next';
import { getAllTenants } from '@/lib/tenants';
import { getTenantFirestore } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://createam.cloud';
  
  const urls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/registro`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  try {
    // Get all active tenants
    const tenants = await getAllTenants();
    
    for (const tenant of tenants) {
      if (tenant.status !== 'active' || !tenant.domain) continue;

      const storeUrl = `${baseUrl}/store?_domain=${tenant.domain}`;
      
      // Add store homepage
      urls.push({
        url: storeUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });

      try {
        // Get products for this tenant using Admin SDK
        const db = getTenantFirestore(tenant.id, tenant.firebaseConfig);
        const productsSnapshot = await db.collection('products').get();
        
        // Add each product page
        productsSnapshot.docs.forEach(doc => {
          const product = doc.data();
          urls.push({
            url: `${baseUrl}/store/products/${doc.id}?_domain=${tenant.domain}`,
            lastModified: product.updatedAt?.toDate() || product.createdAt?.toDate() || new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        });
      } catch (error) {
        console.error(`Error loading products for tenant ${tenant.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return urls;
}
