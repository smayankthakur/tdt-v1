'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Calendar, Clock, Heart, Briefcase, Wallet, Star, 
  HelpCircle, ChevronLeft, ChevronRight, Check, Phone, Mail, User, MessageSquare 
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
import Button from '@/components/ui/button';
import FloatingInput, { FloatingTextarea } from '@/components/ui/FloatingInput';

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
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--background))] via-[rgb(var(--surface))] to-[rgb(var(--background))] py-16 md:py-20">
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
                <Sparkles className="h-6 w-6 text-[rgb(var(--gold))]" />
                <h1 className="font-heading text-3xl md:text-4xl text-[rgb(var(--foreground))]">
                  Book Your Reading
                </h1>
              </div>
              <p className="text-[rgb(var(--foreground-secondary))] max-w-xl mx-auto">
                Connect with a professional tarot reader for personalized guidance
              </p>
              <div className="flex items-center justify-center gap-1 mt-6">
                {['select-topic', 'select-date', 'select-time', 'select-duration', 'details', 'payment'].map((s, i) => (
                  <div 
                    key={s}
                    className={`w-2 h-2 rounded-full transition-all ${
                      (step === s) ? 'bg-[rgb(var(--gold))] scale-125' :
                      (['select-topic', 'select-date', 'select-time', 'select-duration', 'details', 'payment'].indexOf(step) > i ? 'bg-[rgb(var(--gold))/50]' :
                      'bg-[rgb(var(--surface))]'
                    )}`}
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
                      className="p-6 rounded-2xl border border-[rgb(var(--surface))]/30 bg-[rgb(var(--surface))]/20 hover:bg-[rgb(var(--surface))]/30 hover:border-purple-600/50 transition-all text-center group"
                    >
                      <span className="text-3xl mb-3 block">{topic.emoji}</span>
                      <span className="font-medium [rgb(var(--foreground))] block group-hover:text-white">{topic.label}</span>
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
                  className="p-2 rounded-full border border-[rgb(var(--surface))]/30 hover:bg-[rgb(var(--surface))]/30 disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5 [rgb(var(--foreground-secondary))]" />
                </button>
                <div className="flex items-center gap-2 [rgb(var(--foreground))]">
                  <Calendar className="h-5 w-5" />
                  <span>Select a Date</span>
                </div>
                <button 
                  onClick={() => setCurrentMonthStart(currentMonthStart + 7)}
                  disabled={currentMonthStart >= availableDates.length - 7}
                  className="p-2 rounded-full border border-[rgb(var(--surface))]/30 hover:bg-[rgb(var(--surface))]/30 disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5 [rgb(var(--foreground-secondary))]" />
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
                      className="p-4 rounded-xl border border-[rgb(var(--surface))]/30 bg-[rgb(var(--surface))]/20 hover:bg-[rgb(var(--surface))]/30 hover:border-purple-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-center"
                    >
                      <span className="[rgb(var(--foreground-secondary))]/60 text-xs block">{dateObj.dayName}</span>
                      <span className="text-lg font-medium text-purple-100 block">{dateObj.displayDate}</span>
                      <span className="text-xs [rgb(var(--foreground-muted))]/60">{availableSlots} slots</span>
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
              <div className="flex items-center justify-center gap-2 [rgb(var(--foreground))]">
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
                    className="p-4 rounded-xl border border-[rgb(var(--surface))]/30 bg-[rgb(var(--surface))]/20 hover:bg-[rgb(var(--surface))]/30 hover:border-purple-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-center"
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
              <div className="text-center [rgb(var(--foreground))] mb-4">Choose Session Length</div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {DURATION_OPTIONS.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleDurationSelect(option.value)}
                    className="p-6 rounded-2xl border border-[rgb(var(--surface))]/30 bg-[rgb(var(--surface))]/20 hover:bg-[rgb(var(--surface))]/30 hover:border-purple-600/50 transition-all text-center group"
                  >
                    <span className="text-3xl font-bold text-purple-100 block">{option.value}</span>
                    <span className="[rgb(var(--foreground-secondary))]/60 text-sm">minutes</span>
                    <div className="mt-3 [rgb(var(--gold))] font-semibold">₹{option.price}</div>
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
                  <FloatingInput
                    label="Tumhara naam"
                    value={details.name}
                    onChange={(v) => setDetails({ ...details, name: v })}
                    placeholder="Apna naam yahan likho"
                    icon={<User className="h-5 w-5" />}
                    helperText="Tumhare naam se connection banayein"
                  />
                  
                  <FloatingInput
                    label="Tumhara email"
                    type="email"
                    value={details.email}
                    onChange={(v) => setDetails({ ...details, email: v })}
                    placeholder="name@example.com"
                    icon={<Mail className="h-5 w-5" />}
                    helperText="Results email par bhejege"
                  />
                  
                  <FloatingInput
                    label="WhatsApp number"
                    type="tel"
                    value={details.phone}
                    onChange={(v) => setDetails({ ...details, phone: v })}
                    placeholder="+91 98765 43210"
                    icon={<Phone className="h-5 w-5" />}
                    helperText="WhatsApp par result bhejein"
                  />
                  
                  <FloatingTextarea
                    label="Tumhara sawal"
                    value={details.question}
                    onChange={(v) => setDetails({ ...details, question: v })}
                    placeholder="Jo tumhare mind mein baar baar aa raha hai…"
                    rows={3}
                    icon={<MessageSquare className="h-5 w-5" />}
                    helperText="Jitna clear sawal… utni clear direction"
                  />
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleDetailsSubmit}
                  disabled={!canProceed()}
                >
                  Continue
                </Button>
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
              <div className="p-6 rounded-2xl border border-[rgb(var(--surface))]/30 bg-[rgb(var(--surface))]/20">
                <h3 className="text-xl font-heading [rgb(var(--foreground))] mb-4">Booking Summary</h3>
                <div className="space-y-2 [rgb(var(--foreground-secondary))]/70">
                  <p><span className="[rgb(var(--foreground-muted))]">Topic:</span> {TOPICS.find(t => t.id === selectedTopic)?.label}</p>
                  <p><span className="[rgb(var(--foreground-muted))]">Date:</span> {formatBookingDate(selectedDate, selectedTime)}</p>
                  <p><span className="[rgb(var(--foreground-muted))]">Duration:</span> {selectedDuration} minutes</p>
                  <p><span className="[rgb(var(--foreground-muted))]">Name:</span> {details.name}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[rgb(var(--surface))]/30">
                  <p className="flex justify-between text-lg">
                    <span className="[rgb(var(--foreground-secondary))]">Total</span>
                    <span className="[rgb(var(--gold))] font-bold">₹{calculateBookingAmount(selectedDuration!)}</span>
                  </p>
                </div>
              </div>
              
               <Button
                 size="lg"
                 className="w-full"
                 onClick={handleBooking}
                 disabled={isProcessing}
               >
                 {isProcessing ? (
                   <>
                     <Sparkles className="h-5 w-5 animate-spin" />
                     Securing your path...
                   </>
                 ) : (
                   <>
                     <Sparkles className="h-5 w-5" />
                     Continue
                   </>
                 )}
               </Button>
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
                <Check className="h-12 w-12 [rgb(var(--gold))]" />
              </motion.div>
              
              <h2 className="font-heading text-3xl [rgb(var(--foreground))] mb-4">Your Reading is Booked</h2>
              <p className="[rgb(var(--foreground-secondary))]/60 mb-6">
                The cards are ready to speak with you. Check your WhatsApp for confirmation details.
              </p>
              
              <div className="p-4 rounded-xl border border-[rgb(var(--surface))]/30 bg-[rgb(var(--surface))]/20 inline-block text-left">
                <p className="text-sm [rgb(var(--foreground-muted))]">Booking ID</p>
                <p className="[rgb(var(--foreground))] font-mono">{bookingId}</p>
              </div>
              
              <Link 
                href="/"
                className="block mt-8 [rgb(var(--foreground-muted))] hover:[rgb(var(--foreground))]"
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
            className="block mx-auto mt-8 text-sm text-purple-500 hover:[rgb(var(--foreground-secondary))]"
          >
            ← Go back
          </motion.button>
        )}
      </div>
    </div>
  );
}
