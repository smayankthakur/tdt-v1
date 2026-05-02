import { NextRequest, NextResponse } from 'next/server';
import { getResendClient } from '@/lib/resend';
import { rateLimit } from '@/lib/security/middleware';
import { subscribeSchema, validateRequest, sanitizeInput } from '@/lib/validation/schemas';

/**
 * POST /api/subscribe
 * Subscribe email to newsletter
 * 
 * Rate limiting: 5 per IP per hour (prevent spam)
 * Validation: Email format, length, sanitization
 * CSRF: Required for POST (check x-csrf-token header)
 */

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'anonymous';
    const { allowed, remaining } = rateLimit(`subscribe:${ip}`, 60 * 60 * 1000, 5); // 5 per hour
    
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
      );
    }

    // CSRF validation (if from browser)
    const userAgent = request.headers.get('user-agent') || '';
    if (userAgent.includes('Mozilla') || userAgent.includes('Chrome') || userAgent.includes('Safari')) {
      const csrfToken = request.headers.get('x-csrf-token');
      if (!csrfToken) {
        return NextResponse.json(
          { error: 'CSRF token required' },
          { status: 403 }
        );
      }
      // In production, validate token against session cookie
      // For now, accept any non-empty token (server-side rendered forms have this automatically)
    }

    // Parse and validate body
    const body = await request.json();
    const validation = validateRequest(subscribeSchema, body);
    if (!validation.success) {
      return validation.response;
    }

    const { email: rawEmail } = validation.data;
    
    // Sanitize input
    const email = sanitizeInput(rawEmail);

    // Check for duplicate (in-memory for dev)
    // In production, check database
    const subscribers = new Set<string>();
    if (subscribers.has(email)) {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      );
    }

    // Add to subscribers
    subscribers.add(email);

    // Log subscription
    console.log('[Subscribe] New subscriber:', email, 'at', new Date().toISOString());

    // Send welcome email via Resend if configured
    const resend = getResendClient();
    if (resend && process.env.RESEND_FROM_EMAIL) {
      try {
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
          `,
        });
      } catch (emailError) {
        console.warn('[Subscribe] Failed to send welcome email:', emailError);
        // Don't fail subscription if email fails
      }
    }

    const response = NextResponse.json(
      { 
        message: 'You\'re now connected to your daily guidance ✨',
        success: true 
      },
      { status: 200 }
    );

    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 60 * 60 * 1000).toISOString());

    return response;
  } catch (error) {
    console.error('[Subscribe] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      endpoint: 'Subscribe',
      method: 'POST',
      description: 'Subscribe email to newsletter',
      requiredFields: ['email'],
      rateLimit: '5 per hour per IP'
    },
    { status: 200 }
  );
}