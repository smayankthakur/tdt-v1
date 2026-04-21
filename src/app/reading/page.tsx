'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { motion } from 'framer-motion';
import RitualReadingHub from '@/components/RitualReadingHub';

export default function ReadingPage() {
  const { lang } = useLanguage();
  
  return (
    <RitualReadingHub key={lang} />
  );
}