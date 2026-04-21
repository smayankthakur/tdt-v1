'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';

export default function Footer() {
  const { t, isHydrated } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12">
        
        {/* BRAND */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/tdt-v3/logo.png"
                alt="Divine Tarot Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="font-heading text-xl font-semibold tracking-wide">
              The Devine Tarot
            </span>
          </Link>
          <p className="text-sm opacity-70 leading-relaxed">
            {isHydrated ? t('footer.tagline') : 'Clarity starts from within. Sometimes, you just need a moment to pause, reflect, and understand what your heart already knows.'}
          </p>
        </div>

        {/* NAVIGATION */}
        <div>
          <h3 className="text-sm uppercase tracking-wider opacity-50 mb-4">
            {isHydrated ? t('footer.navigation') : 'Navigation'}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-white/60 hover:text-white transition-colors">
                {isHydrated ? t('nav.home') : 'Home'}
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white/60 hover:text-white transition-colors">
                {isHydrated ? t('nav.about') : 'About'}
              </Link>
            </li>
            <li>
              <Link href="/reading" className="text-white/60 hover:text-white transition-colors">
                {isHydrated ? t('nav.reading') : 'Reading'}
              </Link>
            </li>
            <li>
              <Link href="/subscription" className="text-white/60 hover:text-white transition-colors">
                {isHydrated ? t('nav.subscription') : 'Subscription'}
              </Link>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-sm uppercase tracking-wider opacity-50 mb-4">
            {isHydrated ? t('footer.support') : 'Support'}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/contact" className="text-white/60 hover:text-white transition-colors">
                {isHydrated ? t('nav.contact') : 'Contact'}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
                {isHydrated ? t('footer.privacy') : 'Privacy Policy'}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* CONNECT */}
        <div>
          <h3 className="text-sm uppercase tracking-wider opacity-50 mb-4">
            {isHydrated ? t('footer.connect') : 'Connect'}
          </h3>
          <p className="text-sm opacity-70 leading-relaxed">
            {isHydrated ? t('footer.disclaimer') : 'This is not a replacement for professional advice. It is here to provide you clarity and direction.'}
          </p>
        </div>

      </div>

      {/* BOTTOM STRIP */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-xs opacity-60">
          <p>© {currentYear} Divine Tarot. All rights reserved.</p>
          <p className="md:mt-0 mt-1">Powered by Sitelytc Digital Media Pvt. Ltd. (sitelytc.com)</p>
        </div>
      </div>

    </footer>
  );
}