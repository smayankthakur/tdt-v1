'use client';

import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export default function LanguageMeta() {
  const { t, language } = useTranslation();

  useEffect(() => {
    // Update page title
    const title = t('metadata.title');
    document.title = title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    const content = t('metadata.description');
    if (metaDesc) {
      metaDesc.setAttribute('content', content);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = content;
      document.head.appendChild(meta);
    }

    // Update hreflang links if needed
    // (optional)
  }, [language, t]);

  return null;
}
