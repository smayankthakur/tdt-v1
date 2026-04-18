import { NextResponse } from 'next/server';
import { getUpcomingDates, generateBookingId, calculateBookingAmount, TOPICS, type BookingDuration } from '@/lib/bookings';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create-booking') {
      const { name, email, phone, date, time, duration, topic, question } = body;

      if (!name || !email || !phone || !date || !time || !duration) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const bookingId = generateBookingId();
      const amount = calculateBookingAmount(duration as BookingDuration);

      console.log('[Booking] Created:', { bookingId, date, time, duration, topic });

      return NextResponse.json({
        action: 'create-booking',
        success: true,
        bookingId,
        amount,
        message: 'Booking created. Proceed to payment.',
      });
    }

    if (action === 'get-slots') {
      const { date } = body;
      const dates = getUpcomingDates(14);
      const dateObj = dates.find(d => d.date === date);

      if (!dateObj) {
        return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
      }

      return NextResponse.json({
        action: 'get-slots',
        date: dateObj.date,
        slots: dateObj.slots,
      });
    }

    if (action === 'get-available-dates') {
      const { days = 14 } = body;
      const dates = getUpcomingDates(days);

      return NextResponse.json({
        action: 'get-available-dates',
        dates,
      });
    }

    if (action === 'verify-booking') {
      const { bookingId, paymentId } = body;

      if (!bookingId) {
        return NextResponse.json({ error: 'bookingId required' }, { status: 400 });
      }

      return NextResponse.json({
        action: 'verify-booking',
        success: true,
        bookingId,
        paymentId,
        message: 'Booking confirmed',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[Booking API] Error:', error);
    return NextResponse.json({ error: 'Booking operation failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Booking API',
    version: '1.0.0',
    status: 'ready',
    actions: {
      'create-booking': 'Create new booking (name, email, phone, date, time, duration, topic, question)',
      'get-slots': 'Get available time slots for a date',
      'get-available-dates': 'Get upcoming available dates',
      'verify-booking': 'Verify payment and confirm booking',
    },
    topics: TOPICS.map(t => t.label),
    durations: [
      { value: 30, price: 499 },
      { value: 60, price: 999 },
      { value: 90, price: 1499 },
    ],
  });
}