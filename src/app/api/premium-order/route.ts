'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { createPremiumOrder, activatePremiumSubscription } from '@/lib/subscription/checkAccess';

/**
 * POST /api/premium-order/create
 * Creates a Razorpay order for premium subscription.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    // Verify user exists
const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, plan, subscription_status')
      .eq('id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('[Premium Order] User lookup error:', userError);
    }

    // If user already has active premium, return success
    if (userData) {
      const isPremiumActive =
        userData.plan === 'premium' &&
        userData.subscription_status === 'active';

      if (isPremiumActive) {
        return NextResponse.json({
          alreadyPremium: true,
          message: 'You already have an active Premium subscription.',
        });
      }
    }

    // Create Razorpay order
    const order = await createPremiumOrder(userId);

    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Store pending payment record
    try {
      await supabase.from('payments').insert({
        user_id: userId,
        amount: 19900,
        currency: 'INR',
        status: 'pending',
        razorpay_order_id: order.orderId,
        plan_type: 'premium',
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[Premium Order] Payment record insert failed:', err);
      // Non-blocking - order was created
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      amount: order.amount,
      key: order.key,
    });
  } catch (error: any) {
    console.error('[Premium Order] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/premium-order/verify
 * Verifies payment and activates subscription.
 */
export async function POST_verify(request: NextRequest) {
  try {
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    if (!userId || !razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await activatePremiumSubscription(userId, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Subscription activated successfully',
      });
    }

    return NextResponse.json(
      { error: result.error || 'Activation failed' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[Premium Verify] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}