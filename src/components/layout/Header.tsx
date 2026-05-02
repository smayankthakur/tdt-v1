'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';

const navLinks = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/about', labelKey: 'nav.about' },
  { href: '/reading', labelKey: 'nav.reading' },
  { href: '/premium', labelKey: 'nav.subscription', isExternal: false },
  // { href: 'https://course.thedivinetarotonline.com/', labelKey: 'nav.course', isExternal: true },
  // { href: 'https://blog.thedivinetarotonline.com/', labelKey: 'nav.blog', isExternal: true },
  { href: 'https://thedivinetarotonline.co.in/', labelKey: 'nav.booking', isExternal: true },
];

const NAV_LABEL_KEYS: Record<string, string> = {
  'nav.home': 'nav.home',
  'nav.about': 'nav.about',
  'nav.reading': 'nav.reading',
  'nav.subscription': 'nav.subscription',
  'nav.course': 'nav.course',
  'nav.blog': 'nav.blog',
  'nav.booking': 'nav.booking',
};

export default function Header() {
  const pathname = usePathname();
  const { isHydrated, t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getNavLabel = (labelKey: string): string => {
    if (!isHydrated) return labelKey.split('.').pop() || labelKey;
    return NAV_LABEL_KEYS[labelKey] ? t(NAV_LABEL_KEYS[labelKey]) : labelKey;
  };

  return (
    <>
      <motion.header
        className="sticky top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-black/40 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/tdt-v3/logo.png"
                alt="The Divine Tarot Logo"
                width={40}
                height={40}
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="font-heading text-lg sm:text-xl font-semibold text-white">
              The Divine Tarot
            </span>
          </Link>

          {/* Desktop navigation: hidden on tablet and below */}
          <nav className="hidden items-center gap-4 lg:gap-6 lg:flex">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-xs sm:text-sm text-white/70 hover:text-white transition-colors duration-200 py-2"
                >
                  {getNavLabel(link.labelKey)}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative font-medium text-xs sm:text-sm transition-colors duration-200 hover:text-white py-2',
                    pathname === link.href
                      ? 'text-[#FFD700]'
                      : 'text-white/70'
                  )}
                >
                  {getNavLabel(link.labelKey)}
                  {pathname === link.href && (
                    <motion.div
                      className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#FFD700]"
                      layoutId="navbar-indicator"
                    />
                  )}
                </Link>
              )
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/contact"
              className="hidden lg:block bg-gradient-to-r from-[#FF4D4D] to-[#FFD700] text-black font-medium rounded-xl px-3 sm:px-5 py-2 text-sm hover:scale-105 transition-transform"
            >
              {isHydrated ? t('nav.contact') : 'Contact'}
            </Link>

            <button
              className="lg:hidden p-2 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              className="fixed right-0 top-0 z-50 h-full w-72 max-w-[85vw] bg-[#0a0a0a] shadow-2xl border-l border-white/10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="flex h-16 items-center justify-between px-6">
                <span className="font-heading text-lg font-semibold text-white">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-white min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-6 py-4">
                {navLinks.map((link) => (
                  link.isExternal ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileOpen(false)}
                      className="py-3 px-4 text-base text-white/70 hover:text-white hover:bg-white/5 transition-colors rounded-lg min-h-[44px] flex items-center"
                      aria-label={getNavLabel(link.labelKey) + ' (opens in new tab)'}
                    >
                      {getNavLabel(link.labelKey)}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        'py-3 px-4 text-base transition-colors rounded-lg min-h-[44px] flex items-center',
                        pathname === link.href
                          ? 'text-[#FFD700] font-medium bg-gold/10'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      )}
                    >
                      {getNavLabel(link.labelKey)}
                    </Link>
                  )
                ))}
                <div className="pt-4 mt-2 border-t border-white/10">
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-[#FF4D4D] to-[#FFD700] text-black font-semibold rounded-xl px-5 py-3 min-h-[48px] flex items-center justify-center"
                  >
                    {isHydrated ? t('nav.contact') : 'Contact'}
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
