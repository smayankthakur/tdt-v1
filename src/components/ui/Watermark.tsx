'use client';

import { createClientComponentClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function Watermark() {
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, [supabase]);

  return (
    <div className="watermark">
      The Divine Tarot • {userId || "Guest"}
    </div>
  );
}
