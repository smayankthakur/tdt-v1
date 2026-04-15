import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, updateUserActivity, clearProfileCache } from '@/lib/personalization/profile';
import { applyPersonalizationRules, getDefaultRules } from '@/lib/personalization/rules';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      const supabase = await createServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return NextResponse.json({
          profile: null,
          rules: getDefaultRules(),
        });
      }

      const profile = await getUserProfile(user.id);
      const rules = applyPersonalizationRules(profile);
      
      return NextResponse.json({
        profile,
        rules,
        timestamp: new Date().toISOString(),
      });
    }

    const profile = await getUserProfile(userId);
    const rules = applyPersonalizationRules(profile);

    return NextResponse.json({
      profile,
      rules,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Personalization API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch personalization data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'update_activity':
        await updateUserActivity(user_id);
        return NextResponse.json({ success: true });

      case 'invalidate_cache':
        clearProfileCache();
        const profile = await getUserProfile(user_id);
        const rules = applyPersonalizationRules(profile);
        return NextResponse.json({
          profile,
          rules,
          cached: false,
        });

      case 'refresh':
        clearProfileCache();
        const freshProfile = await getUserProfile(user_id);
        const freshRules = applyPersonalizationRules(freshProfile);
        return NextResponse.json({
          profile: freshProfile,
          rules: freshRules,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Personalization POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}