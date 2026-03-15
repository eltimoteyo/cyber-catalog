import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const ONE_MINUTE_MS = 60_000;

function getStore() {
  const globalStore = globalThis as unknown as {
    __createamRateLimitStore?: Map<string, RateLimitEntry>;
  };

  if (!globalStore.__createamRateLimitStore) {
    globalStore.__createamRateLimitStore = new Map<string, RateLimitEntry>();
  }

  return globalStore.__createamRateLimitStore;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}

export function checkRateLimit(
  request: NextRequest,
  bucket: string,
  maxRequests = Number(process.env.ADMIN_API_RATE_LIMIT || 60),
  windowMs = ONE_MINUTE_MS
): RateLimitResult {
  const now = Date.now();
  const clientIp = getClientIp(request);
  const key = `${bucket}:${clientIp}`;
  const store = getStore();

  const existing = store.get(key);
  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      limited: false,
      remaining: Math.max(maxRequests - 1, 0),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  existing.count += 1;

  const remaining = Math.max(maxRequests - existing.count, 0);
  const retryAfterSeconds = Math.max(Math.ceil((existing.resetAt - now) / 1000), 1);

  if (existing.count > maxRequests) {
    return {
      limited: true,
      remaining,
      retryAfterSeconds,
    };
  }

  return {
    limited: false,
    remaining,
    retryAfterSeconds,
  };
}
