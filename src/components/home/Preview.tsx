'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';

export default function Preview() {
  return (
    <section className="py-section bg-background">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-block"
        >
          <h2 className="font-heading text-heading text-foreground">
            A Glimpse Into Your Journey
          </h2>
          <p className="mt-element text-foreground-muted">
            What the cards might reveal for you
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl bg-surface-60 backdrop-blur-md border border-gold-20 shadow-glow-black-lg"
        >
          <div className="absolute inset-0 gradient-preview-card" />

          <div className="relative p-8 md:p-12">
            <div className="flex items-center gap-element mb-block">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-gold-start to-gold">
                <Sparkles className="h-5 w-5 text-black" />
              </div>
              <span className="font-heading text-subheading text-foreground">
                Your Reading Preview
              </span>
            </div>

            <div className="space-y-element">
              {/* Preview cards using real images */}
              <div className="flex gap-element justify-center">
                <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gold/30">
                  <Image
                    src="/card_img/The Fool.png"
                    alt="The Fool"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gold/30">
                  <Image
                    src="/card_img/The Lovers.png"
                    alt="The Lovers"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gold/30">
                  <Image
                    src="/card_img/The Star.png"
                    alt="The Star"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-foreground-secondary leading-relaxed italic">
                  <span className="text-gold font-semibold not-italic">The Past:</span> You&apos;ve been at a crossroads, feeling uncertain about which path to take. The decisions you&apos;ve made have led you here, but something still feels unresolved...
                </p>
                <p className="text-foreground-secondary leading-relaxed mt-element italic">
                  <span className="text-gold font-semibold not-italic">The Present:</span> There&apos;s a new opportunity approaching. The universe is aligning to bring clarity to your situation, but you need to trust your intuition...
                </p>
                <p className="text-foreground-secondary leading-relaxed mt-element italic">
                  <span className="text-gold font-semibold not-italic">The Guidance:</span> The cards speak of hope and new beginnings. Whatever you&apos;ve been worrying about, there&apos;s light at the end. Trust the process...
                </p>
              </div>

              <div className="mt-block pt-block border-t border-gold-10">
                <p className="text-body-sm text-foreground-muted text-center italic">
                  This is just a glimpse. Your full reading awaits...
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-block text-center"
        >
          <Link href="/reading">
            <Button size="lg">
              Dekhte hain kya aa raha hai
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-element text-body-sm text-foreground-muted">
            Takes less than 60 seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
}