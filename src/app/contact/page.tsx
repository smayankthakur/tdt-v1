'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Phone, MapPin, Clock, User, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import Button from '@/components/ui/button';
import { FloatingInput, FloatingTextarea } from '@/components/ui/FloatingInput';

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
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--background))] py-16 md:py-20">
      <div className="mx-auto max-w-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-3xl md:text-4xl text-[rgb(var(--foreground))] mb-4">
            Get In Touch
          </h1>
          <p className="text-[rgb(var(--foreground-secondary))]">
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
              className="text-center p-8 rounded-2xl bg-[rgb(var(--surface))/50] border border-[rgb(var(--gold))/20]"
            >
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-heading text-xl text-[rgb(var(--foreground))] mb-2">
                Message Sent
              </h3>
              <p className="text-[rgb(var(--foreground-secondary))]">
                We will get back to you soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <FloatingInput
                label="Tumhara naam"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
                placeholder="Tumhara naam..."
                icon={<User className="h-5 w-5" />}
                helperText="Kyun? Taaki tumhe personal tarah se address kar saken"
                required
              />
              <FloatingInput
                label="Tumhara email"
                value={formData.email}
                onChange={(v) => setFormData({ ...formData, email: v })}
                placeholder="Tumhara email..."
                type="email"
                icon={<Mail className="h-5 w-5" />}
                helperText="Results email par bhejege"
                required
              />
              <FloatingTextarea
                label="Jo mann mein baar baar aa raha hai"
                value={formData.message}
                onChange={(v) => setFormData({ ...formData, message: v })}
                placeholder="Jo mann mein baar baar aa raha hai…"
                rows={5}
                icon={<MessageSquare className="h-5 w-5" />}
                helperText="Jitna clear sawal… utni clear direction"
                required
              />
              <div className="text-center">
                <Button type="submit" size="lg">
                  Continue
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}