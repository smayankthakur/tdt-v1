'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Icons (exact SVG match from demo)
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.5 6.2a2.8 2.8 0 0 0-1.9-2C19.8 4 12 4 12 4s-7.8 0-9.6.2a2.8 2.8 0 0 0-1.9 2A30 30 0 0 0 0 11.8a30 30 0 0 0 .5 5.4 2.8 2.8 0 0 0 1.9 2C4.2 20 12 20 12 20s7.8 0 9.6-.2a2.8 2.8 0 0 0 1.9-2 30 30 0 0 0 .5-5.4 30 30 0 0 0-.5-5.4z" />
    <path d="M10 15l5-3-5-3z" />
  </svg>
);

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v10" />
    <path d="M12 19a7 7 0 0 0 7-7" />
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

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
        headers: {
          'Content-Type': 'application/json',
        },
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

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://instagram.com/thedivineetarot',
      icon: InstagramIcon,
      ariaLabel: 'Visit our Instagram',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/profile.php?id=61578567343068',
      icon: FacebookIcon,
      ariaLabel: 'Visit our Facebook page',
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@TheDivineTarot',
      icon: YoutubeIcon,
      ariaLabel: 'Visit our YouTube channel',
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@thedivineetarot',
      icon: YoutubeIcon,
      ariaLabel: 'Visit our second YouTube channel',
    },
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Tarot Readings', href: '/reading' },
    { name: 'Premium', href: '/premium' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  const trustBadges = [
    { icon: ShieldIcon, label: 'Secure Experience' },
    { icon: EyeIcon, label: 'Trusted by Seekers' },
    { icon: SparklesIcon, label: 'Guidance Intuition' },
  ];

  // Intersection Observer for scroll animations (matches demo exactly)
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
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

    // Set current year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear().toString();
    }
  }, []);

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
              'https://youtube.com/@thedivineetarot',
              'https://www.youtube.com/@TheDivineTarot',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'thedivinetarot111@gmail.com',
              contactType: 'customer support',
            },
          } as any),
        }}
      />

      <footer className="bg-[#000] border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-5 lg:px-5 py-10 lg:py-12">
          {/* Mobile Newsletter - visible only on mobile */}
          <div className="lg:hidden mb-8 p-5 rounded-2xl bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FF4D4D]/5 border border-[#FFD700]/10">
            <h3 className="font-serif text-lg font-semibold text-[#EAEAF0] mb-2">
              Get Daily Tarot Guidance
            </h3>
            <p className="text-[#A1A1AA] text-sm mb-4">
              Receive personalized insights directly to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#3C281A] text-[#EAEAF0] placeholder-[#A1A1AA] focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all text-sm min-h-[48px]"
                disabled={isSubmitting || isSuccess}
                aria-label="Email address for newsletter subscription"
              />
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 min-h-[48px] ${
                  isSuccess
                    ? 'bg-green-600 text-white cursor-default'
                    : isSubmitting
                    ? 'bg-[#FFD700]/50 text-[#000] cursor-wait'
                    : 'bg-gradient-to-r from-[#FFD700] to-[#FF4D4D] text-[#000] hover:shadow-lg hover:shadow-[#FFD700]/25 hover:scale-[1.02]'
                }`}
              >
                {isSuccess ? 'Subscribed!' : isSubmitting ? 'Joining...' : 'Subscribe'}
              </button>
            </form>
            {error && <p className="text-red-400 text-sm mt-2" role="alert">{error}</p>}
          </div>

          {/* Main Grid - responsive: 1 col mobile, 2 cols tablet, 4 cols desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10" style={{ marginBottom: '40px' }}>
            {/* Brand Section */}
            <div className="animate-in space-y-4 sm:space-y-6">
               <div className="flex items-center gap-3">
                 <Image
                   src="/logo.png"
                   alt="The Divine Tarot Logo"
                   width={48}
                   height={48}
                   className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
                   style={{ borderRadius: '12px' }}
                 />
                 <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-[#EAEAF0]">
                    The Divine Tarot
                  </h2>
                  <p className="text-[#A1A1AA] text-xs">
                    Premium Readings
                  </p>
                </div>
              </div>
              <p className="text-[#A1A1AA] text-sm leading-relaxed">
                Guiding your path with clarity, intuition, and cosmic insight.
              </p>

              {/* Desktop Newsletter - hidden on mobile/tablet */}
              <div className="hidden lg:block p-4 sm:p-5 rounded-2xl bg-white/5 border border-[#3C281A]/50" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,215,0,0.1)', marginTop: '24px' }}>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#EAEAF0] mb-2">
                  Daily Guidance
                </h3>
                <p className="text-[#A1A1AA] text-xs mb-3">
                  Receive exclusive readings to your inbox.
                </p>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter email"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#3C281A] text-[#EAEAF0] placeholder-[#A1A1AA] focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all text-sm min-h-[44px]"
                    disabled={isSubmitting || isSuccess}
                    aria-label="Email address for newsletter subscription"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 min-h-[44px] ${
                      isSuccess
                        ? 'bg-green-600 text-white cursor-default'
                        : isSubmitting
                        ? 'bg-[#FFD700]/50 text-[#000] cursor-wait'
                        : 'bg-gradient-to-r from-[#FFD700] to-[#FF4D4D] text-[#000] hover:shadow-lg hover:shadow-[#FFD700]/25 hover:scale-105'
                    }`}
                  >
                    {isSuccess ? 'Subscribed!' : isSubmitting ? 'Joining...' : 'Join'}
                  </button>
                </form>
                {error && <p className="text-red-400 text-xs mt-1" role="alert">{error}</p>}
              </div>
            </div>

            {/* Social Links */}
            <div className="animate-in delay-1">
              <h3 className="font-serif font-semibold text-[#EAEAF0] mb-3 sm:mb-4 text-sm uppercase tracking-wider">
                Connect With Us
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name + social.url}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-transparent hover:border-[#FFD700]/30 hover:bg-[#FFD700]/5 transition-all duration-300 hover:translate-x-1 min-h-[48px]"
                      aria-label={social.ariaLabel}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#1A1A1F] flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#FFD700]/20 group-hover:to-[#FF4D4D]/20 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#A1A1AA] group-hover:text-[#FFD700] transition-colors duration-300" />
                      </div>
                      <span className="text-[#A1A1AA] group-hover:text-[#EAEAF0] transition-colors text-sm font-medium">
                        {social.name}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="animate-in delay-2">
              <h3 className="font-serif font-semibold text-[#EAEAF0] mb-3 sm:mb-4 text-sm uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-2 sm:space-y-3" style={{ listStyle: 'none' }}>
                {quickLinks.map((link) => (
                  <li key={link.name} style={{ marginBottom: '12px' }}>
                    <Link
                      href={link.href}
                      className="text-[#A1A1AA] hover:text-[#FFD700] transition-colors duration-300 flex items-center gap-2 group text-sm min-h-[44px] py-2"
                      onMouseOver={(e) => { e.currentTarget.style.color = '#FFD700'; }}
                      onMouseOut={(e) => { e.currentTarget.style.color = '#A1A1AA'; }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]/30 group-hover:bg-[#FFD700] transition-colors flex-shrink-0" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="animate-in delay-3">
              <h3 className="font-serif font-semibold text-[#EAEAF0] mb-3 sm:mb-4 text-sm uppercase tracking-wider">
                Your Trust
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {trustBadges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.label}
                      className="flex items-center gap-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-[#3C281A]/50 hover:border-[#FFD700]/30 transition-all duration-300 group min-h-[48px]"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFD700]/10 to-[#FF4D4D]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD700]" />
                      </div>
                      <span className="text-[#A1A1AA] group-hover:text-[#EAEAF0] transition-colors text-sm">
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Contact Info */}
              <div className="mt-4 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#FFD700]/5 to-[#FF4D4D]/10 border border-[#FFD700]/10">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span className="text-[#A1A1AA] text-xs">
                    Support:{' '}
                    <a
                      href="mailto:thedivinetarot111@gmail.com"
                      className="text-[#FFD700] hover:underline"
                    >
                      thedivinetarot111@gmail.com
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-[#3C281A]">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <p className="text-[#A1A1AA] text-sm text-center lg:text-left">
                © <span id="footer-year"></span> The Divine Tarot. All rights reserved.
              </p>
              <div className="flex items-center gap-6 flex-wrap justify-center">
                <span className="text-[#A1A1AA] text-sm">
                  Designed with ❤️ by{' '}
                  <a
                    href="https://www.sitelytc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A1A1AA] hover:text-[#FFD700] transition-colors duration-300"
                    style={{ textDecoration: 'none' }}
                  >
                    Sitelytc Digital Media Pvt. Ltd.
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
