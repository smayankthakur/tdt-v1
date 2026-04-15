import { NextResponse } from 'next/server';
import { generateDailyVideos, generateVideoScript, processAndPublish, VideoScript } from '@/lib/social/video-generator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'generate-scripts') {
      const { count, type, category } = body;
      
      const scripts: VideoScript[] = [];
      for (let i = 0; i < (count || 3); i++) {
        const script = await generateVideoScript(
          type || 'curiosity',
          category || 'general'
        );
        scripts.push(script);
      }

      return NextResponse.json({
        action: 'generate-scripts',
        timestamp: new Date().toISOString(),
        count: scripts.length,
        scripts
      });
    }

    if (action === 'generate-daily') {
      const videos = await generateDailyVideos();

      return NextResponse.json({
        action: 'generate-daily',
        timestamp: new Date().toISOString(),
        count: videos.length,
        scripts: videos
      });
    }

    if (action === 'publish-youtube') {
      const result = await processAndPublish('youtube');

      return NextResponse.json({
        action: 'publish-youtube',
        timestamp: new Date().toISOString(),
        ...result
      });
    }

    if (action === 'publish-instagram') {
      const result = await processAndPublish('instagram');

      return NextResponse.json({
        action: 'publish-instagram',
        timestamp: new Date().toISOString(),
        ...result
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[Social API] Error:', error);
    return NextResponse.json({ error: 'Video generation failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Social Video API',
    version: '1.0.0',
    status: 'ready',
    actions: {
      'generate-scripts': 'Generate video scripts (count, type, category)',
      'generate-daily': 'Generate daily batch of video scripts',
      'publish-youtube': 'Process and prepare for YouTube upload',
      'publish-instagram': 'Process and prepare for Instagram upload',
    },
    scriptTypes: ['curiosity', 'emotional', 'zodiac'],
    categories: ['love', 'career', 'breakup', 'confusion', 'general'],
    recommendedSchedule: {
      youtube_shorts: '3 videos per day',
      instagram_reels: '2 videos per day',
    }
  });
}