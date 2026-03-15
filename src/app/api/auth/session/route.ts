import { NextRequest, NextResponse } from 'next/server';
import { getCentralAdminAuth } from '@/lib/server/central-admin';
import {
  getSessionCookieName,
  verifyPlatformAdminIdToken,
} from '@/lib/server/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getSessionCookieMaxAgeSeconds() {
  const days = Number(process.env.SESSION_COOKIE_MAX_AGE_DAYS || 5);
  if (!Number.isFinite(days) || days <= 0) {
    return 5 * 24 * 60 * 60;
  }

  return Math.floor(days * 24 * 60 * 60);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { idToken?: string };
    const idToken = body?.idToken?.trim();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    }

    const authResult = await verifyPlatformAdminIdToken(idToken);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status || 401 });
    }

    const expiresIn = getSessionCookieMaxAgeSeconds() * 1000;
    const sessionCookie = await getCentralAdminAuth().createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: getSessionCookieName(),
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: getSessionCookieMaxAgeSeconds(),
    });

    return response;
  } catch (error) {
    console.error('[auth/session] Failed to create session:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getSessionCookieName(),
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
