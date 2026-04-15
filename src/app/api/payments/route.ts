import { NextResponse } from 'next/server';
import { 
  initiatePayment, 
  verifyAndActivateSubscription, 
  checkSubscriptionStatus,
  checkReadingAccess,
  incrementReadingCount,
  cancelUserSubscription
} from '@/lib/payments/access-control';
import { SUBSCRIPTION_PLANS, PlanType } from '@/lib/payments/plans';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, userId } = body;

    if (action === 'initiate-payment') {
      const { planType } = body;
      
      if (!userId || !planType) {
        return NextResponse.json({ error: 'userId and planType required' }, { status: 400 });
      }

      if (!['premium', 'pro'].includes(planType)) {
        return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
      }

      const result = await initiatePayment(userId, planType);

      if (!result) {
        return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
      }

      return NextResponse.json({
        action: 'initiate-payment',
        orderId: result.orderId,
        amount: result.amount,
        key: result.key,
        plan: SUBSCRIPTION_PLANS[planType as keyof typeof SUBSCRIPTION_PLANS],
      });
    }

    if (action === 'verify-payment') {
      const { 
        userId: verifyUserId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planType 
      } = body;

      if (!verifyUserId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planType) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const result = await verifyAndActivateSubscription(verifyUserId, {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        planType,
      });

      return NextResponse.json({
        action: 'verify-payment',
        ...result,
      });
    }

    if (action === 'check-status') {
      if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
      }

      const status = await checkSubscriptionStatus(userId);

      return NextResponse.json({
        action: 'check-status',
        ...status,
        plans: SUBSCRIPTION_PLANS,
      });
    }

    if (action === 'check-reading-access') {
      if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
      }

      const access = await checkReadingAccess(userId);

      return NextResponse.json({
        action: 'check-reading-access',
        ...access,
      });
    }

    if (action === 'record-reading') {
      if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
      }

      await incrementReadingCount(userId);

      return NextResponse.json({
        action: 'record-reading',
        success: true,
      });
    }

    if (action === 'cancel-subscription') {
      if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
      }

      const result = await cancelUserSubscription(userId);

      return NextResponse.json({
        action: 'cancel-subscription',
        success: result,
      });
    }

    if (action === 'get-plans') {
      return NextResponse.json({
        action: 'get-plans',
        plans: SUBSCRIPTION_PLANS,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[Payment API] Error:', error);
    return NextResponse.json({ error: 'Payment operation failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Payment API',
    version: '1.0.0',
    status: 'ready',
    actions: {
      'initiate-payment': 'Create Razorpay order (userId, planType)',
      'verify-payment': 'Verify payment and activate subscription',
      'check-status': 'Check user subscription status',
      'check-reading-access': 'Check if user can access reading',
      'record-reading': 'Increment reading count for user',
      'cancel-subscription': 'Cancel user subscription',
      'get-plans': 'Get all subscription plans',
    },
    plans: {
      free: 'Free - 1 reading/day',
      premium: '₹299/month - Unlimited readings',
      pro: '₹999/month - Premium + consultation',
    },
    webhookEndpoint: '/api/payments/webhook',
  });
}