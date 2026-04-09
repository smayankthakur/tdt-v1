import { NextResponse } from 'next/server';
import { trackUserActivity, getUserProfile, processScheduledMessages } from '@/lib/user-tracking';

interface TrackActivityRequest {
  userId: string;
  action: 'reading' | 'booking' | 'session';
}

export async function POST(request: Request) {
  try {
    const body: TrackActivityRequest = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, action' },
        { status: 400 }
      );
    }

    const updatedProfile = trackUserActivity(userId, action);

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error tracking user activity:', error);
    return NextResponse.json(
      { error: 'Failed to track activity' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (userId) {
    const profile = getUserProfile(userId);
    if (!profile) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(profile);
  }

  const result = await processScheduledMessages();
  return NextResponse.json(result);
}