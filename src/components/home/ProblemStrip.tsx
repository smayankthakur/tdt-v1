'use client';

import { motion } from 'framer-motion';
import { Moon, Heart, Compass } from 'lucide-react';

const problems = [
  { icon: Moon, title: 'Feeling stuck in your life?', description: 'When everything feels motionless' },
  { icon: Heart, title: 'Confused in love or relationships?', description: 'Your heart deserves honest answers' },
  { icon: Compass, title: 'Unsure about your next move?', description: 'The universe has guidance for you' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ProblemStrip() {
  return (
    <section className="py-section bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-block md:grid-cols-3"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group cursor-pointer rounded-2xl bg-surface-60 p-8 backdrop-blur-sm border border-gold-10 hover:border-gold-30 hover-glow-gold transition-all duration-300"
            >
              <motion.div
                className="mx-auto mb-element flex h-14 w-14 items-center justify-center rounded-full relative gradient-gold-red"
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
              >
                <problem.icon className="h-7 w-7 text-gold" />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(var(--gold),0.2)',
                      '0 0 20px rgba(var(--gold),0.4)',
                      '0 0 10px rgba(var(--gold),0.2)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
              <h3 className="font-heading text-heading text-foreground mb-element text-center">
                {problem.title}
              </h3>
              <p className="text-body-sm text-foreground-muted text-center leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}