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
    <section className="py-20 bg-[#0A0A0A]">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 md:grid-cols-3"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group cursor-pointer rounded-2xl bg-[#1A1A1A]/50 p-8 backdrop-blur-sm border border-[#F4C542]/10 hover:border-[#F4C542]/30 transition-all duration-300"
            >
              <motion.div
                className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full relative"
                whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                style={{
                  background: 'linear-gradient(135deg, rgba(244,197,66,0.2), rgba(193,18,31,0.2))',
                }}
              >
                <problem.icon className="h-7 w-7 text-[#F4C542]" />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(244,197,66,0.2)',
                      '0 0 20px rgba(244,197,66,0.4)',
                      '0 0 10px rgba(244,197,66,0.2)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>
              <h3 className="font-serif text-xl font-semibold text-[#EAEAEA] mb-2 text-center">
                {problem.title}
              </h3>
              <p className="text-[#A8A8A8] text-sm text-center leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}