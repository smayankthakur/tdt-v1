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
    <section className="py-20 bg-[#0B0B0F] overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-purple-200">
            What Others Are Saying
          </h2>
          <p className="mt-4 text-purple-300/60">
            Real experiences from real seekers
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
              className="group p-8 rounded-2xl bg-[#1A1A2E]/50 border border-purple-800/30 hover:border-purple-600/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-all duration-300"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-purple-400 fill-purple-400" />
                ))}
              </div>
              <p className="text-purple-300/70 italic mb-6 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center border border-purple-700/50">
                  <span className="text-purple-300 font-medium">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-purple-200">{testimonial.name}</p>
                  <p className="text-xs text-purple-400/50">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}