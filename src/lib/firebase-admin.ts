import * as admin from 'firebase-admin';

// Cache de apps de Firebase Admin por tenant
const tenantAdminApps = new Map<string, admin.app.App>();

/**
 * Inicializa Firebase Admin para un tenant (solo server-side)
 */
export function initTenantAdmin(tenantId: string, config: any) {
  // Si ya existe, retornarlo
  if (tenantAdminApps.has(tenantId)) {
    return tenantAdminApps.get(tenantId)!;
  }

  try {
    // Para Bella Sorpresa, usar las credenciales reales
    const credential = tenantId === 'bellasorpresa' 
      ? admin.credential.cert({
          projectId: 'createam-5a670',
          clientEmail: 'firebase-adminsdk-fbsvc@createam-5a670.iam.gserviceaccount.com',
          privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDs5e8cLQqe4eUI\nwKjUF/Xno6g+uyXRYuKmIeOvjAiGyDQlxVfmNxqgSqi2CdImFaKmgyOBQA9Wuaa6\nI5wkeqHWcOjxWOI/w8NpXwIEQGMIqkNn+ERha6mHxedY+CfCwZC7KEzqoADKzm/W\nrrSBDKYyP6c0nkOSN3zFG3YsyXL4mHZTKEwyEjtN7EJuUgo4+VS7v9Mq0RltLAb2\nINOs0Sn3pXI64hS/rV/qsGydzYHztjM368VAk1ikbUcjzPYIRAGTgZLK3D5Nah0k\nrkELHWe3vmY5RIAnn5tf151pgcM9ymu+8C4Tk6YGNlvyW/hqszRGe8cDf4zV5Zn1\nxtL8Z/WXAgMBAAECggEAA5QdnpFXnbrP2OgAJOQPxOYF/pyZH6acweG1LMuyvUZ8\n8y0d/M5MSquWDNntIMIm6NkGSkeLc8XuLNWo4CwyEak2+55aHJh6dTcIMsQ+Or1H\ns2RetBIKR5DHw+JLx3dhFlKvhsPP/0BLFDUjaOemAxBPGE5juuu3qMqXaGnKoNK1\nVRVSkNZkaGRxPuISIVKhjgWrfQ+MOnNgt3gC56WmhqppunI2rml2cBioisCsi02/\nja5LlBEeKgnJgLrFRJqto7Y3StbyJ9+WREYgwnlZ6UsdCRDO50CsKwY8h8otL1xd\ne8OhuovPIRo8P0ZmU4MmghelvypTlkWjX1Yt/ta8wQKBgQD+wcfWxeFCEmtmkcua\nBQWDdfh5/I1/w3S+DcEJ5EGzqYo+YJZn418uW7MfFQY7lIApQyFydEPOhh+C2FsL\nm+iHVHw84d67Idnkf/PU8hzuEFbNm8y+tQX4i93SiuEN3E+FNC2oWS5rohVcaH+D\nLA1DBNcsvJ8xEcasrIT9Bq8r8QKBgQDuDdiIhEAqrZQWeewPIaeQ+XASqAxyW7mR\nnCljeMW4a9wBdwN/MAzPaPPUJrfxC1qJU/0yo8qRD1GBcimDJo2UhWTAsRL56GXG\n5tL6rm+RRvIc9vqbraraPmiVE7ax4VZ679ZOWECXw3Pp8aU5RoqG6jNiNk7WsrzB\nl3dG9QPiBwKBgQCZWtdMb2PxHRtv7BXvClTOVQaVkDUxktxEyAzLQo9WcpmYgRYp\nRZL3WhYSgNp2pScdL58Dwf9LZCu13T25WEn6pR4AnEsyxObgiTGjn3dQy58lOENh\nDaGhg7itVBK0AEoSOl29uKmb+z72mKUhtjPpgxFwib8ej7/UFCoeEpcCUQKBgHtv\nVn3DBXqbspPM+GgILVjw3fnuhTWu9hPYg2V+tBciZlukGH4Uri/F3dh9kxc7qeBX\nWoytfVWmOb8DMR8+GF+Qo2N+7bYDmPJ/sZomZNdRkC0Qq3WZoWO0xIm4RR0LGMp6\nHgdVn3iR8kK199QxDZdTTP1553tQBqvjHAgA99h1AoGBAK/vI2NzLT9R1hVvnUCp\nrdaEwg8KUIdQbQTjBX+UFLgtxioN7HJXsZe2kK+oiSBQj8gZoqLL4pIN7r6Z9sHb\nzY7o/J3MpV9EcBTsOA4Y1twSGt7jxYOFA8zYx6kdetsBDU3lwz63ZyStvTDHhrS6\nTCgeasZQj6XcTyZDKTVskJG5\n-----END PRIVATE KEY-----\n',
        })
      : admin.credential.cert({
          projectId: config.projectId,
          clientEmail: config.clientEmail || `firebase-adminsdk@${config.projectId}.iam.gserviceaccount.com`,
          privateKey: config.privateKey?.replace(/\\n/g, '\n'),
        });

    // Inicializar app de admin
    const app = admin.initializeApp(
      {
        credential,
        projectId: tenantId === 'bellasorpresa' ? 'createam-5a670' : config.projectId,
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
