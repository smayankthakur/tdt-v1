import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tarot Reading | The Divine Tarot',
  description: 'Receive your personalized tarot reading with deep insights.',
  links: [
    { rel: 'preconnect', href: 'https://ginnitdt.lovable.app' },
    { rel: 'dns-prefetch', href: 'https://ginnitdt.lovable.app' },
  ],
};

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
