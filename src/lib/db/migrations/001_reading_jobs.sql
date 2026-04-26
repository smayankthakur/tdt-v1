-- Migration: Add reading_jobs table for async AI processing
-- This enables non-blocking, job-based tarot readings with SSE streaming
-- Date: 2026-04-26

-- Create reading_jobs table
CREATE TABLE IF NOT EXISTS reading_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  question TEXT NOT NULL,
  selected_cards JSONB NOT NULL,
  language TEXT DEFAULT 'en',
  name TEXT,
  topic TEXT,
  result TEXT,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour')
);

-- Indexes for fast job lookup and cleanup
CREATE INDEX IF NOT EXISTS idx_reading_jobs_id ON reading_jobs(id);
CREATE INDEX IF NOT EXISTS idx_reading_jobs_user_id ON reading_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_jobs_status ON reading_jobs(status);
CREATE INDEX IF NOT EXISTS idx_reading_jobs_expires_at ON reading_jobs(expires_at);

-- Optional: Enable RLS if needed for multi-tenant security
-- ALTER TABLE reading_jobs ENABLE ROW LEVEL SECURITY;

-- Optional: Add policy if RLS enabled
-- CREATE POLICY "Users can view own jobs" ON reading_jobs
--   FOR SELECT USING (auth.uid() = user_id);

-- Cleanup job: automatically delete expired jobs (run as scheduled job or via cron)
-- DELETE FROM reading_jobs WHERE expires_at < NOW() AND status IN ('completed', 'failed');

COMMENT ON TABLE reading_jobs IS 'Async job queue for tarot reading generation with SSE streaming';
COMMENT ON COLUMN reading_jobs.status IS 'pending=created, processing=AI working, completed=ready, failed=error';
COMMENT ON COLUMN reading_jobs.expires_at IS 'Auto-cleanup timestamp (1 hour after creation)';
