'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-background border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center gap-4">
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
            <p className="text-foreground-secondary/60 text-sm italic">
              Clarity begins within
            </p>
          </div>

          {/* Subtle Links */}
          <nav className="flex items-center gap-8">
            <Link
              href="/about"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              Privacy
            </Link>
          </nav>

          {/* Credit */}
          <div className="text-center">
            <p className="text-xs text-white/30">
              © {currentYear} Sitelytc Digital Media. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}