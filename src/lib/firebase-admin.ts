import * as admin from 'firebase-admin';

// Cache de apps de Firebase Admin por tenant
const tenantAdminApps = new Map<string, admin.app.App>();

function getRequiredAdminConfig(config: any) {
  const projectId = config?.projectId || process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = config?.clientEmail || process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKeyRaw = config?.privateKey || process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error(
      'Missing Firebase Admin credentials. Define FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY or provide them in tenant config.'
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKeyRaw.replace(/\\n/g, '\n'),
  };
}

/**
 * Inicializa Firebase Admin para un tenant (solo server-side)
 */
export function initTenantAdmin(tenantId: string, config: any) {
  // Si ya existe, retornarlo
  if (tenantAdminApps.has(tenantId)) {
    return tenantAdminApps.get(tenantId)!;
  }

  try {
    const adminConfig = getRequiredAdminConfig(config);
    const credential = admin.credential.cert({
      projectId: adminConfig.projectId,
      clientEmail: adminConfig.clientEmail,
      privateKey: adminConfig.privateKey,
    });

    // Inicializar app de admin
    const app = admin.initializeApp(
      {
        credential,
        projectId: adminConfig.projectId,
      },
      `admin-${tenantId}`
    );

    tenantAdminApps.set(tenantId, app);
    return app;
  } catch (error) {
    console.error(`Error initializing admin for tenant ${tenantId}:`, error);
    throw error;
  }
}

/**
 * Obtiene Firestore para un tenant usando Admin SDK
 */
export function getTenantFirestore(tenantId: string, config: any) {
  const app = initTenantAdmin(tenantId, config);
  return admin.firestore(app);
}

/**
 * Verifica si ya existe una app admin para un tenant
 */
export function hasTenantAdmin(tenantId: string): boolean {
  return tenantAdminApps.has(tenantId);
}
