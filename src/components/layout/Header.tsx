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
import { buttonVariants } from '@/components/ui/button';

const navLinks = [
  { href: '/', labelKey: 'nav.home' },
  { href: '/reading', labelKey: 'nav.reading' },
  { href: '/yesno', labelKey: 'nav.yesno' },
  { href: '/premium', labelKey: 'nav.premium' },
  { href: '/booking', labelKey: 'nav.bookReading' },
  { href: '/about', labelKey: 'nav.about' },
  { href: '/contact', labelKey: 'nav.contact' },
];

const navLabelKeys: Record<string, Record<Language, string>> = {
  'nav.home': { en: 'Home', hi: 'होम', hinglish: 'Home', ar: 'الرئيسية', he: 'בית' },
  'nav.reading': { en: 'Reading', hi: 'रीडिंग', hinglish: 'Reading', ar: 'القراءة', he: 'קריאה' },
  'nav.yesno': { en: 'Yes/No', hi: 'हाँ/नहीं', hinglish: 'Yes/No', ar: 'نعم/لا', he: 'כן/לא' },
  'nav.premium': { en: 'Premium', hi: 'प्रीमियम', hinglish: 'Premium', ar: 'المتميز', he: 'פרימיום' },
  'nav.bookReading': { en: 'Book Reading', hi: 'बुक रीडिंग', hinglish: 'Book Reading', ar: 'احجز قراءة', he: 'קריאת ספר' },
  'nav.about': { en: 'About', hi: 'हमारे बारे में', hinglish: 'About', ar: 'حول', he: 'עלינו' },
  'nav.contact': { en: 'Contact', hi: 'संपर्क', hinglish: 'Contact', ar: 'اتصل بنا', he: 'צור קשר' },
};

export default function Header() {
  const pathname = usePathname();
  const { language, setLanguage, isHydrated, t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const getNavLabel = (labelKey: string): string => {
    if (!isHydrated) return labelKey.split('.').pop() || labelKey;
    return navLabelKeys[labelKey]?.[language] || labelKey;
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
            <span className="font-heading text-xl font-semibold text-[rgb(var(--foreground))] hidden sm:block">
              The Devine Tarot
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
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
                {getNavLabel(link.labelKey)}
                {pathname === link.href && (
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 w-full bg-[rgb(var(--gold))]"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
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
                    className="absolute right-0 mt-2 w-40 rounded-xl bg-[rgb(var(--surface))] shadow-lg border border-[rgb(var(--gold))/20] py-1"
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
                            : 'text-[rgb(var(--foreground-secondary))] hover:bg-[rgb(var(--gold))/10]'
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

            <div className="hidden md:block">
              <Link href="/reading" className={buttonVariants({ size: 'md' })}>
                {isHydrated ? t('cta.startReading') : 'Continue'}
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-[rgb(var(--foreground))]"
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
              className="fixed right-0 top-0 z-50 h-full w-72 bg-[rgb(var(--background))] shadow-2xl border-l border-[rgb(var(--gold))/20]"
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
                      'py-2 text-sm transition-colors',
                      pathname === link.href
                        ? 'text-[rgb(var(--gold))] font-medium'
                        : 'text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--foreground))]'
                    )}
                  >
                    {getNavLabel(link.labelKey)}
                  </Link>
                ))}
                <div className="pt-2">
                  <Link
                    href="/reading"
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
                  >
                    {isHydrated ? t('cta.startReading') : 'Continue'}
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
