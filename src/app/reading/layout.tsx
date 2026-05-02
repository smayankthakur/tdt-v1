import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Ginni Reading | The Divine Tarot',
  description: 'Connect with ginni.dt for a deeply personalized, interactive tarot experience powered by our external reading engine.',
};

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link rel="preconnect" href="https://ginnitdt.lovable.app" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://ginnitdt.lovable.app" />
      {children}
    </>
  );
}
