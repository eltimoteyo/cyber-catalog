import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;
  
  // Extraer dominio limpio (sin puerto)
  const domain = hostname.split(':')[0];
  
  // Dominio de la plataforma principal
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'createam.cloud';
  
  // Si es localhost, permitir todo para desarrollo
  if (domain === 'localhost' || domain.startsWith('127.0.0.1')) {
    return NextResponse.next();
  }
  
  // Si es el dominio principal de la plataforma
  if (domain === platformDomain || domain === `www.${platformDomain}`) {
    // Permitir acceso a rutas de plataforma: /, /registro, /login, /admin
    if (
      url.pathname === '/' ||
      url.pathname.startsWith('/registro') ||
      url.pathname.startsWith('/login') ||
      url.pathname.startsWith('/admin') ||
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/api')
    ) {
      return NextResponse.next();
    }
    
    // Redirigir otras rutas a home
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Para subdominios o dominios personalizados
  // Reescribir a la ruta de tienda con el dominio como parámetro
  const searchParams = new URLSearchParams();
  searchParams.set('domain', domain);
  
  // Reescribir a /store con el dominio como query param
  const storeUrl = new URL(`/store${url.pathname}${url.search}`, request.url);
  storeUrl.searchParams.set('_domain', domain);
  
  return NextResponse.rewrite(storeUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
