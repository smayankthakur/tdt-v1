import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory storage for demo/dev - replace with database in production
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check for duplicate
    if (subscribers.has(email)) {
      return NextResponse.json(
        { message: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    // Add to subscribers
    subscribers.add(email);

    // Log subscription (in production, save to database)
    console.log('New subscriber:', email, 'at', new Date().toISOString());

    // Send welcome email via Resend (optional)
    try {
      if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL,
          to: email,
          subject: 'Welcome to The Divine Tarot ✨',
          html: `
            <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #FFD700, #FF4D4D); border-radius: 12px; margin-bottom: 15px;">
                  <svg style="width: 35px; height: 35px; color: #000; margin: 12px;" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a10 10 0 0 1 0 20" />
                    <path d="M12 2v20" />
                    <path d="M12 12l8-4" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
                <h1 style="color: #EAEAF0; font-size: 24px; margin: 0;">Welcome to The Divine Tarot</h1>
              </div>
              <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6;">
                Dear Seeker,<br><br>
                Thank you for joining our community of tarot enthusiasts. You will now receive daily guidance, cosmic insights, and exclusive readings to help illuminate your path.<br><br>
                Your intuition is your greatest guide, and we're here to help you tap into its wisdom.<br><br>
                With light and love,<br>
                <strong style="color: #FFD700;">The Divine Tarot Team</strong>
              </p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #3C281A; text-align: center;">
                <p style="color: #666; font-size: 12px; margin: 0;">
                  If you wish to unsubscribe, reply to this email or click the link in our future messages.
                </p>
              </div>
            </div>
          `
        });
      }
    } catch (emailError) {
      console.warn('Failed to send welcome email:', emailError);
      // Don't fail the subscription if email sending fails
    }

    return NextResponse.json(
      { 
        message: 'You\'re now connected to your daily guidance ✨',
        success: true 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Use POST method to subscribe' },
    { status: 405 }
  );
}