import { NextResponse } from 'next/server';
import { generateAndPublish, createDailyHoroscopeConfigs, createQuestionArticleConfigs, ContentPromptConfig } from '@/lib/blog/content-generator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, config } = body;

    if (action === 'generate-single') {
      if (!config) {
        return NextResponse.json({ error: 'Config required' }, { status: 400 });
      }

      const result = await generateAndPublish(config as ContentPromptConfig);

      return NextResponse.json({
        action: 'generate-single',
        timestamp: new Date().toISOString(),
        ...result
      });
    }

    if (action === 'generate-daily-horoscopes') {
      const configs = createDailyHoroscopeConfigs();
      const results = [];

      for (const cfg of configs) {
        const result = await generateAndPublish(cfg);
        results.push(result);
        await new Promise(r => setTimeout(r, 1000));
      }

      return NextResponse.json({
        action: 'generate-daily-horoscopes',
        timestamp: new Date().toISOString(),
        total: configs.length,
        results: results.map(r => ({
          success: r.success,
          title: r.article?.title,
          postId: r.wordpressPostId,
          error: r.error
        }))
      });
    }

    if (action === 'generate-questions') {
      const configs = createQuestionArticleConfigs();
      const results = [];

      for (const cfg of configs) {
        const result = await generateAndPublish(cfg);
        results.push(result);
        await new Promise(r => setTimeout(r, 1000));
      }

      return NextResponse.json({
        action: 'generate-questions',
        timestamp: new Date().toISOString(),
        total: configs.length,
        results: results.map(r => ({
          success: r.success,
          title: r.article?.title,
          postId: r.wordpressPostId,
          error: r.error
        }))
      });
    }

    if (action === 'generate-batch') {
      const configs = body.configs as ContentPromptConfig[];
      const results = [];

      for (const cfg of configs) {
        const result = await generateAndPublish(cfg);
        results.push(result);
        await new Promise(r => setTimeout(r, 2000));
      }

      return NextResponse.json({
        action: 'generate-batch',
        timestamp: new Date().toISOString(),
        total: configs.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results.map(r => ({
          success: r.success,
          title: r.article?.title,
          postId: r.wordpressPostId,
          error: r.error
        }))
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[Blog API] Error:', error);
    return NextResponse.json({ error: 'Content generation failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Blog Content API',
    version: '1.0.0',
    status: 'ready',
    actions: {
      'generate-single': 'Generate and publish one article (requires config)',
      'generate-daily-horoscopes': 'Generate 12 daily horoscope articles',
      'generate-questions': 'Generate question-based articles',
      'generate-batch': 'Generate multiple articles (requires configs array)',
    },
    example: {
      action: 'generate-single',
      config: {
        articleType: 'question',
        topic: 'Love',
        keywords: {
          primary: 'will my ex come back tarot reading',
          secondary: ['tarot ex back', 'does ex want me back']
        },
        targetWordCount: 1500,
        tone: 'emotional',
        ctaType: 'reading'
      }
    }
  });
}