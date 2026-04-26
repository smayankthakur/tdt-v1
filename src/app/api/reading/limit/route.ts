import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { checkReadingAccess } from '@/lib/payments/access-control';

export async function GET(request: Request) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json({
        remaining: -1,
        plan: 'anonymous',
        used: 0,
      });
    }

    // Get user plan from DB
    const { data: userData } = await supabase
      .from('users')
      .select('plan, readings_today, subscription_status')
      .eq('id', userId)
      .single();

    const userPlan = (userData as any)?.plan || 'free';
    const readingsToday = (userData as any)?.readings_today || 0;

    // Check access using same logic as API
    const access = await checkReadingAccess(userId);
    
    return NextResponse.json({
      remaining: access.remainingReadings,
      plan: userPlan,
      used: readingsToday,
      allowed: access.allowed,
      upgrade: !access.allowed,
      upgradePrompt: access.upgradePrompt,
    });
  } catch (error) {
    console.error('[ReadingLimit] Error:', error);
    return NextResponse.json({
      remaining: -1,
      plan: 'unknown',
      used: 0,
      error: 'Failed to check limit',
    });
  }
}
