'use client';

import { useState, useEffect } from 'react';
import { PersonalizationProvider } from '@/components/personalization/PersonalizationProvider';
import { getUserId, ensureUser } from '@/lib/utils/user';
import { useLanguage } from '@/hooks/useLanguage';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const initUser = async () => {
      const anonId = getUserId();
      setUserId(anonId);
      
      try {
        // Add timeout to ensureUser to prevent hanging
        const timeoutPromise = new Promise<string>((resolve) => {
          setTimeout(() => {
            console.warn('[User] ensureUser timeout - using anonymous ID');
            resolve(anonId);
          }, 5000);
        });
        
        const result = await Promise.race([
          ensureUser(),
          timeoutPromise
        ]);
        
        if (result !== anonId) {
          setUserId(result);
        }
      } catch (e) {
        console.warn('[User] Failed to ensure user in database:', e);
      } finally {
        setIsReady(true);
      }
    };

    initUser();
  }, []);

   if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--background))]">
        <div className="text-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <PersonalizationProvider userId={userId}>
      {/* Language changes now propagate via context – no forced remount */}
      <div>
        {children}
      </div>
    </PersonalizationProvider>
  );
}