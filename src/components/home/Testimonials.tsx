'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  { 
    name: 'Sarah M.', 
    text: "The reading was eerily accurate. It helped me see my situation clearly and make peace with what I couldn't change.", 
    role: 'Verified Reader',
    rating: 5
  },
  { 
    name: 'James L.', 
    text: "I was skeptical at first, but the insights were profound. This isn't just random cards - there's real depth here.", 
    role: 'Verified Reader',
    rating: 5
  },
  { 
    name: 'Emily R.', 
    text: "Beautiful experience. The cards revealed what I needed to hear, not what I wanted to hear. That's the real gift.", 
    role: 'Verified Reader',
    rating: 5
  },
  { 
    name: 'Michael K.', 
    text: "Got clarity on a career decision that had me stuck for months. The guidance was specific and actionable.", 
    role: 'Verified Reader',
    rating: 5
  },
  { 
    name: 'Priya S.', 
    text: "This felt too accurate... I didn't expect this level of insight from an AI. Still gives me chills thinking about it.", 
    role: 'Verified Reader',
    rating: 5
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#0e0e0e] overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-[#EAEAEA]">
            Voices of the Illuminated
          </h2>
          <p className="mt-4 text-[#7A7A7A]">
            What seekers are saying about their journey
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="group p-8 rounded-2xl bg-[#1a1a1a]/60 border border-[#F4C542]/10 hover:border-[#F4C542]/30 hover:shadow-[0_0_30px_rgba(244,197,66,0.1)] transition-all duration-300"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-[#F4C542] fill-[#F4C542]" />
                ))}
              </div>
              <p className="text-[#B0B0B0] italic mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F4C542]/20 to-[#C1121F]/20 flex items-center justify-center border border-[#F4C542]/20">
                  <span className="text-[#EAEAEA] font-medium">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-[#EAEAEA]">{testimonial.name}</p>
                  <p className="text-xs text-[#7A7A7A]">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}