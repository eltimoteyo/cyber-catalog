import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getCentralAdminDb } from '@/lib/server/central-admin';
import { verifyPlatformAdminRequest } from '@/lib/server/admin-auth';
import { checkRateLimit } from '@/lib/server/rate-limit';

export const runtime = 'nodejs';

function pickConfigUpdates(payload: Record<string, unknown>): FirebaseFirestore.UpdateData<FirebaseFirestore.DocumentData> {
  const updates: FirebaseFirestore.UpdateData<FirebaseFirestore.DocumentData> = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (typeof payload.logo === 'string') {
    updates.logo = payload.logo;
  }

  if (typeof payload.whatsapp === 'string') {
    updates.whatsapp = payload.whatsapp;
  }

  if (payload.colors && typeof payload.colors === 'object') {
    updates.colors = payload.colors;
  }

  if (payload.firebaseConfig && typeof payload.firebaseConfig === 'object') {
    updates.firebaseConfig = payload.firebaseConfig;
  }

  if (typeof payload.domain === 'string') {
    updates.domain = payload.domain;
  }

  if (typeof payload.subdomain === 'string') {
    updates.subdomain = payload.subdomain;
  }

  return updates;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  const rateLimit = checkRateLimit(request, 'admin-tenants-config-patch');
  if (rateLimit.limited) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  const authResult = await verifyPlatformAdminRequest(request);

  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
  }

  const { tenantId } = params;

  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const updateData = pickConfigUpdates(body);

    await getCentralAdminDb().collection('tenants').doc(tenantId).update(updateData);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[admin/tenants/config] Failed to update tenant config:', error);
    return NextResponse.json({ error: 'Failed to update tenant config' }, { status: 500 });
  }
}
