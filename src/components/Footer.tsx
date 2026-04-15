'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-background-secondary/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-heading text-lg font-semibold text-foreground">
The Devine Tarot
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/reading"
              className="text-sm text-foreground-secondary transition-colors hover:text-primary"
            >
              Reading
            </Link>
            <Link
              href="/booking"
              className="text-sm text-foreground-secondary transition-colors hover:text-primary"
            >
              Booking
            </Link>
            <Link
              href="/contact"
              className="text-sm text-foreground-secondary transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>

          <p className="text-sm text-foreground-secondary">
            © {new Date().getFullYear()} The Devine Tarot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}