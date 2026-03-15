import { NextRequest } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { getCentralAdminAuth } from '@/lib/server/central-admin';

export interface AdminRequestContext {
  uid: string;
  email: string;
}

export interface AdminAuthResult {
  ok: boolean;
  status?: number;
  error?: string;
  context?: AdminRequestContext;
}

export function getSessionCookieName(): string {
  return process.env.SESSION_COOKIE_NAME || 'createam_session';
}

function getAdminEmailAllowlist(): string[] {
  const raw = process.env.PLATFORM_ADMIN_EMAILS || process.env.NEXT_PUBLIC_PLATFORM_ADMIN_EMAILS || '';

  return raw
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

function getAdminContextFromToken(decodedToken: DecodedIdToken): AdminRequestContext | null {
  const email = decodedToken.email?.toLowerCase() || '';

  if (!email) {
    return null;
  }

  const allowlist = getAdminEmailAllowlist();
  const allowlisted = allowlist.includes(email);
  const hasAdminClaim = decodedToken.admin === true;

  if (!allowlisted && !hasAdminClaim) {
    return null;
  }

  return {
    uid: decodedToken.uid,
    email,
  };
}

export async function verifyPlatformAdminIdToken(idToken: string): Promise<AdminAuthResult> {
  try {
    const decodedToken = await getCentralAdminAuth().verifyIdToken(idToken, true);
    const context = getAdminContextFromToken(decodedToken);

    if (!context) {
      return { ok: false, status: 403, error: 'User is not allowed to access admin resources' };
    }

    return { ok: true, context };
  } catch {
    return { ok: false, status: 401, error: 'Invalid or expired token' };
  }
}

export async function verifyPlatformAdminSessionCookie(sessionCookie: string): Promise<AdminAuthResult> {
  try {
    const decodedToken = await getCentralAdminAuth().verifySessionCookie(sessionCookie, true);
    const context = getAdminContextFromToken(decodedToken as DecodedIdToken);

    if (!context) {
      return { ok: false, status: 403, error: 'User is not allowed to access admin resources' };
    }

    return { ok: true, context };
  } catch {
    return { ok: false, status: 401, error: 'Invalid or expired session' };
  }
}

export async function verifyPlatformAdminRequest(request: NextRequest): Promise<AdminAuthResult> {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (token) {
    return verifyPlatformAdminIdToken(token);
  }

  const sessionCookie = request.cookies.get(getSessionCookieName())?.value;
  if (sessionCookie) {
    return verifyPlatformAdminSessionCookie(sessionCookie);
  }

  return { ok: false, status: 401, error: 'Missing authentication credentials' };
}
