import { NextResponse } from 'next/server';
import type { LogEntry } from '@/lib/system/types';

// In-memory log buffer (use database like Vercel KV / Postgres in production)
const logBuffer: LogEntry[] = [];
const MAX_BUFFER_SIZE = 100;

export async function POST(req: Request) {
  try {
    const data: LogEntry = await req.json();

    // Add to buffer
    logBuffer.push({
      ...data,
      ts: data.ts || Date.now(),
    });

    // Trim buffer if too large
    if (logBuffer.length > MAX_BUFFER_SIZE) {
      logBuffer.splice(0, logBuffer.length - MAX_BUFFER_SIZE);
    }

    // Console logging for dev/debug
    if (process.env.NODE_ENV !== 'production') {
      const logPrefix = {
        client_error: '🔴 CLIENT',
        server_error: '🔵 SERVER',
        ai_error: '🧠 AI',
        fetch_error: '🔄 FETCH',
        performance: '⚡ PERF',
        state_error: '📊 STATE',
      }[data.type] || '⚪ LOG';

      console.log(
        `[${logPrefix}] ${data.ts} | ${data.message || data.metric || data.type}`,
        data.error || data.value ? JSON.stringify({ error: data.error, value: data.value }, null, 2) : ''
      );
    }

    // In production: forward to external service (Sentry, Datadog, etc.)
    // await forwardToExternalLogService(data);

    return NextResponse.json({ 
      ok: true, 
      buffered: logBuffer.length 
    });
  } catch (error) {
    console.error('Logging endpoint error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to process log entry' 
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  // Endpoint to retrieve buffered logs (for debugging/admin)
  const { searchParams } = new URL(req.url);
  const clear = searchParams.get('clear');
  
  if (clear === 'true' && process.env.NODE_ENV !== 'production') {
    logBuffer.length = 0;
    return NextResponse.json({ ok: true, message: 'Logs cleared' });
  }

  return NextResponse.json({ 
    ok: true, 
    count: logBuffer.length, 
    logs: logBuffer 
  });
}
