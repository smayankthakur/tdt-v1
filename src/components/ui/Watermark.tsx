'use client';

import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function Watermark() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          setUserId(user.id);
        }
      } catch (error) {
        // Silent fail – watermark shows generic text if unauthenticated
        console.debug('Watermark: unable to fetch user', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="watermark">
      The Divine Tarot • {userId || "Guest"}
    </div>
  );
}
