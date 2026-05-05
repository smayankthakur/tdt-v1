'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { Lock, Heart, Sparkles, Mail } from 'lucide-react';

// Social icons as custom SVGs (clean, minimal)
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.5 6.2a2.8 2.8 0 0 0-1.9-2C19.8 4 12 4 12 4s-7.8 0-9.6.2a2.8 2.8 0 0 0-1.9 2A30 30 0 0 0 0 11.8a30 30 0 0 0 .5 5.4 2.8 2.8 0 0 0 1.9 2C4.2 20 12 20 12 20s7.8 0 9.6-.2a2.8 2.8 0 0 0 1.9-2 30 30 0 0 0 .5-5.4 30 30 0 0 0-.5-5.4z" />
    <path d="M10 15l5-3-5-3z" />
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const { t, isHydrated } = useLanguage();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail('');
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
  }, []);

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/thedivineetarot",
      icon: InstagramIcon,
    },
    {
      name: "Facebook",
      href: "https://facebook.com/profile.php?id=61578567343068",
      icon: FacebookIcon,
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@TheDivineTarot",
      icon: YoutubeIcon,
    },
    {
      name: "YouTube (2nd Channel)",
      href: "https://youtube.com/@thedivineetarot",
      icon: YoutubeIcon,
    },
  ];

  const trustItems = [
    { icon: Lock, text: 'Secure & Private Readings' },
    { icon: Heart, text: 'Trusted by 7L+ Seekers' },
    { icon: Sparkles, text: 'Authentic Spiritual Guidance' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'The Divine Tarot',
            url: 'https://thedivinetarot.com',
            logo: 'https://thedivinetarot.com/logo.png',
            sameAs: [
              'https://instagram.com/thedivineetarot',
              'https://facebook.com/profile.php?id=61578567343068',
              'https://youtube.com/@TheDivineTarot',
              'https://youtube.com/@thedivineetarot',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'thedivinetarot111@gmail.com',
              contactType: 'customer support',
            },
          }),
        }}
      />

      <footer className="relative bg-[#0B0B0F] border-t border-white/5">
        {/* Signature golden top glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_70%)] pointer-events-none" />

        {/* PHASE 1: Centered premium container */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          
          {/* PHASE 2: Three-column grid with clear hierarchy */}
          <div className="grid md:grid-cols-3 gap-10 mb-16">
            
            {/* LEFT: Brand - larger, brighter */}
            <div className="animate-in">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 border border-gold/30 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="The Divine Tarot Logo"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#EAEAF0]">
                    The Divine Tarot
                  </h3>
                  <p className="text-gold/70 text-xs uppercase tracking-wider">
                    Premium Tarot Guidance
                  </p>
                </div>
              </div>
              <p className="text-[#A1A1AA] text-sm leading-relaxed mb-5">
                {isHydrated ? t('footer.description') : 'Clarity for your path. Guidance for your soul.'}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">
                  {isHydrated ? t('about.redesigned.authority.badge2.title') : '7 Lakh+ Seekers'}
                </span>
              </div>
            </div>

            {/* CENTER: CTA - highest contrast, visual focus */}
            <div className="animate-in md:col-span-1">
              <div className="relative bg-[#1A1A24] border border-gold/30 rounded-2xl p-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-50" />
                <div className="relative">
                  <h3 className="font-serif text-lg md:text-xl font-semibold text-[#EAEAF0] mb-2">
                    Get Daily Divine Insights
                  </h3>
                  <p className="text-[#A1A1AA] text-xs mb-4">
                    Receive intuitive guidance to your inbox.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/20 text-[#EAEAF0] placeholder-[#A1A1AA] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all text-sm"
                      disabled={isSubmitting || isSuccess}
                      aria-label="Email for daily guidance"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        isSuccess
                          ? 'bg-green-600 text-white cursor-default'
                          : isSubmitting
                          ? 'bg-gold/60 text-black cursor-wait'
                          : 'bg-gold text-black hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20'
                      }`}
                    >
                      {isSuccess ? 'Subscribed!' : isSubmitting ? 'Joining...' : 'Unlock Daily Guidance'}
                    </button>
                  </form>
                  {error && <p className="text-red-400 text-xs mt-2" role="alert">{error}</p>}
                </div>
              </div>
            </div>

            {/* RIGHT: Navigation - clean, subtle */}
            <div className="animate-in">
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#A1A1AA] mb-4">
                {isHydrated ? t('footer.quickLinks.title') : 'Quick Links'}
              </h4>
              <ul className="space-y-2">
                {[  
                  { nameKey: 'footer.quickLinks.about', name: 'About', href: '/about' },
                  { nameKey: 'footer.quickLinks.readings', name: 'Readings', href: '/reading' },
                  { nameKey: 'footer.quickLinks.premium', name: 'Premium', href: '/premium' },
                  { nameKey: 'footer.quickLinks.contact', name: 'Contact', href: '/contact' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[#A1A1AA] hover:text-gold transition-colors duration-200 flex items-center gap-2 group text-sm"
                    >
                      <span className="w-1 h-1 rounded-full bg-gold/20 group-hover:bg-gold transition-colors flex-shrink-0" />
                      {isHydrated ? t(link.nameKey) : link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* PHASE 3: Social + Trust - clean separation */}
          <div className="pt-8 border-t border-white/5">

            {/* Social section - exact specification */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Connect With Us
              </h3>

              <div className="flex items-center gap-4 flex-wrap">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-yellow-400 transition-all duration-300 hover:scale-110"
                    title={item.name}
                    aria-label={`Visit our ${item.name}`}
                  >
                    <item.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition" />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-8">

            {/* Trust + Legal */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-3">
                {trustItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-gold/10 text-[#A1A1AA] text-xs"
                    >
                      <Icon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Support */}
              <div className="flex items-center gap-2 text-[#A1A1AA] text-sm">
                <Mail className="w-4 h-4 text-gold/70" />
                <span>Support:</span>
                <a
                  href="mailto:thedivinetarot111@gmail.com"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  thedivinetarot111@gmail.com
                </a>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-[#A1A1AA]/60">
              <div className="text-center md:text-left">
                © <span id="footer-year"></span> The Divine Tarot. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
                <span className="w-px h-3 bg-gold/20" />
                <Link href="/terms" className="hover:text-gold transition-colors">
                  Terms of Service
                </Link>
                <span className="w-px h-3 bg-gold/20" />
                <span>
                  Designed by{' '}
                  <a
                    href="https://www.sitelytc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors"
                  >
                    Sitelytc
                  </a>
                </span>
              </div>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;