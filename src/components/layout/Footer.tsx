'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Shield, Moon, Sparkles } from 'lucide-react';

// Simple SVG icon components for social media (lucide-react doesn't have these)
const Instagram = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const Facebook = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Youtube = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
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
        setTimeout(() => setIsSuccess(false), 5000);
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
      icon: Instagram,
      ariaLabel: 'Visit our Instagram',
    },
    {
      name: 'Facebook',
      url: 'https://facebook.com/profile.php?id=61578567343068',
      icon: Facebook,
      ariaLabel: 'Visit our Facebook page',
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@thedivineetarot',
      icon: Youtube,
      ariaLabel: 'Visit our YouTube channel',
    },
    {
      name: 'YouTube Second',
      url: 'https://www.youtube.com/@TheDivineTarot',
      icon: Youtube,
      ariaLabel: 'Visit our second YouTube channel',
    },
  ];

  const trustBadges = [
    { icon: Shield, label: 'Secure Experience' },
    { icon: Moon, label: 'Trusted by Tarot Seekers' },
    { icon: Sparkles, label: 'AI + Intuition Powered' },
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

      <footer className="relative bg-[#000] border-t border-white/10 mt-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-[#0B0B0F] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="lg:hidden mb-10 p-6 rounded-2xl bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FF4D4D]/5 border border-[#FFD700]/10">
            <h3 className="font-serif text-xl font-semibold text-[#EAEAF0] mb-2">
              Get Daily Tarot Guidance
            </h3>
            <p className="text-[#A1A1AA] text-sm mb-4">
              Receive personalized insights and cosmic updates directly to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[#3C281A] text-[#EAEAF0] placeholder-[#A1A1AA] focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                disabled={isSubmitting || isSuccess}
                aria-label="Email address for newsletter subscription"
              />
              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                  isSuccess
                    ? 'bg-green-600 text-white cursor-default'
                    : isSubmitting
                    ? 'bg-[#FFD700]/50 text-[#000] cursor-wait'
                    : 'bg-gradient-to-r from-[#FFD700] to-[#FF4D4D] text-[#000] hover:shadow-lg hover:shadow-[#FFD700]/25 hover:scale-[1.02]'
                }`}
              >
                {isSuccess ? "You're now connected to your daily guidance ✨" :
                 isSubmitting ? 'Connecting...' : 'Get My Daily Reading'}
              </button>
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}
            </form>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-3 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FF4D4D] flex items-center justify-center shadow-lg shadow-[#FFD700]/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 text-[#000]">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a10 10 0 0 1 0 20" />
                    <path d="M12 2v20" />
                    <path d="M12 12l8-4" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-[#EAEAF0]">The Divine Tarot</h2>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">
                    Guiding your path with clarity, intuition, and cosmic insight.
                  </p>
                </div>
              </motion.div>

              <div className="hidden lg:block p-5 rounded-2xl bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FF4D4D]/5 border border-[#FFD700]/10">
                <h3 className="font-serif text-lg font-semibold text-[#EAEAF0] mb-2">
                  Get Daily Tarot Guidance
                </h3>
                <p className="text-[#A1A1AA] text-sm mb-4">
                  Receive personalized insights, cosmic updates, and exclusive readings directly to your inbox.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError('');
                        }}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-[#3C281A] text-[#EAEAF0] placeholder-[#A1A1AA] focus:outline-none focus:border-[#FFD700] focus:ring-2 focus:ring-[#FFD700]/20 transition-all"
                        disabled={isSubmitting || isSuccess}
                        aria-label="Email address for newsletter subscription"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || isSuccess}
                      className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                        isSuccess
                          ? 'bg-green-600 text-white cursor-default'
                          : isSubmitting
                          ? 'bg-[#FFD700]/50 text-[#000] cursor-wait'
                          : 'bg-gradient-to-r from-[#FFD700] to-[#FF4D4D] text-[#000] hover:shadow-lg hover:shadow-[#FFD700]/25 hover:scale-105'
                      }`}
                    >
                      {isSuccess ? 'Subscribed!' : isSubmitting ? 'Joining...' : 'Get Reading'}
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  {isSuccess && (
                    <p className="text-[#FFD700] text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Connected to daily guidance ✨
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div className="lg:col-span-3">
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif font-semibold text-[#EAEAF0] mb-6"
              >
                Connect With Us
              </motion.h4>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-transparent hover:border-[#FFD700]/30 hover:bg-[#FFD700]/5 transition-all duration-300"
                      aria-label={social.ariaLabel}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#1A1A1F] flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#FFD700]/20 group-hover:to-[#FF4D4D]/20 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                        <Icon className="w-5 h-5 text-[#A1A1AA] group-hover:text-[#FFD700] transition-colors duration-300" />
                      </div>
                      <span className="text-[#A1A1AA] group-hover:text-[#EAEAF0] transition-colors font-medium">
                        {social.name}
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            <div className="hidden lg:col-span-3 lg:block">
              <h4 className="font-serif font-semibold text-[#EAEAF0] mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {['About Us', 'Tarot Readings', 'Premium Subscription', 'Contact'].map((link, index) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-[#A1A1AA] hover:text-[#FFD700] transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD700]/30 group-hover:bg-[#FFD700] transition-colors"></span>
                      {link}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <motion.h4
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-serif font-semibold text-[#EAEAF0] mb-6"
              >
                Your Trust, Our Priority
              </motion.h4>
              <div className="space-y-4">
                {trustBadges.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <motion.div
                      key={badge.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-[#3C281A]/50 hover:border-[#FFD700]/30 transition-all duration-300 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FFD700]/10 to-[#FF4D4D]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-[#FFD700]" />
                      </div>
                      <span className="text-[#A1A1AA] group-hover:text-[#EAEAF0] transition-colors">
                        {badge.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#FFD700]/5 to-[#FF4D4D]/10 border border-[#FFD700]/10"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-[#A1A1AA] text-sm">
                    Support:{' '}
                    <a
                      href="mailto:thedivinetarot111@gmail.com"
                      className="text-[#FFD700] hover:underline"
                    >
                      thedivinetarot111@gmail.com
                    </a>
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative mt-12 pt-8 border-t border-[#3C281A]"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <p className="text-[#A1A1AA] text-sm">
                © 2026 The Divine Tarot. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="/privacy"
                  className="text-[#A1A1AA] hover:text-[#FFD700] transition-colors duration-300 text-sm"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="text-[#A1A1AA] hover:text-[#FFD700] transition-colors duration-300 text-sm"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
