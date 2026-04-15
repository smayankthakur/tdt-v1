import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
         !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          phone: string | null;
          email: string | null;
          anonymous_id: string | null;
          metadata: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          phone?: string | null;
          email?: string | null;
          anonymous_id?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: {
          phone?: string | null;
          email?: string | null;
          anonymous_id?: string | null;
          metadata?: Record<string, unknown>;
        };
      };
      readings: {
        Row: {
          id: string;
          user_id: string | null;
          question: string;
          spread_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          question: string;
          spread_type?: string;
        };
        Update: Record<string, never>;
      };
      cards_drawn: {
        Row: {
          id: string;
          reading_id: string;
          card_name: string;
          position: string;
          is_reversed: boolean;
        };
        Insert: {
          id?: string;
          reading_id: string;
          card_name: string;
          position: string;
          is_reversed?: boolean;
        };
        Update: Record<string, never>;
      };
      ai_responses: {
        Row: {
          id: string;
          reading_id: string;
          response: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          reading_id: string;
          response: string;
        };
        Update: Record<string, never>;
      };
      events: {
        Row: {
          id: string;
          user_id: string | null;
          event_name: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_name: string;
          metadata?: Record<string, unknown>;
        };
        Update: Record<string, never>;
      };
      user_memory: {
        Row: {
          id: string;
          user_id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          key: string;
          value: string;
        };
        Update: {
          value?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export default supabase;