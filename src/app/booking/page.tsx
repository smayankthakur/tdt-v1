'use client';

import { motion } from 'framer-motion';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#1A1A2E] to-[#0B0B0F] py-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl text-purple-200 mb-4">
            Speak Directly With a Tarot Expert
          </h1>
          <p className="text-purple-200/60">
            Connect with our experienced readers for personalized guidance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-purple-800/50 bg-[#1A1A2E]/50 p-2"
        >
          <div className="relative w-full min-h-[600px] rounded-xl overflow-hidden bg-[#0B0B0F]/50">
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
          className="mt-6 text-center text-sm text-purple-300/50"
        >
          Select a time that works for you. Our readers are available for 30, 60, or 90 minute sessions.
        </motion.p>
      </div>
    </div>
  );
}