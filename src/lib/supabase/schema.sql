-- Divine Tarot Database Schema
-- Run this in your Supabase SQL Editor

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  phone TEXT,
  email TEXT,
  anonymous_id TEXT UNIQUE,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_users_anonymous ON public.users(anonymous_id);
CREATE INDEX idx_users_created ON public.users(created_at DESC);

-- ============================================
-- READINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  spread_type TEXT DEFAULT '3-card',
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_readings_user ON public.readings(user_id);
CREATE INDEX idx_readings_created ON public.readings(created_at DESC);

-- ============================================
-- CARDS_DRAWN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.cards_drawn (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID REFERENCES public.readings(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  card_id TEXT,
  position TEXT,
  is_reversed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cards_reading ON public.cards_drawn(reading_id);

-- ============================================
-- AI_RESPONSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.ai_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID REFERENCES public.readings(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  model_used TEXT DEFAULT 'gpt-4o-mini',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_responses_reading ON public.ai_responses(reading_id);

-- ============================================
-- EVENTS TABLE (Full Funnel Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_events_user ON public.events(user_id);
CREATE INDEX idx_events_name ON public.events(event_name);
CREATE INDEX idx_events_created ON public.events(created_at DESC);

-- ============================================
-- USER_MEMORY TABLE (Personalization)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, key)
);

CREATE INDEX idx_user_memory_user ON public.user_memory(user_id);

-- ============================================
-- FUNNEL ANALYTICS VIEW
-- ============================================
CREATE OR REPLACE VIEW public.funnel_summary AS
SELECT 
  DATE_TRUNC('day', e.created_at) as date,
  COUNT(DISTINCT CASE WHEN e.event_name = 'landing_page_view' THEN e.user_id END) as visitors,
  COUNT(DISTINCT CASE WHEN e.event_name = 'start_reading_click' THEN e.user_id END) as started_reading,
  COUNT(DISTINCT CASE WHEN e.event_name = 'reading_completed' THEN e.user_id END) as completed_reading,
  COUNT(DISTINCT CASE WHEN e.event_name = 'ginni_opened' THEN e.user_id END) as ginni_users,
  COUNT(DISTINCT CASE WHEN e.event_name = 'booking_page_visit' THEN e.user_id END) as booking_visits,
  COUNT(DISTINCT CASE WHEN e.event_name = 'booking_submitted' THEN e.user_id END) as bookings
FROM public.events e
WHERE e.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', e.created_at)
ORDER BY date DESC;

-- ============================================
-- USER RETENTION VIEW
-- ============================================
CREATE OR REPLACE VIEW public.user_retention AS
SELECT 
  DATE_TRUNC('day', u.created_at) as signup_date,
  COUNT(*) as total_users,
  COUNT(DISTINCT CASE WHEN a.readings > 0 THEN u.id END) as returning_users,
  ROUND(COUNT(CASE WHEN a.readings > 0 THEN 1 END)::numeric / COUNT(*)::numeric * 100, 1) as return_rate_percent
FROM public.users u
LEFT JOIN (
  SELECT user_id, COUNT(*) as readings 
  FROM public.readings 
  GROUP BY user_id
) a ON u.id = a.user_id
WHERE u.created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', u.created_at)
ORDER BY signup_date DESC;

-- ============================================
-- USER STATS FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_readings', COUNT(r.id),
    'last_reading', MAX(r.created_at),
    'memory_entries', COUNT(m.key)
  ) INTO stats
  FROM public.readings r
  LEFT JOIN public.user_memory m ON m.user_id = user_uuid
  WHERE r.user_id = user_uuid;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ENABLE ROW LEVEL SECURITY (Optional - for public reads)
-- ============================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to analytics
CREATE POLICY "Enable read access for all users" ON public.funnel_summary FOR SELECT USING (true);
CREATE POLICY "Enable read access for user retention" ON public.user_retention FOR SELECT USING (true);