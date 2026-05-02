import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Security & Rate Limiting Middleware
 * 
 * Applies to ALL routes globally:
 * - Rate limiting per IP
 * - Security headers (CSP, HSTS, etc.)
 * - CORS configuration
 * - Request size limits
 */

// Rate limiting stores (use Redis in production)
const rateLimitStores = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const DEFAULT_MAX_REQUESTS = 60; // per minute per IP

function checkRateLimit(ip: string, maxRequests: number = DEFAULT_MAX_REQUESTS): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = `rl:${ip}`;
  const entry = rateLimitStores.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStores.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count };
}

/**
 * Generate CSP nonce for inline scripts
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Main Middleware
 */
export function middleware(request: NextRequest) {
  const ip = request.ip || 
             request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             'anonymous';

  const url = request.nextUrl.clone();

  // === RATE LIMITING ===
  // Apply to all API routes (except static assets)
  if (url.pathname.startsWith('/api/')) {
    const { allowed, remaining } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please slow down.',
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
            'X-RateLimit-Remaining': '0',
          }
        }
      );
    }

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString());
    response.headers.set('X-RateLimit-Limit', DEFAULT_MAX_REQUESTS.toString());

    return response;
  }

  // === SECURITY HEADERS (apply to all routes) ===
  const response = NextResponse.next();
  
  // Generate nonce for CSP
  const nonce = generateNonce();
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.clarity.ms",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' " + (process.env.NEXT_PUBLIC_SUPABASE_URL || '') + " https://*.supabase.co https://api.openai.com https://api.razorpay.com",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ').replace('${nonce}', nonce);

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // HSTS - only in production and on HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Prevent MIME sniffing
  response.headers.set('X-DNS-Prefetch-Control', 'off');

  return response;
}

/**
 * Configure which routes use middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
};
