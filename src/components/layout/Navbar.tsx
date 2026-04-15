'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage';
import { LANGUAGES, type Language } from '@/lib/i18n/config';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/reading', label: 'Reading' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, t, isHydrated } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  const getNavLabel = (key: string): string => {
    if (!isHydrated) return key;
    const labels: Record<string, Record<Language, string>> = {
      Home: { en: 'Home', hi: 'होम', hinglish: 'Home' },
      Reading: { en: 'Reading', hi: 'रीडिंग', hinglish: 'Reading' },
      Blog: { en: 'Blog', hi: 'ब्लॉग', hinglish: 'Blog' },
      Contact: { en: 'Contact', hi: 'संपर्क', hinglish: 'Contact' },
    };
    return labels[key]?.[language] || key;
  };

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || !isHome
            ? 'bg-white/80 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">
          {/* Logo */}
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
            <span className="font-heading text-xl font-semibold text-[#1A1A1A] hidden sm:block">
              The Devine Tarot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative font-medium text-sm transition-colors duration-200 hover:text-amber-600',
                  pathname === link.href
                    ? 'text-amber-600'
                    : 'text-gray-600'
                )}
              >
                {getNavLabel(link.label)}
                {pathname === link.href && (
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 w-full bg-amber-500"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side: Language Switcher + CTA */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>{LANGUAGES[language].nativeName}</span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', isLangOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-lg border border-gray-100 py-1"
                  >
                    {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          'w-full px-4 py-2 text-left text-sm transition-colors',
                          language === lang
                            ? 'bg-amber-50 text-amber-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        )}
                      >
                        <span className="mr-2">{LANGUAGES[lang].flag}</span>
                        {LANGUAGES[lang].nativeName}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link href="/reading">
                <motion.button
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 px-6 py-2.5 text-sm font-semibold text-white shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">
                    {isHydrated ? t('cta.startReading') : 'Start Reading'}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Slide-in Menu */}
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
              className="fixed right-0 top-0 z-50 h-full w-72 bg-white shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex h-16 items-center justify-between px-6">
                <span className="font-heading text-lg font-semibold text-[#1A1A1A]">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Language Selector */}
              <div className="px-6 py-2">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Globe className="h-4 w-4" />
                  <span>Language</span>
                </div>
                <div className="flex gap-2">
                  {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={cn(
                        'flex-1 rounded-lg py-2 text-sm font-medium transition-colors',
                        language === lang
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      )}
                    >
                      {LANGUAGES[lang].nativeName}
                    </button>
                  ))}
                </div>
              </div>

              <nav className="flex flex-col gap-2 px-6 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      'rounded-lg px-4 py-3 font-medium transition-colors',
                      pathname === link.href
                        ? 'bg-amber-50 text-amber-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {getNavLabel(link.label)}
                  </Link>
                ))}
                <Link
                  href="/reading"
                  onClick={() => setIsMobileOpen(false)}
                  className="mt-4 rounded-full bg-gradient-to-r from-amber-400 via-purple-400 to-amber-400 px-6 py-3 text-center font-semibold text-white"
                >
                  {isHydrated ? t('cta.startReading') : 'Start Reading'}
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}