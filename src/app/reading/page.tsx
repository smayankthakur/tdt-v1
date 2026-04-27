'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import RitualReadingHub from '@/components/RitualReadingHub';

export default function ReadingPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          setUserId(user.id);
        }
      } catch (error) {
        // remain null → shows GUEST
      }
    };
    fetchUser();
  }, []);

  return (
    <RitualReadingHub userId={userId} />
  );
}