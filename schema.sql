-- Divine Tarot Database Schema
-- Run this SQL in Supabase SQL Editor

-- Users table (anonymous tracking)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  phone TEXT,
  email TEXT,
  anonymous_id TEXT UNIQUE,
  metadata JSONB DEFAULT '{}'
);

-- Readings table
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  question TEXT NOT NULL,
  spread_type TEXT DEFAULT '3-card',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cards drawn during readings
CREATE TABLE IF NOT EXISTS cards_drawn (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID REFERENCES readings(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  position TEXT NOT NULL,
  is_reversed BOOLEAN DEFAULT FALSE
);

-- AI responses for readings
CREATE TABLE IF NOT EXISTS ai_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID REFERENCES readings(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events for funnel tracking
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User memory for personalization
CREATE TABLE IF NOT EXISTS user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, key)
);

-- Reading jobs for async processing
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);
CREATE INDEX IF NOT EXISTS idx_readings_created_at ON readings(created_at);
CREATE INDEX IF NOT EXISTS idx_cards_drawn_reading_id ON cards_drawn(reading_id);
CREATE INDEX IF NOT EXISTS idx_ai_responses_reading_id ON ai_responses(reading_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_event_name ON events(event_name);
CREATE INDEX IF NOT EXISTS idx_user_memory_user_id ON user_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_jobs_id ON reading_jobs(id);
CREATE INDEX IF NOT EXISTS idx_reading_jobs_user_id ON reading_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_jobs_status ON reading_jobs(status);
CREATE INDEX IF NOT EXISTS idx_reading_jobs_expires_at ON reading_jobs(expires_at);

-- Row level security (optional - enable if needed)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards_drawn ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;