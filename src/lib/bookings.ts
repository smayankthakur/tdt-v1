export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type BookingDuration = 30 | 60 | 90;

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface BookingDate {
  date: string;
  displayDate: string;
  dayName: string;
  slots: TimeSlot[];
}

export interface Booking {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  duration: BookingDuration;
  topic: string;
  question: string;
  status: BookingStatus;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentId?: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const DURATION_OPTIONS: { value: BookingDuration; label: string; price: number }[] = [
  { value: 30, label: '30 minutes', price: 499 },
  { value: 60, label: '60 minutes', price: 999 },
  { value: 90, label: '90 minutes', price: 1499 },
];

export const TOPICS = [
  { id: 'love', label: 'Love & Relationships', emoji: '💕' },
  { id: 'career', label: 'Career & Work', emoji: '💼' },
  { id: 'finances', label: 'Finances & Abundance', emoji: '💰' },
  { id: 'life', label: 'Life Purpose', emoji: '⭐' },
  { id: 'spiritual', label: 'Spiritual Growth', emoji: '✨' },
  { id: 'general', label: 'General Guidance', emoji: '🔮' },
];

const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const baseTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM', '08:00 PM'
  ];
  
  baseTimes.forEach((time, index) => {
    const isBooked = Math.random() < 0.15;
    slots.push({
      id: `${date}-${index}`,
      time,
      available: !isBooked,
    });
  });
  
  return slots;
};

export function getUpcomingDates(days: number = 14): BookingDate[] {
  const dates: BookingDate[] = [];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const today = new Date();
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    if (date.getDay() === 0) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    const dayName = dayNames[date.getDay()];
    const displayDate = `${monthNames[date.getMonth()]} ${date.getDate()}`;
    
    dates.push({
      date: dateStr,
      displayDate,
      dayName,
      slots: generateTimeSlots(dateStr),
    });
  }
  
  return dates;
}

export function generateBookingId(): string {
  return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatBookingDate(date: string, time: string): string {
  const dateObj = new Date(date + 'T00:00:00');
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  return `${dayNames[dateObj.getDay()]}, ${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()} at ${time}`;
}

export function calculateBookingAmount(duration: BookingDuration): number {
  const option = DURATION_OPTIONS.find(o => o.value === duration);
  return option?.price || 999;
}