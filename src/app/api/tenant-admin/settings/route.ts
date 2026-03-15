import { NextRequest, NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import { verifyTenantAdminRequest } from '@/lib/server/tenant-auth';
import { getCentralAdminDb } from '@/lib/server/central-admin';
import { checkRateLimit } from '@/lib/server/rate-limit';
import { tenantSettingsPatchSchema } from '@/lib/server/tenant-settings-validation';
import { logTenantAdminEvent } from '@/lib/server/tenant-audit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function serializeTenant(data: FirebaseFirestore.DocumentData, tenantId: string) {
  return {
    id: tenantId,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() || null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || null,
    approvedAt: data.approvedAt?.toDate?.()?.toISOString?.() || null,
  };
}

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(request, 'tenant-settings-get');
  if (rateLimit.limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const authResult = await verifyTenantAdminRequest(request);
  if (!authResult.ok || !authResult.context) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
  }

  try {
    const tenantId = authResult.context.tenantId;
    const tenantDoc = await getCentralAdminDb().collection('tenants').doc(tenantId).get();

    if (!tenantDoc.exists) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    return NextResponse.json({ tenant: serializeTenant(tenantDoc.data() || {}, tenantId) });
  } catch (error) {
    console.error('[tenant-admin/settings] Failed to load settings:', error);
    return NextResponse.json({ error: 'Failed to load tenant settings' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const rateLimit = checkRateLimit(request, 'tenant-settings-patch');
  if (rateLimit.limited) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const authResult = await verifyTenantAdminRequest(request);
  if (!authResult.ok || !authResult.context) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
  }

  try {
    const rawPayload = (await request.json()) as unknown;
    const payload = tenantSettingsPatchSchema.parse(rawPayload);
    const tenantId = authResult.context.tenantId;

    const updateData: FirebaseFirestore.UpdateData<FirebaseFirestore.DocumentData> = {
      updatedAt: FieldValue.serverTimestamp(),
    };
    const changedFields: string[] = [];

    if (typeof payload.logo === 'string') {
      updateData.logo = payload.logo;
      changedFields.push('logo');
    }
    if (typeof payload.primaryColor === 'string') {
      updateData.primaryColor = payload.primaryColor;
      changedFields.push('primaryColor');
    }
    if (typeof payload.whatsapp === 'string') {
      updateData.whatsapp = payload.whatsapp;
      changedFields.push('whatsapp');
    }
    if (typeof payload.domain === 'string' || payload.domain === null) {
      updateData.domain = payload.domain;
      changedFields.push('domain');
    }
    if (typeof payload.subdomain === 'string' || payload.subdomain === null) {
      updateData.subdomain = payload.subdomain;
      changedFields.push('subdomain');
    }

    if (payload.colors && typeof payload.colors === 'object') {
      updateData.colors = payload.colors;
      changedFields.push('colors');
    }

    if (payload.socialMedia && typeof payload.socialMedia === 'object') {
      updateData.socialMedia = payload.socialMedia;
      changedFields.push('socialMedia');
    }

    if (Array.isArray(payload.heroSlides)) {
      updateData.heroSlides = payload.heroSlides;
      changedFields.push('heroSlides');
    }

    await getCentralAdminDb().collection('tenants').doc(tenantId).update(updateData);

    await logTenantAdminEvent({
      tenantId,
      action: 'tenant.settings.updated',
      resource: 'tenant',
      resourceId: tenantId,
      actor: {
        uid: authResult.context.uid,
        email: authResult.context.email,
        role: authResult.context.role,
      },
      metadata: {
        changedFields,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid payload', details: error.flatten() }, { status: 400 });
    }

    console.error('[tenant-admin/settings] Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update tenant settings' }, { status: 500 });
  }
}
