'use client';

interface WatermarkProps {
  userId?: string | null;
}

export default function Watermark({ userId }: WatermarkProps) {
  const displayId = userId?.slice(0, 8).toUpperCase() || 'GUEST';
  
  return (
    <div className="fixed bottom-4 right-4 text-[10px] text-white/20 pointer-events-none select-none">
      THE DIVINE TAROT • {displayId}
    </div>
  );
}
