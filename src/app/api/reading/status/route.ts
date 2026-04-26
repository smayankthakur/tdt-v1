import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId is required' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const { data: job, error: jobError } = await supabase
      .from('reading_jobs')
      .select('id, status, result, error, created_at, updated_at')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const response: any = {
      jobId: job.id,
      status: job.status,
      created_at: job.created_at,
    };

    if (job.status === 'completed' && job.result) {
      try {
        response.result = JSON.parse(job.result);
      } catch (e) {
        response.result = null;
      }
    } else if (job.status === 'failed') {
      response.error = job.error || 'Reading failed';
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('[ReadingStatus] Error:', error);
    return NextResponse.json(
      { error: 'Failed to get job status' },
      { status: 500 }
    );
  }
}
