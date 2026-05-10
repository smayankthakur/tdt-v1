'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import crypto from 'crypto';

/**
 * POST /api/subscription/webhook
 * Razorpay webhook handler for payment verification and subscription activation.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    const supabase = await createServerClient();

    // Verify webhook signature
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSig !== signature) {
      console.error('[Subscription Webhook] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    switch (event) {
      case 'payment.captured': {
        const payment = payload.payload.payment.entity;
        const orderId = payment.order_id;
        const paymentId = payment.id;
        const amount = payment.amount / 100; // Convert from paise

        // Find the user associated with this order
        // We stored userId in the notes when creating the order
        const { data: orders } = await supabase
          .from('payments')
          .select('user_id')
          .eq('razorpay_order_id', orderId)
          .single();

        if (orders?.user_id) {
          const userId = orders.user_id;

          // Activate premium subscription
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);

          await supabase
            .from('users')
            .update({
              plan: 'premium',
              subscription_status: 'active',
              subscription_end_date: endDate.toISOString(),
              auto_renew: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

          // Update payment record
          await supabase
            .from('payments')
            .update({
              status: 'completed',
              razorpay_payment_id: paymentId,
              paid_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', orderId);

          // Track event
          await supabase.from('events').insert({
            user_id: userId,
            event_name: 'premium_subscribed_webhook',
            metadata: {
              order_id: orderId,
              payment_id: paymentId,
              amount,
            },
          });
        }

        return NextResponse.json({ status: 'ok' });
      }

      case 'subscription.authenticated': {
        const subscription = payload.payload.subscription.entity;
        const { data: payments } = await supabase
          .from('payments')
          .select('user_id')
          .eq('razorpay_subscription_id', subscription.id)
          .single();

        if (payments?.user_id) {
          const endDate = new Date();
          endDate.setMonth(endDate.getDate() + 1);

          await supabase
            .from('users')
            .update({
              plan: 'premium',
              subscription_status: 'active',
              subscription_end_date: endDate.toISOString(),
              auto_renew: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', payments.user_id);
        }

        return NextResponse.json({ status: 'ok' });
      }

      case 'subscription.cancelled': {
        const subscription = payload.payload.subscription.entity;
        const { data: payments } = await supabase
          .from('payments')
          .select('user_id')
          .eq('razorpay_subscription_id', subscription.id)
          .single();

        if (payments?.user_id) {
          await supabase
            .from('users')
            .update({
              plan: 'free',
              subscription_status: 'cancelled',
              auto_renew: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', payments.user_id);
        }

        return NextResponse.json({ status: 'ok' });
      }

      default:
        console.log(`[Subscription Webhook] Unhandled event: ${event}`);
        return NextResponse.json({ status: 'ignored' });
    }
  } catch (error: any) {
    console.error('[Subscription Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}