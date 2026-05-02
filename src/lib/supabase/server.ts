import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface CookieSetParams {
  name: string;
  value: string;
  options?: {
    path?: string;
    expires?: Date;
    domain?: string;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
  };
}

/**
 * Create Supabase server client
 * Uses service role key for admin access (server-side only).
 * Falls back to anon key for dev when service key not available.
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  
  // Determine which key to use
  const isProduction = process.env.NODE_ENV === 'production';
  const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
                      process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co';
  
  let serviceKeyToUse: string;
  
  if (isProduction && supabaseServiceKey) {
    // Production: require service role key
    serviceKeyToUse = supabaseServiceKey;
  } else if (!isProduction && supabaseServiceKey) {
    // Dev with service key
    serviceKeyToUse = supabaseServiceKey;
  } else if (!isProduction) {
    // Dev without service key: use anon key (less privileged)
    console.warn('[Supabase] Service role key not set. Using anon key for dev mode only.');
    serviceKeyToUse = supabaseAnonKey;
  } else {
    // Production missing service key - CRITICAL ERROR
    throw new Error('[Supabase] SERVICE_ROLE_KEY is required in production');
  }

  return createSupabaseServerClient(supabaseUrl, serviceKeyToUse, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieSetParams[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options || {});
          });
        } catch {
          // Called from Server Component
        }
      },
    },
  });
}

export const isSupabaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
         !!process.env.SUPABASE_SERVICE_ROLE_KEY; // Require service key in production config
};

export default createServerClient;