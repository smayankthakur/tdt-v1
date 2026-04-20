'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/button';

interface HeaderProps {
  variant?: 'full' | 'minimal';
  showNav?: boolean;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/yesno', label: 'Yes/No' },
  { href: '/reading', label: 'Reading' },
  { href: '/premium', label: 'Premium' },
  { href: '/booking', label: 'Book Reading' },
];

export default function Header({ variant = 'full', showNav = true }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Glass Background with Subtle Bottom Fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--background))/80] to-transparent" />
      <div className="absolute inset-0 bg-[rgb(var(--background))/60] backdrop-blur-xl" />
      
      {/* Content */}
      <div className="relative mx-auto flex h-[68px] max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <Image
              src="/tdt-v3/logo.png"
              alt="The Devine Tarot"
              width={40}
              height={40}
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
            {/* Logo Glow */}
            <div className="absolute inset-0 bg-[rgb(var(--gold))]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-heading text-xl font-semibold text-[rgb(var(--foreground))] hidden sm:block">
            The Devine Tarot
          </span>
        </Link>

        {/* Navigation */}
        {showNav && variant === 'full' && (
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-medium text-sm text-[rgb(var(--foreground-secondary))] hover:text-[rgb(var(--gold))] transition-colors duration-200 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[rgb(var(--gold))] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>
        )}

        {/* CTA */}
        <div>
          <Button size="sm">
            <Link href="/reading">Continue</Link>
          </Button>
        </div>
      </div>

      {/* Bottom Fade Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(var(--gold))/20] to-transparent" />
    </motion.header>
  );
}