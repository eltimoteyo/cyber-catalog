import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extrae el dominio base de una URL o hostname
 */
export function extractDomain(hostname: string): string {
  // Remover puerto si existe
  const domain = hostname.split(':')[0];
  
  // Si es localhost o IP, retornar tal cual
  if (domain === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
    return domain;
  }
  
  return domain;
}

/**
 * Determina si un dominio es el principal de la plataforma
 */
export function isPlatformDomain(domain: string): boolean {
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'createam.cloud';
  return domain === platformDomain || domain === `www.${platformDomain}`;
}

/**
 * Extrae el subdominio de un dominio
 */
export function extractSubdomain(domain: string): string | null {
  const platformDomain = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'createam.cloud';
  
  if (domain.endsWith(`.${platformDomain}`)) {
    const parts = domain.split('.');
    return parts[0];
  }
  
  return null;
}

/**
 * Formatea precio en soles peruanos
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(price);
}

/**
 * Genera link de WhatsApp con mensaje predefinido
 */
export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
