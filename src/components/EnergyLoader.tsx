'use client';

import { motion } from 'framer-motion';

interface EnergyLoaderProps {
  message?: string;
}

export default function EnergyLoader({ message = 'Aligning with your energy...' }: EnergyLoaderProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="relative h-40 w-40"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 blur-xl" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-200 to-primary animate-pulse-glow" />
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200/50" />
        </motion.div>

        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-primary"
            animate={{
              x: [0, -60, 0],
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      <motion.p
        className="mt-8 font-heading text-lg text-foreground-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {message}
      </motion.p>

      <motion.div
        className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.div
          className="h-full bg-primary"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}