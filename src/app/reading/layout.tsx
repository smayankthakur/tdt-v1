import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Sacred Tarot Reading | Divine Tarot',
  description: 'Immersive tarot reading experience — connected to our external reading engine.',
  openGraph: {
    title: 'Sacred Tarot Reading',
    description: 'Immersive tarot reading experience — connected to our external reading engine.',
    images: [{ url: '/tdt-v3/logo.png', width: 1200, height: 630 }],
  },
};

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

