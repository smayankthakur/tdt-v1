import { NextRequest, NextResponse } from 'next/server';
import type { LogEntry } from '@/lib/system/types';

// Simple in-memory rate limiter (use Redis/Vercel KV in production)
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};
const CLEANUP_INTERVAL = 60000; // 1 minute

/**
 * Rate limit helper for API routes
 */
export function rateLimit(
  key: string,
  limit: number = 100,
  windowMs: number = 60000
): {
  limited: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = rateLimitStore[key];

  // Clean up expired records
  if (record && record.resetTime < now) {
    delete rateLimitStore[key];
  }

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + windowMs
    };
  }

  const recordToUpdate = rateLimitStore[key];
  
  if (recordToUpdate.count >= limit) {
    return {
      limited: true,
      remaining: 0,
      resetTime: recordToUpdate.resetTime
    };
  }

  recordToUpdate.count += 1;
  
  return {
    limited: false,
    remaining: limit - recordToUpdate.count,
    resetTime: recordToUpdate.resetTime
  };
}

/**
 * API middleware for logging and rate limiting
 */
export async function withApiMiddleware(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const start = Date.now();
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
  const path = req.nextUrl.pathname;

  try {
    // Apply rate limiting to non-GET requests
    if (req.method !== 'GET') {
      const limit = path.includes('/api/log') ? 1000 : 100;
      const rateLimitResult = rateLimit(`${ip}:${path}`, limit, 60000);

      if (rateLimitResult.limited) {
        // Log rate limit event
      logToApi('/api/log', {
        type: 'server_error' as const,
        message: 'Rate limit exceeded',
        ts: Date.now(),
        metadata: {
          path,
          ip,
          method: req.method
        }
      }).catch(() => {});

        return NextResponse.json(
          {
            error: 'Too many requests',
            retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
          },
          { 
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
            }
          }
        );
      }
    }

    // Process request
    const response = await handler(req);

    // Log successful request
    const duration = Date.now() - start;
    if (duration > 100) {
      logToApi('/api/log', {
        type: 'performance',
        metric: `${req.method} ${path}`,
        value: duration,
        ts: Date.now(),
        metadata: {
          status: response.status,
          ip
        }
      }).catch(() => {});
    }

    // Add rate limit headers
    const rateLimitResult = rateLimit(`${ip}:${path}`, 100, 60000);
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString());

    return response;
  } catch (error) {
    // Log server error
    logToApi('/api/log', {
      type: 'server_error',
      message: error instanceof Error ? error.message : 'Unknown error',
      ts: Date.now(),
      metadata: {
        path,
        method: req.method,
        ip,
        stack: error instanceof Error ? error.stack : undefined
      }
    }).catch(() => {});

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Non-blocking log to API with retry capability
 */
async function logToApi(url: string, data: LogEntry) {
  try {
    // Use sendBeacon for better reliability during page unload
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      // Fallback to fetch with keepalive
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify(data),
      }).catch(() => {
        // Store pending logs for retry
        storePendingLog(data);
      });
    }
  } catch (e) {
    storePendingLog(data);
  }
}

/**
 * Store failed logs for later retry
 */
function storePendingLog(data: LogEntry) {
  try {
    if (typeof window !== 'undefined') {
      const pending = JSON.parse(localStorage.getItem('pending_logs') || '[]');
      pending.push({ ...data, queuedAt: Date.now() });
      localStorage.setItem('pending_logs', JSON.stringify(pending.slice(-100)));
    }
  } catch (e) {
    // Ignore localStorage errors
  }
}

// Periodic cleanup of expired rate limit records
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, CLEANUP_INTERVAL);
