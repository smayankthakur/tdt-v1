'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkle, Mail, ArrowUpRight } from 'lucide-react';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/reading', label: 'Reading' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { href: '#', label: 'Instagram', icon: '📸' },
  { href: '#', label: 'Twitter', icon: '🐦' },
  { href: '#', label: 'YouTube', icon: '📺' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0B0F] border-t border-purple-900/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Column 1 - Logo & Description */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/tdt-v3/logo.png"
                  alt="The Devine Tarot Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-heading text-xl font-semibold text-purple-200">
The Devine Tarot
              </span>
            </Link>
            <p className="text-purple-200/60 text-sm leading-relaxed max-w-xs">
              Guiding you through clarity and insight. Your journey to
              understanding begins here.
            </p>
          </div>

          {/* Column 2 - Navigation Links */}
          <div className="text-center">
            <h4 className="font-heading font-semibold text-purple-200 mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-purple-200/60 hover:text-purple-400 transition-colors inline-flex items-center justify-center md:justify-start"
                >
                  {link.label}
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 - Contact & Social */}
          <div className="text-center md:text-right">
            <h4 className="font-heading font-semibold text-purple-200 mb-4">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3 items-center md:items-end">
              <a
                href="mailto:support@thedivinetarot.com"
                className="inline-flex items-center gap-2 text-sm text-purple-200/60 hover:text-purple-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                support@thedivinetarot.com
              </a>
              <div className="flex items-center gap-4 mt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-lg opacity-60 hover:opacity-100 transition-opacity"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-purple-900/30" />

        {/* Bottom Copyright */}
        <div className="text-center">
          <p className="text-sm text-purple-200/60">
            © {currentYear} The Devine Tarot. All rights reserved.
          </p>
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-purple-300/40">
            <Sparkle className="h-3 w-3 text-purple-400" />
            <span>Made with cosmic energy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}