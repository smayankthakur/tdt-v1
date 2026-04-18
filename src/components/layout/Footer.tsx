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
    <footer className="relative bg-gradient-to-b from-transparent via-[#0A0A0A]/80 to-[#0A0A0A]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#F4C542]/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Column 1 - Logo & Description */}
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/tdt-v3/logo.png"
                  alt="The Devine Tarot Logo"
                  width={40}
                  height={40}
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#F4C542]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-heading text-xl font-semibold text-[#F5F5F5]">
                The Devine Tarot
              </span>
            </Link>
            <p className="text-[#A8A8A8] text-sm leading-relaxed max-w-xs">
              Guiding you through clarity and insight. Your journey to
              understanding begins here.
            </p>
          </div>

          {/* Column 2 - Navigation Links */}
          <div className="text-center">
            <h4 className="font-heading font-semibold text-[#F5F5F5] mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#A8A8A8] hover:text-[#F4C542] transition-colors inline-flex items-center justify-center md:justify-start group"
                >
                  {link.label}
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-[#F4C542]" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 - Contact & Social */}
          <div className="text-center md:text-right">
            <h4 className="font-heading font-semibold text-[#F5F5F5] mb-4">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3 items-center md:items-end">
              <a
                href="mailto:support@thedivinetarot.com"
                className="inline-flex items-center gap-2 text-sm text-[#A8A8A8] hover:text-[#F4C542] transition-colors"
              >
                <Mail className="h-4 w-4" />
                support@thedivinetarot.com
              </a>
              <div className="flex items-center gap-4 mt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-lg opacity-40 hover:opacity-100 hover:text-[#F4C542] transition-all"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#7A7A7A]">
            © {currentYear} The Devine Tarot. All rights reserved.
          </p>
          <div className="mt-2 flex items-center justify-center gap-1 text-xs text-[#7A7A7A]">
            <Sparkle className="h-3 w-3 text-[#F4C542]" />
            <span>Made with cosmic energy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}