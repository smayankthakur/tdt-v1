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
  { href: '/premium', label: 'Premium' },
  { href: '/booking', label: 'Book Reading' },
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
  const isReading = pathname === '/reading';
  const isFunnelPage = isReading;

  const getNavLabel = (key: string): string => {
    if (!isHydrated) return key;
    const labels: Record<string, Record<Language, string>> = {
      Home: { en: 'Home', hi: 'होम', hinglish: 'Home', ar: 'الرئيسية', he: 'בית' },
      Reading: { en: 'Reading', hi: 'रीडिंग', hinglish: 'Reading', ar: 'القراءة', he: 'קריאה' },
      Premium: { en: 'Premium', hi: 'प्रीमियम', hinglish: 'Premium', ar: 'المتميز', he: 'פרימיום' },
      'Book Reading': { en: 'Book Reading', hi: 'बुक रीडिंग', hinglish: 'Book Reading', ar: 'احجز قراءة', he: 'קריאת ספר' },
      Blog: { en: 'Blog', hi: 'ब्लॉग', hinglish: 'Blog', ar: 'المدونة', he: 'בלוג' },
      Contact: { en: 'Contact', hi: 'संपर्क', hinglish: 'Contact', ar: 'اتصل بنا', he: 'צור קשר' },
    };
    return labels[key]?.[language] || key;
  };

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || !isHome
            ? 'bg-[rgb(var(--background))/90] backdrop-blur-md shadow-lg shadow-[rgb(var(--gold))/10]'
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
            <span className="font-heading text-xl font-semibold text-[rgb(var(--foreground))] hidden sm:block">
              The Devine Tarot
            </span>
          </Link>

          {/* Desktop Navigation - Hidden during funnel */}
          <nav className={cn(
            "hidden items-center gap-6 md:flex",
            isFunnelPage && "opacity-0 pointer-events-none"
          )}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative font-medium text-sm transition-colors duration-200 hover:text-[rgb(var(--gold))]',
                  pathname === link.href
                    ? 'text-[rgb(var(--gold))]'
                    : 'text-[rgb(var(--foreground-secondary))]'
                )}
              >
                {getNavLabel(link.label)}
                {pathname === link.href && (
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 w-full bg-[rgb(var(--gold))] shadow-[0_0_10px_rgba(244,197,66,0.5)]"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Side: Language Switcher + CTA - Hidden during funnel */}
          <div className={cn("flex items-center gap-4", isFunnelPage && "opacity-0 pointer-events-none")}>
            {/* Language Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--gold))/10] hover:text-[rgb(var(--gold))] transition-colors"
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
                    className="absolute right-0 mt-2 w-40 rounded-xl bg-[rgb(var(--surface))] shadow-lg shadow-[rgb(var(--gold))/10] border border-[rgb(var(--gold))/20] py-1"
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
                            ? 'bg-[rgb(var(--gold))/20] text-[rgb(var(--gold))] font-medium'
                            : 'text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--gold))/10'
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
                  className="relative overflow-hidden rounded-full bg-gradient-to-r from-[rgb(var(--gold-start))] via-[rgb(var(--gold))] to-[rgb(var(--gold-start))] px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-[rgb(var(--gold))/30]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">
                    {isHydrated ? t('cta.startReading') : 'Begin Your Reading'}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--gold-start))/80] via-[rgb(var(--gold))/80] to-[rgb(var(--gold-start))/80]"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button - Hidden during funnel */}
            <button
              className={cn("md:hidden p-2 text-[rgb(var(--foreground))]", isFunnelPage && "hidden")}
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
              className="fixed right-0 top-0 z-50 h-full w-72 bg-[rgb(var(--background))] shadow-2xl shadow-[rgb(var(--gold))/10] border-l border-[rgb(var(--gold))/20"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex h-16 items-center justify-between px-6">
                <span className="font-heading text-lg font-semibold text-[rgb(var(--foreground))]">
                  Menu
                </span>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 text-[rgb(var(--foreground))]"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Language Selector */}
              <div className="px-6 py-2">
                <div className="flex items-center gap-2 text-sm text-[rgb(var(--foreground-muted))] mb-3">
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
                          ? 'bg-[rgb(var(--gold))/20] text-[rgb(var(--gold))]'
                          : 'bg-[rgb(var(--surface))] text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--gold))/10]'
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
                        ? 'bg-[rgb(var(--gold))/20] text-[rgb(var(--gold))]'
                        : 'text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--gold))/10]'
                    )}
                  >
                    {getNavLabel(link.label)}
                  </Link>
                ))}
                <Link
                  href="/reading"
                  onClick={() => setIsMobileOpen(false)}
                  className="mt-4 rounded-full bg-gradient-to-r from-[rgb(var(--gold-start))] via-[rgb(var(--gold))] to-[rgb(var(--gold-start))] px-6 py-3 text-center font-semibold text-black"
                >
                  {isHydrated ? t('cta.startReading') : 'Begin Your Reading'}
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}