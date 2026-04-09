'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

const navLinks = [
  { href: '/reading', label: 'Reading' },
  { href: '/booking', label: 'Booking' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isHome
          ? 'bg-transparent'
          : 'bg-background/90 backdrop-blur-md shadow-sm'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            className="relative"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="font-heading text-xl font-semibold text-foreground">
            Divine Tarot
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative font-medium transition-colors duration-300 hover:text-primary',
                pathname === link.href
                  ? 'text-primary'
                  : 'text-foreground-secondary'
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"
                  layoutId="navbar-indicator"
                />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}