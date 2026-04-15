import OpenAI from 'openai';
import { BlogArticle, ContentPromptConfig, buildPrompt, extractTitleFromContent, extractExcerpt, generateSlug } from './content-prompts';

export type { ContentPromptConfig };

let _openai: OpenAI | undefined;

function getOpenAI() {
  if (!_openai) {
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY');
    }
    _openai = new OpenAI({ apiKey });
  }
  return _openai;
}

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://blog.thedivinetarot.com/wp-json/wp/v2';
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

export interface GenerateArticleResult {
  success: boolean;
  article?: BlogArticle;
  wordpressPostId?: number;
  error?: string;
}

export async function generateArticle(config: ContentPromptConfig): Promise<GenerateArticleResult> {
  try {
    const prompt = buildPrompt(config);

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a mystical tarot content writer. Write in the voice of a wise spiritual guide.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return { success: false, error: 'No content generated' };
    }

    const title = extractTitleFromContent(content) || config.keywords.primary;
    const slug = generateSlug(title);
    const excerpt = extractExcerpt(content);

    const article: BlogArticle = {
      title,
      content,
      excerpt,
      slug,
      metaDescription: excerpt.substring(0, 155) + '...',
      primaryKeyword: config.keywords.primary,
      secondaryKeywords: config.keywords.secondary,
      category: config.topic,
      tags: [config.keywords.primary, ...config.keywords.secondary.slice(0, 3)],
    };

    return { success: true, article };
  } catch (error) {
    console.error('[ContentGenerator] Generate error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Generation failed' };
  }
}

export async function publishToWordPress(article: BlogArticle): Promise<number | null> {
  if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
    console.log('[WordPress] Not configured, would publish:', article.title);
    return null;
  }

  const credentials = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}`).toString('base64');

  const postData = {
    title: article.title,
    content: article.content,
    excerpt: article.excerpt,
    slug: article.slug,
    status: 'draft',
    meta: {
      _rank_math_description: article.metaDescription,
      _rank_math_title: article.title,
    },
    categories: [getCategoryId(article.category)],
    tags: article.tags,
  };

  try {
    const response = await fetch(`${WORDPRESS_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[WordPress] Publish error:', error);
      return null;
    }

    const result = await response.json();
    console.log('[WordPress] Published:', result.link);
    return result.id;
  } catch (error) {
    console.error('[WordPress] Publish exception:', error);
    return null;
  }
}

export async function updateWordPressPost(postId: number, article: BlogArticle): Promise<boolean> {
  if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
    return false;
  }

  const credentials = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}`).toString('base64');

  try {
    const response = await fetch(`${WORDPRESS_API_URL}/posts/${postId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: article.title,
        content: article.content,
        status: 'publish',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('[WordPress] Update error:', error);
    return false;
  }
}

function getCategoryId(category: string): number {
  const categoryMap: Record<string, number> = {
    'love': 1,
    'career': 2,
    'general': 3,
    'daily': 4,
    'weekly': 5,
    'zodiac': 6,
  };
  return categoryMap[category.toLowerCase()] || 1;
}

export async function generateAndPublish(config: ContentPromptConfig): Promise<GenerateArticleResult> {
  const generateResult = await generateArticle(config);

  if (!generateResult.success || !generateResult.article) {
    return generateResult;
  }

  const postId = await publishToWordPress(generateResult.article);

  if (!postId) {
    return {
      success: true,
      article: generateResult.article,
      error: 'Generated but not published to WordPress (check credentials)',
    };
  }

  return {
    success: true,
    article: generateResult.article,
    wordpressPostId: postId,
  };
}

export async function generateBatch(configs: ContentPromptConfig[]): Promise<GenerateArticleResult[]> {
  const results: GenerateArticleResult[] = [];

  for (const config of configs) {
    const result = await generateAndPublish(config);
    results.push(result);

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return results;
}

export function createDailyHoroscopeConfigs(): ContentPromptConfig[] {
  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return zodiacSigns.map(sign => ({
    articleType: 'horoscope' as const,
    topic: sign,
    keywords: {
      primary: `today tarot reading for ${sign.toLowerCase()}`,
      secondary: [`${sign.toLowerCase()} tarot today`, `${sign} daily guidance tarot`],
    },
    targetWordCount: 800,
    tone: 'emotional' as const,
    ctaType: 'reading' as const,
  }));
}

export function createQuestionArticleConfigs(): ContentPromptConfig[] {
  return [
    {
      articleType: 'question' as const,
      topic: 'Will My Ex Come Back',
      keywords: {
        primary: 'will my ex come back tarot reading',
        secondary: ['tarot reading will ex come back', 'does my ex want me back tarot'],
      },
      targetWordCount: 1500,
      tone: 'emotional' as const,
      ctaType: 'reading' as const,
    },
    {
      articleType: 'question' as const,
      topic: 'Does He Think About Me',
      keywords: {
        primary: 'does he think about me tarot meaning',
        secondary: ['is he thinking about me tarot', 'tarot does he miss me'],
      },
      targetWordCount: 1400,
      tone: 'emotional' as const,
      ctaType: 'reading' as const,
    },
    {
      articleType: 'question' as const,
      topic: 'Should I Change My Job',
      keywords: {
        primary: 'should i change my job tarot',
        secondary: ['career change tarot reading', 'should i quit my job tarot'],
      },
      targetWordCount: 1300,
      tone: 'informative' as const,
      ctaType: 'booking' as const,
    },
  ];
}