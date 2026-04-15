export type UserSegment = 
  | 'NEW_USER'
  | 'ACTIVE_USER'
  | 'INACTIVE_USER'
  | 'COLD_USER'
  | 'HIGH_INTENT';

export interface UserContext {
  id: string;
  phone?: string;
  lastActiveAt: Date | string | null;
  readingsCount: number;
  bookingIntent: boolean;
  sessionCount: number;
  segment?: UserSegment;
  lastQuestion?: string;
  lastReadingTopic?: string;
  lastReadingEmotion?: string;
}

export interface SegmentResult {
  segment: UserSegment;
  daysSinceActive: number;
  reason: string;
}

export function segmentUser(user: UserContext): SegmentResult {
  const now = new Date();
  const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;
  
  let daysSinceActive = 0;
  
  if (lastActive) {
    daysSinceActive = Math.floor(
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  if (user.bookingIntent || user.readingsCount >= 2) {
    return {
      segment: 'HIGH_INTENT',
      daysSinceActive,
      reason: 'User has booking_intent=true OR readings_count >= 2'
    };
  }

  if (!lastActive || daysSinceActive <= 1) {
    return {
      segment: user.readingsCount <= 1 ? 'NEW_USER' : 'ACTIVE_USER',
      daysSinceActive,
      reason: user.readingsCount <= 1 
        ? 'User has <= 1 reading and was active within 1 day' 
        : 'User was active within 1 day'
    };
  }

  if (daysSinceActive <= 7) {
    return {
      segment: 'INACTIVE_USER',
      daysSinceActive,
      reason: 'User was active 2-7 days ago'
    };
  }

  return {
    segment: 'COLD_USER',
    daysSinceActive,
    reason: 'User was inactive for more than 7 days'
  };
}

export function getSegmentPriority(segment: UserSegment): number {
  const priorities: Record<UserSegment, number> = {
    'HIGH_INTENT': 1,
    'INACTIVE_USER': 2,
    'ACTIVE_USER': 3,
    'NEW_USER': 4,
    'COLD_USER': 5
  };
  return priorities[segment] || 999;
}

export function shouldSendDailyMessage(user: UserContext): boolean {
  const result = segmentUser(user);
  
  if (result.segment === 'COLD_USER' || result.segment === 'HIGH_INTENT') {
    return false;
  }

  const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;
  if (!lastActive) return true;

  const hoursSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);
  return hoursSinceActive >= 20;
}

export function shouldSendReactivationMessage(user: UserContext): boolean {
  const result = segmentUser(user);
  
  if (result.segment === 'INACTIVE_USER' || result.segment === 'COLD_USER') {
    return true;
  }
  
  return false;
}

export function shouldSendConversionMessage(user: UserContext): boolean {
  const result = segmentUser(user);
  return result.segment === 'HIGH_INTENT';
}

export function getNextMessageType(user: UserContext): string {
  const result = segmentUser(user);

  if (result.segment === 'HIGH_INTENT') {
    return 'conversion';
  }

  if (result.segment === 'COLD_USER') {
    return 'reactivation';
  }

  if (result.segment === 'INACTIVE_USER') {
    return 'reactivation';
  }

  return 'daily';
}

export function getSegmentDisplayName(segment: UserSegment): string {
  const names: Record<UserSegment, string> = {
    'NEW_USER': 'New User',
    'ACTIVE_USER': 'Active User',
    'INACTIVE_USER': 'Inactive User',
    'COLD_USER': 'Cold User',
    'HIGH_INTENT': 'High Intent'
  };
  return names[segment] || segment;
}
