'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import CTAButton from '@/components/CTAButton';
import { Sparkles, Sparkle, Eye, Heart } from 'lucide-react';

const steps = [
  { icon: Heart, title: 'Ask Your Question', description: 'Focus on what troubles your heart' },
  { icon: Sparkles, title: 'Draw Your Cards', description: 'Select three cards from the deck' },
  { icon: Eye, title: 'Receive Insight', description: 'Get your personalized reading' },
];

const testimonials = [
  { name: 'Sarah M.', text: 'The reading was eerily accurate. It helped me see my situation clearly.', role: 'Verified Reader' },
  { name: 'James L.', text: 'I was skeptical, but the insights were profound. Highly recommend.', role: 'Verified Reader' },
  { name: 'Emily R.', text: 'Beautiful experience. The cards revealed what I needed to hear.', role: 'Verified Reader' },
];

export default function Home() {
  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-amber-50/30 overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.15),transparent)]" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Sparkle className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="font-heading text-5xl leading-tight text-foreground md:text-7xl">
              Confused About Your Path?
              <br />
              <span className="text-primary">The Cards Will Show You</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-foreground-secondary">
              Get answers from the universe in seconds
            </p>
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Link href="/reading">
                <CTAButton size="lg">Start Your Reading</CTAButton>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background-secondary">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl text-foreground">How It Works</h2>
            <p className="mt-4 text-foreground-secondary">Three simple steps to clarity</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="text-center p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div
                  className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
                  whileHover={{ scale: 1.1 }}
                >
                  <step.icon className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="font-heading text-xl text-foreground mb-2">{step.title}</h3>
                <p className="text-foreground-secondary">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl text-foreground">What Others Are Saying</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="p-8 rounded-2xl bg-background-secondary border border-primary/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="mb-4 text-amber-400">{'⭐'.split('').map((s, i) => <span key={i}>{s}</span>)}</div>
                <p className="text-foreground-secondary italic mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-medium">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-foreground-secondary">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-amber-50 via-background to-amber-100/30">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-4xl text-foreground mb-4">
              Ready for Clarity?
            </h2>
            <p className="text-xl text-foreground-secondary mb-8">
              The universe is waiting to guide you
            </p>
            <Link href="/reading">
              <CTAButton size="lg">Begin Your Reading</CTAButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}