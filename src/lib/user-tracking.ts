import { NextResponse } from 'next/server';
import { 
  determineSegment, 
  shouldSendDailyPull, 
  shouldSendReactivation,
  shouldSendColdReactivation,
  shouldSendConversion,
  UserProfile,
  MessageType
} from '@/lib/whatsapp-messages';

const userProfiles = new Map<string, UserProfile>();

export function trackUserActivity(userId: string, action: 'reading' | 'booking' | 'session') {
  const existing = userProfiles.get(userId) || createDefaultUser(userId);
  
  existing.lastActiveAt = new Date();
  existing.sessionCount += 1;
  
  if (action === 'reading') {
    existing.readingCount += 1;
  }
  
  if (action === 'booking') {
    existing.bookingIntent = true;
  }
  
  existing.segment = determineSegment(existing);
  
  userProfiles.set(userId, existing);
  
  return existing;
}

export function getUserProfile(userId: string): UserProfile | null {
  return userProfiles.get(userId) || null;
}

export function getAllUsers(): UserProfile[] {
  return Array.from(userProfiles.values());
}

export function getUsersNeedingDailyPull(): UserProfile[] {
  return getAllUsers().filter(shouldSendDailyPull);
}

export function getUsersNeedingReactivation(): UserProfile[] {
  return getAllUsers().filter(shouldSendReactivation);
}

export function getUsersNeedingColdReactivation(): UserProfile[] {
  return getAllUsers().filter(shouldSendColdReactivation);
}

export function getHighIntentUsers(): UserProfile[] {
  return getAllUsers().filter(shouldSendConversion);
}

export function determineMessageType(user: UserProfile): MessageType {
  if (shouldSendConversion(user)) return 'conversion';
  if (shouldSendColdReactivation(user)) return 'cold-reactivation';
  if (shouldSendReactivation(user)) return 'reactivation';
  return 'daily-pull';
}

function createDefaultUser(userId: string): UserProfile {
  return {
    id: userId,
    segment: 'new',
    lastActiveAt: new Date(),
    sessionCount: 0,
    readingCount: 0,
    bookingIntent: false,
    createdAt: new Date()
  };
}

export async function processScheduledMessages() {
  const dailyPullUsers = getUsersNeedingDailyPull();
  const reactivationUsers = getUsersNeedingReactivation();
  const coldUsers = getUsersNeedingColdReactivation();
  const highIntentUsers = getHighIntentUsers();

  const results = {
    dailyPull: dailyPullUsers.length,
    reactivation: reactivationUsers.length,
    coldReactivation: coldUsers.length,
    conversion: highIntentUsers.length
  };

  console.log('Scheduled messages processed:', results);
  
  return results;
}