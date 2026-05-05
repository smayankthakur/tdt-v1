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

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-in').forEach((el) => {
      observer.observe(el);
    });

    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
  }, []);

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/thedivineetarot',
      icon: InstagramIcon,
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/profile.php?id=61578567343068',
      icon: FacebookIcon,
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@TheDivineTarot',
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
              'https://youtube.com/@thedivinetarot',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'thedivinetarot111@gmail.com',
              contactType: 'customer support',
            },
          } as any),
        }}
      />

      <footer className="relative bg-gradient-to-b from-[#0B0B0F] via-[#0A0A0A] to-background border-t border-gold/10">
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          {/* ========== SECTION 1: BRAND + PURPOSE ========== */}
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            {/* Brand */}
            <div className="md:col-span-4 animate-in">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/20 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="The Divine Tarot Logo"
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#EAEAF0]">
                    The Divine Tarot
                  </h3>
                  <p className="text-[#A1A1AA] text-xs uppercase tracking-wider">
                    Premium Tarot Readings
                  </p>
                </div>
              </div>
              <p className="text-[#A1A1AA] text-sm leading-relaxed mb-5 max-w-xs">
                {isHydrated ? t('footer.description') : 'Clarity for your path. Guidance for your soul.'}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-gold text-sm font-medium">
                  {isHydrated ? t('about.redesigned.authority.badge2.title') : '7 Lakh+ Seekers'}
                </span>
              </div>
            </div>

            {/* ========== SECTION 2: PRIMARY CTA (CENTER, FOCUS) ========== */}
            <div className="md:col-span-5 animate-in delay-1">
              <div className="relative bg-gradient-to-br from-gold/10 via-purple-500/5 to-gold/5 border border-gold/20 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/20 via-purple-500/10 to-gold/20 opacity-0 hover:opacity-50 transition-opacity duration-500 -z-10 blur-xl" />

                <div className="relative">
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#EAEAF0] mb-2">
                    Get Daily Divine Insights
                  </h3>
                  <p className="text-[#A1A1AA] text-sm mb-5">
                    Receive intuitive guidance directly to your inbox.
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
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gold/20 text-[#EAEAF0] placeholder-[#A1A1AA] focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm min-h-[48px]"
                      disabled={isSubmitting || isSuccess}
                      aria-label="Email for daily guidance"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 min-h-[48px] ${
                        isSuccess
                          ? 'bg-green-600 text-white cursor-default'
                          : isSubmitting
                          ? 'bg-gold/60 text-black cursor-wait'
                          : 'bg-gradient-to-r from-gold to-gold-light text-black hover:shadow-lg hover:shadow-gold/25 hover:scale-[1.02]'
                      }`}
                    >
                      {isSuccess ? 'Subscribed!' : isSubmitting ? 'Joining...' : 'Unlock Daily Guidance'}
                    </button>
                  </form>
                  {error && <p className="text-red-400 text-sm mt-2" role="alert">{error}</p>}
                </div>
              </div>
            </div>

             {/* ========== SECTION 3: CLEAN NAVIGATION ========== */}
             <div className="md:col-span-3 animate-in delay-2">
               <h4 className="font-serif text-sm uppercase tracking-wider text-[#A1A1AA] mb-4">
                 {isHydrated ? t('footer.quickLinks.title') : 'Quick Links'}
               </h4>
               <ul className="space-y-3 text-sm">
                 {[
                   { nameKey: 'footer.quickLinks.about', name: 'About', href: '/about' },
                   { nameKey: 'footer.quickLinks.readings', name: 'Readings', href: '/reading' },
                   { nameKey: 'footer.quickLinks.premium', name: 'Premium', href: '/premium' },
                   { nameKey: 'footer.quickLinks.contact', name: 'Contact', href: '/contact' },
                 ].map((link) => (
                   <li key={link.name}>
                     <Link
                       href={link.href}
                       className="text-[#A1A1AA] hover:text-gold transition-colors duration-300 flex items-center gap-2 group"
                     >
                       <span className="w-1 h-1 rounded-full bg-gold/30 group-hover:bg-gold transition-colors" />
                       {isHydrated ? t(link.nameKey) : link.name}
                     </Link>
                   </li>
                 ))}
               </ul>
             </div>
          </div>

          {/* ========== SECTION 4 & 5: SOCIAL + TRUST (INLINE) ========== */}
          <div className="grid md:grid-cols-2 gap-8 py-8 border-y border-gold/10">
            {/* Social */}
            <div className="animate-in delay-3">
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#A1A1AA] mb-4">
                {isHydrated ? t('footer.connect.title') : 'Connect With Us'}
              </h4>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name + social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 border border-transparent hover:border-gold/30 hover:bg-gold/10 transition-all duration-300"
                      aria-label={`Visit our ${social.name}`}
                    >
                      <div className="w-9 h-9 rounded-md flex items-center justify-center bg-[#1A1A1F] group-hover:bg-gradient-to-br group-hover:from-gold/20 group-hover:to-gold/10 transition-all duration-300">
                        <Icon className="w-4 h-4 text-[#A1A1AA] group-hover:text-gold transition-colors" />
                      </div>
                      <span className="text-[#A1A1AA] text-sm group-hover:text-[#EAEAF0] transition-colors">
                        {social.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Trust Pillars */}
            <div className="animate-in delay-4">
              <h4 className="font-serif text-sm uppercase tracking-wider text-[#A1A1AA] mb-4">
                {isHydrated ? t('footer.trust.title') : 'Your Trust'}
              </h4>
              <div className="flex flex-wrap gap-3 text-sm">
                {trustItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-gold/10 text-[#A1A1AA]"
                    >
                      <Icon className="w-4 h-4 text-gold" />
                      <span>{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ========== SECTION 6: SUPPORT + BOTTOM BAR ========== */}
          <div className="mt-8 pt-6 border-t border-gold/10">
            {/* Support - minimal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 text-sm">
              <div className="flex items-center gap-2 text-[#A1A1AA]">
                <Mail className="w-4 h-4 text-gold/70" />
                <span>Support: </span>
                <a
                  href="mailto:thedivinetarot111@gmail.com"
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  thedivinetarot111@gmail.com
                </a>
              </div>
              <div className="text-[#A1A1AA] text-xs text-center sm:text-right">
                © <span id="footer-year"></span> The Divine Tarot. {isHydrated ? t('footer.disclaimer') : 'For guidance purposes only.'}
              </div>
            </div>

            {/* Bottom Bar - Legal Links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-gold/10 text-xs text-[#A1A1AA]/60">
              <div className="text-center sm:text-left">
                All rights reserved.
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
