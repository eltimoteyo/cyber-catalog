import { TenantConfig } from './types';

/**
 * Obtiene el color primario del tenant
 */
export function getPrimaryColor(tenant: TenantConfig): string {
  return tenant.colors?.primary || tenant.primaryColor || '#E11D48';
}

/**
 * Obtiene el color secundario del tenant
 */
export function getSecondaryColor(tenant: TenantConfig): string {
  return tenant.colors?.secondary || '#F43F5E';
}

/**
 * Obtiene el color acento del tenant
 */
export function getAccentColor(tenant: TenantConfig): string {
  return tenant.colors?.accent || '#FB7185';
}

/**
 * Obtiene todos los colores del tenant en un objeto
 */
export function getTenantColors(tenant: TenantConfig) {
  return {
    primary: getPrimaryColor(tenant),
    secondary: getSecondaryColor(tenant),
    accent: getAccentColor(tenant),
  };
}
