'use client';

import { useLanguage } from '@/hooks/useLanguage';

export default function ReadingPage() {
  const { language } = useLanguage();

  return (
    <RitualReadingHub />
  );
}