'use client';

import { useLanguage } from '@/hooks/useLanguage';
import RitualReadingHub from '@/components/RitualReadingHub';

export default function ReadingPage() {
  const { language } = useLanguage();

  return (
    <RitualReadingHub />
  );
}