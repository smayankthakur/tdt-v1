import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Sacred Tarot Reading | Divine Tarot',
  description: 'Ask your question. The 78 cards reveal their wisdom. No paywall, no AI — only the ancient tarot and your intention.',
};

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

