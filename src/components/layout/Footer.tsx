'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { t, isHydrated } = useLanguage();

  return (
    <footer className="relative bg-background/80 border-t border-white/5 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/tdt-v3/logo.png"
                  alt="The Devine Tarot Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-heading text-xl font-semibold text-foreground">
                The Devine Tarot
              </span>
            </Link>
            <p className="text-white/50 text-sm italic">
              {isHydrated ? t('footer.tagline') : 'Clarity begins within'}
            </p>
          </div>

          <nav className="flex items-center gap-8">
            <Link
              href="/about"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              {isHydrated ? t('nav.about') : 'About'}
            </Link>
            <Link
              href="/contact"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              {isHydrated ? t('nav.contact') : 'Contact'}
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              {isHydrated ? t('footer.privacy') : 'Privacy'}
            </Link>
          </nav>

          <div className="text-center">
            <p className="text-xs text-white/30">
              {isHydrated ? t('footer.copyright') : `© Sitelytc Digital Media. All rights reserved.`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}