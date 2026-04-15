'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePersonalization, type UsePersonalizationReturn } from '@/hooks/usePersonalization';
import { getUserId, ensureUser } from '@/lib/utils/user';

const PersonalizationContext = createContext<UsePersonalizationReturn | null>(null);

export function PersonalizationProvider({ 
  children, 
  userId 
}: { 
  children: ReactNode; 
  userId: string | null;
}) {
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    if (!userId) {
      const anonId = getUserId();
      ensureUser().then(() => {
        setResolvedUserId(anonId);
      }).catch(() => {
        setResolvedUserId(anonId);
      });
    } else {
      setResolvedUserId(userId);
    }
  }, [userId]);

  const personalization = usePersonalization(resolvedUserId);
  
  return (
    <PersonalizationContext.Provider value={personalization}>
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalizationContext(): UsePersonalizationReturn {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalizationContext must be used within PersonalizationProvider');
  }
  return context;
}

export { useHeroContent, useCTAContent, useReadingFlowContent, usePaywallContent, useChatContent } from '@/hooks/usePersonalization';