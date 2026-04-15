'use client';

import { useState, useEffect } from 'react';
import { PersonalizationProvider } from '@/components/personalization/PersonalizationProvider';
import { getUserId, ensureUser } from '@/lib/utils/user';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      const anonId = getUserId();
      setUserId(anonId);
      
      try {
        await ensureUser();
      } catch (e) {
        console.warn('Failed to ensure user in database');
      }
      
      setIsReady(true);
    };

    initUser();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <PersonalizationProvider userId={userId}>
      {children}
    </PersonalizationProvider>
  );
}