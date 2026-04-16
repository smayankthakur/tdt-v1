'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CTAButton from '@/components/CTAButton';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#1A1A2E] to-[#0B0B0F] py-24">
      <div className="mx-auto max-w-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-4xl text-purple-200 mb-4">
            Get In Touch
          </h1>
          <p className="text-purple-200/60">
            Have a question? We would love to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 rounded-2xl bg-[#1A1A2E]/50 border border-purple-800/50"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-heading text-xl text-purple-200 mb-2">
                Message Sent
              </h3>
              <p className="text-purple-200/60">
                We will get back to you soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-xl border-purple-800/50 bg-[#1A1A2E] px-4 py-6 text-purple-100 placeholder:text-purple-300/40"
                />
              </div>
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-xl border-purple-800/50 bg-[#1A1A2E] px-4 py-6 text-purple-100 placeholder:text-purple-300/40"
                />
              </div>
              <div>
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="min-h-[150px] resize-none rounded-xl border-purple-800/50 bg-[#1A1A2E] px-4 py-4 text-purple-100 placeholder:text-purple-300/40"
                />
              </div>
              <div className="text-center">
                <CTAButton type="submit">Send Message</CTAButton>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}