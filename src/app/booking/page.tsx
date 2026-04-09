'use client';

import { motion } from 'framer-motion';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-amber-50/30 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl text-foreground mb-4">
            Speak Directly With a Tarot Expert
          </h1>
          <p className="text-foreground-secondary">
            Connect with our experienced readers for personalized guidance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-primary/20 bg-card p-2"
        >
          <div className="relative w-full min-h-[600px] rounded-xl overflow-hidden bg-muted">
            <iframe
              src="https://calendly.com"
              className="absolute inset-0 w-full h-full border-0"
              title="Booking Calendar"
            />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-foreground-secondary"
        >
          Select a time that works for you. Our readers are available for 30, 60, or 90 minute sessions.
        </motion.p>
      </div>
    </div>
  );
}