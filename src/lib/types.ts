// Tipos para el sistema multi-tenant

export type TenantStatus = 'pending' | 'active' | 'suspended' | 'rejected';

export interface TenantConfig {
  id: string;
  name: string;
  email: string;
  domain?: string; // Dominio personalizado (ej: bellasorpresa.pe)
  subdomain?: string; // Subdominio (ej: tienda1)
  status: TenantStatus;
  
  // Branding
  logo?: string;
  colors?: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  
  // Configuración Firebase del tenant
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  
  // Contacto
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrls?: string[];
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  order?: number;
}

export interface TenantRegistration {
  name: string;
  email: string;
  businessName: string;
  phone: string;
  wantsDomain: boolean;
  customDomain?: string;
}
