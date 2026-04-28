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
  { href: 'https://course.thedivinetarotonline.com/', labelKey: 'nav.course', isExternal: true },
  { href: 'https://blog.thedivinetarotonline.com/blogs', labelKey: 'nav.blog', isExternal: true },
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
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <Image
                src="/tdt-v3/logo.png"
                alt="The Devine Tarot Logo"
                width={40}
                height={40}
                className="object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="font-heading text-xl font-semibold text-white hidden sm:block">
              The Devine Tarot
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sm text-white/70 hover:text-white transition-colors duration-200"
                >
                  {getNavLabel(link.labelKey)}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative font-medium text-sm transition-colors duration-200 hover:text-white',
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

          <div className="flex items-center gap-4">
            <Link 
              href="/contact"
              className="hidden md:block bg-gradient-to-r from-[#FF4D4D] to-[#FFD700] text-black font-medium rounded-xl px-5 py-2 hover:scale-105 transition-transform"
            >
              {isHydrated ? t('nav.contact') : 'Contact'}
            </Link>

            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
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
            />
            <motion.div
              className="fixed right-0 top-0 z-50 h-full w-72 bg-[#0a0a0a] shadow-2xl border-l border-white/10"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex h-16 items-center justify-between px-6">
                <span className="font-heading text-lg font-semibold text-white">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 px-6 py-4">
                {navLinks.map((link) => (
                  link.isExternal ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileOpen(false)}
                      className="py-2 text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {getNavLabel(link.labelKey)}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        'py-2 text-sm transition-colors',
                        pathname === link.href
                          ? 'text-[#FFD700] font-medium'
                          : 'text-white/70 hover:text-white'
                      )}
                    >
                      {getNavLabel(link.labelKey)}
                    </Link>
                  )
                ))}
                <div className="pt-2">
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-[#FF4D4D] to-[#FFD700] text-black font-medium rounded-xl px-5 py-3"
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
