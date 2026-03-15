import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getCentralAdminDb } from '@/lib/server/central-admin';
import { verifyPlatformAdminRequest } from '@/lib/server/admin-auth';
import { checkRateLimit } from '@/lib/server/rate-limit';

export const runtime = 'nodejs';

const ALLOWED_STATUSES = new Set(['pending', 'active', 'suspended', 'rejected']);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { tenantId: string } }
) {
  const rateLimit = checkRateLimit(request, 'admin-tenants-status-patch');
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
    const body = await request.json();
    const status = typeof body?.status === 'string' ? body.status : '';

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const db = getCentralAdminDb();
    const tenantRef = db.collection('tenants').doc(tenantId);

    const updateData: FirebaseFirestore.UpdateData<FirebaseFirestore.DocumentData> = {
      status,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (status === 'active') {
      updateData.approvedAt = FieldValue.serverTimestamp();
      updateData.approvedBy = authResult.context?.email || authResult.context?.uid;
    }

    await tenantRef.update(updateData);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[admin/tenants/status] Failed to update status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
