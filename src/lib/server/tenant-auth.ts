import { NextRequest } from 'next/server';
import { getCentralAdminAuth, getCentralAdminDb } from '@/lib/server/central-admin';

export interface TenantRequestContext {
  uid: string;
  email: string;
  tenantId: string;
  role: 'admin' | 'owner';
}

export interface TenantAuthResult {
  ok: boolean;
  status?: number;
  error?: string;
  context?: TenantRequestContext;
}

export async function verifyTenantAdminRequest(request: NextRequest): Promise<TenantAuthResult> {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!token) {
    return { ok: false, status: 401, error: 'Missing bearer token' };
  }

  try {
    const decoded = await getCentralAdminAuth().verifyIdToken(token, true);
    const userDoc = await getCentralAdminDb().collection('users').doc(decoded.uid).get();

    if (!userDoc.exists) {
      return { ok: false, status: 403, error: 'User profile not found' };
    }

    const userData = userDoc.data() as {
      tenantId?: string;
      role?: 'admin' | 'owner';
      email?: string;
    };

    if (!userData?.tenantId) {
      return { ok: false, status: 403, error: 'User is not linked to a tenant' };
    }

    return {
      ok: true,
      context: {
        uid: decoded.uid,
        email: (decoded.email || userData.email || '').toLowerCase(),
        tenantId: userData.tenantId,
        role: userData.role || 'owner',
      },
    };
  } catch {
    return { ok: false, status: 401, error: 'Invalid or expired token' };
  }
}
