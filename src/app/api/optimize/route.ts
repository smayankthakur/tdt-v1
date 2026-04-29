import { NextResponse } from 'next/server';
import { measurePerfAsync } from '@/lib/system/perf';
import { HealingResponse } from '@/lib/system/types';

// Queue for async processing (use BullMQ, Vercel Cron, or similar in production)
const optimizationQueue: Array<{
  id: string;
  code: string;
  createdAt: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
  result?: any;
}> = [];

export async function POST(req: Request): Promise<Response> {
  const startTime = Date.now();
  
  try {
    const { code, priority = 'normal' } = await req.json();
    const requestId = `opt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Code is required' },
        { status: 400 }
      );
    }

    // Queue the optimization task for async processing
    const task = {
      id: requestId,
      code,
      createdAt: Date.now(),
      status: 'pending' as 'pending' | 'processing' | 'complete' | 'error',
    };
    optimizationQueue.push(task);

    // Process asynchronously (non-blocking)
    process.nextTick(async () => {
      try {
        await processOptimization(task);
      } catch (e) {
        task.status = 'error';
        console.error('Optimization error:', e);
      }
    });

    const duration = Date.now() - startTime;

    return NextResponse.json({
      ok: true,
      requestId,
      message: 'Optimization queued successfully',
      suggestion: 'Refactor large components into smaller hooks for performance.',
      estimatedWait: '2-5 seconds',
      checkStatus: `/api/optimize/status?id=${requestId}`,
      metadata: {
        queuePosition: optimizationQueue.length,
        durationMs: duration,
        mode: process.env.NODE_ENV
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      ok: false,
      error: 'Failed to queue optimization',
      metadata: { durationMs: duration }
    }, { status: 500 });
  }
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { ok: false, error: 'Request ID required' },
      { status: 400 }
    );
  }

  const task = optimizationQueue.find(t => t.id === id);

  if (!task) {
    return NextResponse.json(
      { ok: false, error: 'Task not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    id: task.id,
    status: task.status,
    result: task.result,
    createdAt: task.createdAt,
    processingTime: task.status === 'complete' ? task.createdAt - Date.now() : null
  });
}

async function processOptimization(task: typeof optimizationQueue[0]) {
  task.status = 'processing';

  const chunks = chunkCode(task.code, 1000);
  const results: any[] = [];
  
  // Process chunks with delay to avoid rate limits
  for (let i = 0; i < chunks.length; i++) {
    const suggestion = analyzeCodeChunk(chunks[i]);
    results.push(suggestion);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  task.status = 'complete';
  task.result = {
    suggestions: results,
    summary: generateSummary(results),
    timestamp: Date.now()
  };
}

// Helper functions
function chunkCode(code: string, maxLength: number): string[] {
  const lines = code.split('\n');
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (const line of lines) {
    if (currentLength + line.length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.join('\n'));
      currentChunk = [];
      currentLength = 0;
    }
    currentChunk.push(line);
    currentLength += line.length;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join('\n'));
  }

  return chunks;
}

function analyzeCodeChunk(code: string) {
  // Mock AI analysis - replace with actual OpenAI/Anthropic API call
  const issues = [];
  
  if (code.includes('useState') && code.split('useState').length > 3) {
    issues.push('Consider consolidating multiple useState calls into a single reducer');
  }
  if (code.includes('useEffect') && !code.includes('useCallback')) {
    issues.push('Add useCallback for functions used in useEffect dependencies');
  }
  if (code.length > 2000) {
    issues.push('Component is too large - extract into smaller hooks or components');
  }

  return {
    chunk: code.substring(0, 50) + '...',
    issues,
    suggestion: issues.length > 0 
      ? issues.join(' | ') 
      : 'Code looks good - consider memoizing expensive calculations'
  };
}

function generateSummary(suggestions: any[]) {
  const allIssues = suggestions.flatMap((s: any) => s.issues);
  const uniqueIssues = [];
  const seen = new Set();
  for (const issue of allIssues) {
    if (!seen.has(issue)) {
      seen.add(issue);
      uniqueIssues.push(issue);
    }
  }

  return {
    totalChunks: suggestions.length,
    totalIssues: allIssues.length,
    uniqueIssues: uniqueIssues.length,
    topSuggestions: uniqueIssues.slice(0, 3)
  };
}
