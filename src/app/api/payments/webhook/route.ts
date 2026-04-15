import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { verifyPaymentSignature } from '@/lib/payments/razorpay';

interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        status: string;
        amount: number;
      };
    };
    subscription?: {
      entity: {
        id: string;
        status: string;
      };
    };
  };
  created_at: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    if (!signature) {
      console.log('[Webhook] No signature provided');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const event = JSON.parse(body) as RazorpayWebhookEvent;

    console.log('[Webhook] Received event:', event.event);

    const supabase = await createServerClient();
    
    if (!supabase) {
      console.log('[Webhook] No Supabase client, logging event:', event.event);
      return NextResponse.json({ received: true });
    }

    switch (event.event) {
      case 'payment.captured': {
        const payment = event.payload.payment?.entity;
        if (!payment) break;

        const orderId = payment.order_id;
        
        const { data: paymentRecord } = await supabase
          .from('payments')
          .select('user_id, plan_type')
          .eq('razorpay_order_id', orderId)
          .single();

        if (paymentRecord) {
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);

          await supabase
            .from('users')
            .update({
              plan: paymentRecord.plan_type,
              subscription_status: 'active',
              subscription_end_date: endDate.toISOString(),
              auto_renew: true,
            })
            .eq('id', paymentRecord.user_id);

          await supabase
            .from('payments')
            .update({
              status: 'completed',
              razorpay_payment_id: payment.id,
              paid_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', orderId);

          console.log('[Webhook] Payment captured, subscription activated for user:', paymentRecord.user_id);
        }
        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment?.entity;
        if (!payment) break;

        await supabase
          .from('payments')
          .update({
            status: 'failed',
            razorpay_payment_id: payment.id,
          })
          .eq('razorpay_order_id', payment.order_id);

        console.log('[Webhook] Payment failed for order:', payment.order_id);
        break;
      }

      case 'subscription.activated': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('razorpay_subscription_id', subscription.id)
          .single();

        if (user) {
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);

          await supabase
            .from('users')
            .update({
              subscription_status: 'active',
              subscription_end_date: endDate.toISOString(),
            })
            .eq('id', user.id);

          console.log('[Webhook] Subscription activated:', subscription.id);
        }
        break;
      }

      case 'subscription.cancelled': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('razorpay_subscription_id', subscription.id)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({
              plan: 'free',
              subscription_status: 'cancelled',
              auto_renew: false,
            })
            .eq('id', user.id);

          console.log('[Webhook] Subscription cancelled:', subscription.id);
        }
        break;
      }

      case 'subscription.charged': {
        const subscription = event.payload.subscription?.entity;
        if (!subscription) break;

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('razorpay_subscription_id', subscription.id)
          .single();

        if (user) {
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);

          await supabase
            .from('users')
            .update({
              subscription_end_date: endDate.toISOString(),
            })
            .eq('id', user.id);

          console.log('[Webhook] Subscription renewed for:', subscription.id);
        }
        break;
      }

      default:
        console.log('[Webhook] Unhandled event:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Payment Webhook',
    version: '1.0.0',
    status: 'ready',
    supportedEvents: [
      'payment.captured',
      'payment.failed',
      'subscription.activated',
      'subscription.cancelled',
      'subscription.charged',
    ],
  });
}