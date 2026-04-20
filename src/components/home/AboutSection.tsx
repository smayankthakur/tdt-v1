'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';

export default function AboutSection() {
  const { t, isHydrated } = useLanguage();

  return (
    <section className="relative py-24 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-heading text-3xl font-semibold text-foreground mb-6">
              {isHydrated ? t('home.about.title') : 'About The Journey'}
            </h2>
            <div className="space-y-4 text-foreground-secondary/80 leading-relaxed">
              <p>
                {isHydrated ? t('home.about.description') : 'This platform was not created just for readings. It was created to provide clarity when life feels confusing.'}
              </p>
              <p className="font-medium text-foreground/90">
                {isHydrated ? t('home.about.bio') : 'Bharti Singh is a seasoned tarot reader with over 10 years of experience guiding individuals through life\'s uncertainties. Her approach blends ancient wisdom with intuitive insight, offering clarity and direction when you need it most.'}
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
              >
                <span>{isHydrated ? t('home.about.linkText') : 'Learn more about us'}</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <Image
                src="/tdt-v3/bharti.jpg"
                alt="Bharti Singh - Founder"
                fill
                className="object-cover rounded-full"
              />
              <div className="absolute inset-0 rounded-full border border-gold/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}