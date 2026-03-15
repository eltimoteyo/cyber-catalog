import { NextRequest, NextResponse } from 'next/server';
import { verifyPlatformAdminRequest } from '@/lib/server/admin-auth';
import { getCentralAdminDb } from '@/lib/server/central-admin';
import { checkRateLimit } from '@/lib/server/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

function normalizeIsoDate(value: string | null): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function serializeAuditLog(doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) {
  const data = doc.data();

  return {
    id: doc.id,
    tenantId: data.tenantId || null,
    action: data.action || null,
    resource: data.resource || null,
    resourceId: data.resourceId || null,
    actor: {
      uid: data.actor?.uid || null,
      email: data.actor?.email || null,
      role: data.actor?.role || null,
    },
    metadata: data.metadata || {},
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
  };
}

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(request, 'admin-audit-get');
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

  try {
    const tenantId = request.nextUrl.searchParams.get('tenantId')?.trim();
    const action = request.nextUrl.searchParams.get('action')?.trim();
    const from = normalizeIsoDate(request.nextUrl.searchParams.get('from'));
    const to = normalizeIsoDate(request.nextUrl.searchParams.get('to'));
    const cursor = request.nextUrl.searchParams.get('cursor')?.trim();
    const limitCount = Math.min(parsePositiveInt(request.nextUrl.searchParams.get('limit'), 100), 300);

    let auditQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
      getCentralAdminDb().collection('tenantAdminAuditLogs');

    if (tenantId) {
      auditQuery = auditQuery.where('tenantId', '==', tenantId);
    }

    if (action) {
      auditQuery = auditQuery.where('action', '==', action);
    }

    if (from) {
      auditQuery = auditQuery.where('createdAt', '>=', from);
    }

    if (to) {
      auditQuery = auditQuery.where('createdAt', '<=', to);
    }

    auditQuery = auditQuery.orderBy('createdAt', 'desc');

    if (cursor) {
      const cursorDoc = await getCentralAdminDb().collection('tenantAdminAuditLogs').doc(cursor).get();

      if (!cursorDoc.exists) {
        return NextResponse.json({ error: 'Invalid cursor' }, { status: 400 });
      }

      auditQuery = auditQuery.startAfter(cursorDoc);
    }

    auditQuery = auditQuery.limit(limitCount + 1);

    const snapshot = await auditQuery.get();
    const hasMore = snapshot.docs.length > limitCount;
    const pageDocs = hasMore ? snapshot.docs.slice(0, limitCount) : snapshot.docs;
    const logs = pageDocs.map(serializeAuditLog);
    const nextCursor = hasMore ? pageDocs[pageDocs.length - 1]?.id || null : null;

    return NextResponse.json({ logs, nextCursor, hasMore });
  } catch (error) {
    console.error('[admin/audit] Failed to list audit logs:', error);
    return NextResponse.json({ error: 'Failed to load audit logs' }, { status: 500 });
  }
}
