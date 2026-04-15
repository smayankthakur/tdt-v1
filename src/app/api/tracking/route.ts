import { NextResponse } from 'next/server';
import { trackToSupabase, getFunnelAnalytics, getConversionMetrics, getTopPerformingPages, TrackingEvent } from '@/lib/analytics/tracking';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'track-event') {
      const event: TrackingEvent = {
        userId: body.userId,
        sessionId: body.sessionId,
        eventName: body.eventName,
        eventCategory: body.eventCategory || 'general',
        pageUrl: body.pageUrl,
        referrer: body.referrer,
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        metadata: body.metadata,
      };

      await trackToSupabase(event);

      return NextResponse.json({
        success: true,
        event: body.eventName,
      });
    }

    if (action === 'track-page-view') {
      const event: TrackingEvent = {
        userId: body.userId,
        sessionId: body.sessionId,
        eventName: body.pageName ? `page_view_${body.pageName}` : 'page_view',
        eventCategory: 'navigation',
        pageUrl: body.pageUrl,
        referrer: body.referrer,
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
      };

      await trackToSupabase(event);

      return NextResponse.json({
        success: true,
        action: 'page_view_tracked',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[Tracking API] Error:', error);
    return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'funnel') {
      const days = parseInt(searchParams.get('days') || '7');
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const endDate = new Date();
      
      const funnel = await getFunnelAnalytics(startDate, endDate);

      return NextResponse.json({
        action: 'funnel',
        period: `${days} days`,
        funnel,
      });
    }

    if (action === 'metrics') {
      const metrics = await getConversionMetrics();

      return NextResponse.json({
        action: 'metrics',
        ...metrics,
      });
    }

    if (action === 'top-pages') {
      const pages = await getTopPerformingPages();

      return NextResponse.json({
        action: 'top-pages',
        pages,
      });
    }

    return NextResponse.json({
      endpoint: 'Tracking API',
      version: '1.0.0',
      status: 'ready',
      actions: {
        'track-event': 'Track custom event',
        'track-page-view': 'Track page view',
        'GET ?action=funnel': 'Get funnel data',
        'GET ?action=metrics': 'Get conversion metrics',
        'GET ?action=top-pages': 'Get top performing pages',
      },
    });

  } catch (error) {
    console.error('[Tracking API] GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}