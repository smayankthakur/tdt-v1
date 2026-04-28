'use client';

function getUserId() {
  if (typeof window === 'undefined') return 'anonymous';
  let userId = localStorage.getItem('divine_tarot_user_id');
  if (!userId) {
    userId = 'xxxxxxxx'.replace(/[x]/g, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).toUpperCase();
    localStorage.setItem('divine_tarot_user_id', userId);
  }
  return userId.slice(0, 8).toUpperCase();
}

export default function GlobalWatermark() {
  const userId = getUserId();
  return (
    <div className="watermark-container">
      <div className="watermark-text">
        THE DIVINE TAROT • {userId}
      </div>
    </div>
  );
}