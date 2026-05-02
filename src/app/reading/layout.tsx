import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tarot Reading | The Divine Tarot',
  description: 'Receive your personalized tarot reading with deep insights.',
  // Note: Preconnect/dns-prefetch for iframe domain should be added in page component if needed
};

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
