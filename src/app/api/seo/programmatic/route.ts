import { NextResponse } from 'next/server';
import { 
  generateAllPages,
  generateAllQuestionPages,
  generateAllProblemPages,
  generateAllYesNoPages,
  generateAllZodiacPages,
  generateSEOPage,
  generateZodiacPage,
  SEOPage,
  questionKeywords,
  problemKeywords,
  yesNoKeywords,
  getTotalPageCount
} from '@/lib/seo/programmatic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, keyword, sign, type } = body;

    if (action === 'generate-page') {
      if (!keyword) {
        return NextResponse.json({ error: 'keyword required' }, { status: 400 });
      }

      const cluster = [...questionKeywords, ...problemKeywords, ...yesNoKeywords]
        .find(k => k.primary === keyword || k.variations.includes(keyword));

      const page = cluster 
        ? generateSEOPage(cluster)
        : generateZodiacPage(keyword, type as any);

      return NextResponse.json({
        action: 'generate-page',
        timestamp: new Date().toISOString(),
        page
      });
    }

    if (action === 'generate-all') {
      const pages = generateAllPages();

      return NextResponse.json({
        action: 'generate-all',
        timestamp: new Date().toISOString(),
        totalPages: pages.length,
        pages: pages.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          template: p.template
        }))
      });
    }

    if (action === 'generate-questions') {
      const pages = generateAllQuestionPages();

      return NextResponse.json({
        action: 'generate-questions',
        timestamp: new Date().toISOString(),
        count: pages.length,
        pages: pages.map(p => ({
          slug: p.slug,
          title: p.title,
          primaryKeyword: p.keywords.primary
        }))
      });
    }

    if (action === 'generate-problems') {
      const pages = generateAllProblemPages();

      return NextResponse.json({
        action: 'generate-problems',
        timestamp: new Date().toISOString(),
        count: pages.length,
        pages: pages.map(p => ({
          slug: p.slug,
          title: p.title,
          primaryKeyword: p.keywords.primary
        }))
      });
    }

    if (action === 'generate-horoscopes') {
      const pages = generateAllZodiacPages();

      return NextResponse.json({
        action: 'generate-horoscopes',
        timestamp: new Date().toISOString(),
        count: pages.length,
        pages: pages.map(p => ({
          slug: p.slug,
          title: p.title
        }))
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('[SEO API] Error:', error);
    return NextResponse.json({ error: 'SEO page generation failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'Programmatic SEO API',
    version: '1.0.0',
    status: 'ready',
    stats: {
      totalPages: getTotalPageCount(),
      questionKeywords: questionKeywords.length,
      problemKeywords: problemKeywords.length,
      yesNoKeywords: yesNoKeywords.length,
      zodiacPages: 36,
    },
    actions: {
      'generate-page': 'Generate single SEO page (keyword)',
      'generate-all': 'Generate all pages',
      'generate-questions': 'Generate question-based pages',
      'generate-problems': 'Generate problem-based pages',
      'generate-horoscopes': 'Generate zodiac horoscope pages',
    },
    urlStructure: {
      questions: '/tarot/[keyword]',
      problems: '/help/[keyword]',
      horoscope: '/horoscope/[sign]-[type]',
    }
  });
}