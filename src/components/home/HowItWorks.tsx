'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Sparkles, Eye } from 'lucide-react';

const steps = [
  { 
    icon: MessageCircle, 
    title: 'Ask Your Question', 
    description: 'Focus on what truly troubles your heart',
    number: '01'
  },
  { 
    icon: Sparkles, 
    title: 'Pick Your Cards', 
    description: 'Select three cards from the mystical deck',
    number: '02'
  },
  { 
    icon: Eye, 
    title: 'Get Your Reading', 
    description: 'Receive personalized insights instantly',
    number: '03'
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function HowItWorks() {
  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-[#EAEAEA]">
            How It Works
          </h2>
          <p className="mt-4 text-[#A8A8A8]">
            Three simple steps to unlock your clarity
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-8 md:grid-cols-3"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative text-center p-8"
            >
              <div className="mb-6 flex justify-center">
                <motion.div
                  className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#1A1A1A]/80 shadow-[0_0_30px_rgba(0,0,0,0.4)] border border-[#F4C542]/10"
                  whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F4C542]/10 to-[#C1121F]/10" />
                  <step.icon className="h-9 w-9 text-[#F4C542] relative z-10" />
                  <motion.div
                    className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#F4C542] to-[#FFD84D] text-sm font-bold text-black shadow-md"
                  >
                    {step.number}
                  </motion.div>
                </motion.div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="absolute top-[60%] left-[60%] hidden h-px w-[80%] md:block">
                  <motion.div
                    className="h-full w-full bg-gradient-to-r from-[#F4C542]/20 via-[#F4C542]/40 to-[#F4C542]/20"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              )}
              
              <h3 className="font-serif text-xl font-semibold text-[#EAEAEA] mb-2">
                {step.title}
              </h3>
              <p className="text-[#A8A8A8] text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}