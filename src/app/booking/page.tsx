'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Calendar, Clock, Heart, Briefcase, Wallet, Star, 
  HelpCircle, ChevronLeft, ChevronRight, Check, Phone, Mail, User 
} from 'lucide-react';
import Link from 'next/link';
import { 
  getUpcomingDates, 
  TOPICS, 
  DURATION_OPTIONS, 
  formatBookingDate, 
  calculateBookingAmount,
  generateBookingId,
  type BookingDuration 
} from '@/lib/bookings';

const TOPIC_ICONS: Record<string, typeof Heart> = {
  love: Heart,
  career: Briefcase,
  finances: Wallet,
  life: Star,
  spiritual: Sparkles,
  general: HelpCircle,
};

type BookingStep = 'select-topic' | 'select-date' | 'select-time' | 'select-duration' | 'details' | 'payment' | 'confirmation';

export default function BookingPage() {
  const [step, setStep] = useState<BookingStep>('select-topic');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<BookingDuration | null>(null);
  const [currentMonthStart, setCurrentMonthStart] = useState(0);
  const [details, setDetails] = useState({ name: '', email: '', phone: '', question: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState('');
  
  const availableDates = getUpcomingDates(14);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setStep('select-date');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep('select-time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('select-duration');
  };

  const handleDurationSelect = (duration: BookingDuration) => {
    setSelectedDuration(duration);
    setStep('details');
  };

  const handleDetailsSubmit = () => {
    if (!details.name || !details.email || !details.phone) return;
    setStep('payment');
  };

  const handleBooking = async () => {
    setIsProcessing(true);
    
    const newBookingId = generateBookingId();
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBookingId(newBookingId);
    setBookingConfirmed(true);
    setIsProcessing(false);
    setStep('confirmation');
  };

  const canProceed = () => {
    switch (step) {
      case 'select-topic': return !!selectedTopic;
      case 'select-date': return !!selectedDate;
      case 'select-time': return !!selectedTime;
      case 'select-duration': return !!selectedDuration;
      case 'details': return details.name && details.email && details.phone;
      default: return true;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#1A1A2E] to-[#0B0B0F] py-12 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {step !== 'confirmation' && (
            <motion.div
              key="header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-gold" />
                <h1 className="font-heading text-3xl md:text-4xl text-purple-200">
                  Book Your Reading
                </h1>
              </div>
              <p className="text-purple-300/60 max-w-xl mx-auto">
                Connect with a professional tarot reader for personalized guidance
              </p>
              <div className="flex items-center justify-center gap-1 mt-6">
                {['select-topic', 'select-date', 'select-time', 'select-duration', 'details', 'payment'].map((s, i) => (
                  <div 
                    key={s}
                    className={`w-2 h-2 rounded-full transition-all ${
                      (step === s) ? 'bg-gold scale-125' :
                      (['select-topic', 'select-date', 'select-time', 'select-duration', 'details', 'payment'].indexOf(step) > i ? 'bg-gold/50' :
                      'bg-purple-800'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {step === 'select-topic' && (
            <motion.div
              key="topic"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TOPICS.map((topic, index) => {
                  const Icon = TOPIC_ICONS[topic.id] || HelpCircle;
                  return (
                    <motion.button
                      key={topic.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleTopicSelect(topic.id)}
                      className="p-6 rounded-2xl border border-purple-800/30 bg-purple-900/20 hover:bg-purple-800/30 hover:border-purple-600/50 transition-all text-center group"
                    >
                      <span className="text-3xl mb-3 block">{topic.emoji}</span>
                      <span className="font-medium text-purple-200 block group-hover:text-white">{topic.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 'select-date' && (
            <motion.div
              key="date"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setCurrentMonthStart(Math.max(0, currentMonthStart - 7))}
                  disabled={currentMonthStart === 0}
                  className="p-2 rounded-full border border-purple-800/30 hover:bg-purple-800/30 disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5 text-purple-300" />
                </button>
                <div className="flex items-center gap-2 text-purple-200">
                  <Calendar className="h-5 w-5" />
                  <span>Select a Date</span>
                </div>
                <button 
                  onClick={() => setCurrentMonthStart(currentMonthStart + 7)}
                  disabled={currentMonthStart >= availableDates.length - 7}
                  className="p-2 rounded-full border border-purple-800/30 hover:bg-purple-800/30 disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5 text-purple-300" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableDates.slice(currentMonthStart, currentMonthStart + 7).map((dateObj, index) => {
                  const availableSlots = dateObj.slots.filter(s => s.available).length;
                  return (
                    <motion.button
                      key={dateObj.date}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleDateSelect(dateObj.date)}
                      disabled={availableSlots === 0}
                      className="p-4 rounded-xl border border-purple-800/30 bg-purple-900/20 hover:bg-purple-800/30 hover:border-purple-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-center"
                    >
                      <span className="text-purple-300/60 text-xs block">{dateObj.dayName}</span>
                      <span className="text-lg font-medium text-purple-100 block">{dateObj.displayDate}</span>
                      <span className="text-xs text-purple-400/60">{availableSlots} slots</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 'select-time' && (
            <motion.div
              key="time"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-center gap-2 text-purple-200">
                <Clock className="h-5 w-5" />
                <span>Available Times for {selectedDate}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableDates.find(d => d.date === selectedDate)?.slots.map((slot, index) => (
                  <motion.button
                    key={slot.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className="p-4 rounded-xl border border-purple-800/30 bg-purple-900/20 hover:bg-purple-800/30 hover:border-purple-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-center"
                  >
                    <span className="text-lg text-purple-100">{slot.time}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'select-duration' && (
            <motion.div
              key="duration"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <div className="text-center text-purple-200 mb-4">Choose Session Length</div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {DURATION_OPTIONS.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleDurationSelect(option.value)}
                    className="p-6 rounded-2xl border border-purple-800/30 bg-purple-900/20 hover:bg-purple-800/30 hover:border-purple-600/50 transition-all text-center group"
                  >
                    <span className="text-3xl font-bold text-purple-100 block">{option.value}</span>
                    <span className="text-purple-300/60 text-sm">minutes</span>
                    <div className="mt-3 text-gold font-semibold">₹{option.price}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-md mx-auto space-y-6"
            >
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-purple-800/30 bg-purple-900/20 text-purple-100 placeholder:text-purple-600 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
                
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-purple-800/30 bg-purple-900/20 text-purple-100 placeholder:text-purple-600 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
                
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    type="tel"
                    placeholder="WhatsApp Number"
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-purple-800/30 bg-purple-900/20 text-purple-100 placeholder:text-purple-600 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
                
                <textarea
                  placeholder="What's been weighing on your mind? (optional)"
                  value={details.question}
                  onChange={(e) => setDetails({ ...details, question: e.target.value })}
                  rows={3}
                  className="w-full p-4 rounded-xl border border-purple-800/30 bg-purple-900/20 text-purple-100 placeholder:text-purple-600 focus:border-purple-500 focus:outline-none transition-all resize-none"
                />
              </div>
              
              <button
                onClick={handleDetailsSubmit}
                disabled={!canProceed()}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold text-white hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue to Payment
              </button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div
              key="payment"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-md mx-auto space-y-6"
            >
              <div className="p-6 rounded-2xl border border-purple-800/30 bg-purple-900/20">
                <h3 className="text-xl font-heading text-purple-200 mb-4">Booking Summary</h3>
                <div className="space-y-2 text-purple-300/70">
                  <p><span className="text-purple-400">Topic:</span> {TOPICS.find(t => t.id === selectedTopic)?.label}</p>
                  <p><span className="text-purple-400">Date:</span> {formatBookingDate(selectedDate, selectedTime)}</p>
                  <p><span className="text-purple-400">Duration:</span> {selectedDuration} minutes</p>
                  <p><span className="text-purple-400">Name:</span> {details.name}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-purple-800/30">
                  <p className="flex justify-between text-lg">
                    <span className="text-purple-300">Total</span>
                    <span className="text-gold font-bold">₹{calculateBookingAmount(selectedDuration!)}</span>
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleBooking}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-start to-gold-end font-semibold text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-spin" />
                    Securing your path...
                  </>
                ) : (
                  <>
                  <Sparkles className="h-5 w-5" />
                  Complete Booking
                </>
                )}
              </button>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              key="confirmation"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6"
              >
                <Check className="h-12 w-12 text-gold" />
              </motion.div>
              
              <h2 className="font-heading text-3xl text-purple-200 mb-4">Your Reading is Booked</h2>
              <p className="text-purple-300/60 mb-6">
                The cards are ready to speak with you. Check your WhatsApp for confirmation details.
              </p>
              
              <div className="p-4 rounded-xl border border-purple-800/30 bg-purple-900/20 inline-block text-left">
                <p className="text-sm text-purple-400">Booking ID</p>
                <p className="text-purple-200 font-mono">{bookingId}</p>
              </div>
              
              <Link 
                href="/"
                className="block mt-8 text-purple-400 hover:text-purple-200"
              >
                Return Home
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {!bookingConfirmed && step !== 'confirmation' && step !== 'payment' && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              const steps: BookingStep[] = ['select-topic', 'select-date', 'select-time', 'select-duration', 'details'];
              const currentIndex = steps.indexOf(step);
              if (currentIndex > 0) setStep(steps[currentIndex - 1]);
            }}
            className="block mx-auto mt-8 text-sm text-purple-500 hover:text-purple-300"
          >
            ← Go back
          </motion.button>
        )}
      </div>
    </div>
  );
}