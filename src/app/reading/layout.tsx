import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Sacred Tarot Reading',
  description: 'Immersive tarot reading experience powered by our external reading engine.',
};

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://ginni-ki-baatein-buddy.lovable.app" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://ginni-ki-baatein-buddy.lovable.app" />
      {children}
    </>
  );
}
