'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <section className="relative py-24 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Text Side */}
          <div className="order-2 md:order-1">
            <h2 className="font-heading text-3xl font-semibold text-foreground mb-6">
              About The Journey
            </h2>
            <div className="space-y-4 text-foreground-secondary/80 leading-relaxed">
              <p>
                This platform was not created just for readings. It was created to provide clarity when life feels confusing.
              </p>
              <p>
                The readings are designed to feel personal—the kind of guidance that resonates deeply, as if someone truly understands what you are going through.
              </p>
            </div>
            <div className="mt-8">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
              >
                <span>Learn more about us</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Image Side */}
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