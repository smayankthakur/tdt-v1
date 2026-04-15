'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap, Heart } from 'lucide-react';

const features = [
  { 
    icon: Brain, 
    title: 'AI That Feels Human', 
    description: 'Not robotic responses - emotionally intelligent guidance that connects with you personally.' 
  },
  { 
    icon: Sparkles, 
    title: 'Personalized Insights', 
    description: 'Every reading is unique. The cards speak to your specific situation, not generic answers.' 
  },
  { 
    icon: Zap, 
    title: 'Instant Clarity', 
    description: 'Get answers in seconds. No waiting, no appointments - just immediate spiritual guidance.' 
  },
  { 
    icon: Heart, 
    title: 'Deep Emotional Connection', 
    description: 'Feel understood. The AI recognizes your emotional state and responds with empathy.' 
  },
];

export default function WhySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#FFFDF8] via-[#FDF6FF] to-[#FFF7E6]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl text-[#1A1A1A] mb-6">
              Why The Devine Tarot?
            </h2>
            <p className="text-lg text-[#6B6B6B] leading-relaxed mb-8">
              We combine ancient tarot wisdom with cutting-edge AI technology to 
              create something truly unique - readings that feel personal, profound, 
              and precisely tailored to you.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed mb-8">
              Unlike generic fortune tellers, our AI understands context, recognizes 
              emotional patterns, and provides guidance that resonates with your 
              specific journey.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/50 text-amber-700 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>10,000+ readings</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/50 text-purple-700 text-sm font-medium">
                <Heart className="h-4 w-4" />
                <span>4.9 rating</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100/50 text-pink-700 text-sm font-medium">
                <Zap className="h-4 w-4" />
                <span>Under 60 seconds</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ x: 8, transition: { duration: 0.3 } }}
                className="flex gap-4 p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-amber-100/50 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <motion.div
                  className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-purple-100"
                  whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                >
                  <feature.icon className="h-6 w-6 text-purple-500" />
                </motion.div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-[#1A1A1A] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}