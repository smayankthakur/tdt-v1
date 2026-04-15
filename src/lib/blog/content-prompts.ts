export interface BlogArticle {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  category: string;
  tags: string[];
}

export interface ContentPromptConfig {
  articleType: 'question' | 'problem' | 'horoscope' | 'guide';
  topic: string;
  keywords: {
    primary: string;
    secondary: string[];
  };
  targetWordCount: number;
  tone: 'emotional' | 'informative' | 'conversion';
  ctaType: 'reading' | 'whatsapp' | 'booking';
}

const baseSystemPrompt = `You are a skilled tarot content writer for "Divine Tarot" - a mystical AI-powered tarot platform. Your writing style is:

- EMOTIONAL & RELATABLE: You speak to readers' deepest feelings and concerns
- TAROT-GUIDE VOICE: Like a wise spiritual advisor, not a robot
- AUTHORITATIVE but compassionate: You know the cards, you guide with certainty
- PERSONAL: Use "you" and "your" to create connection
- MYSTERIOUS but clear: Hint at deeper meanings while being understood

Avoid:
- Generic motivational quotes
- Overly technical tarot terminology
- Salesy language that feels pushy
- Too many emojis
- Robotic AI-sounding phrases

Use these phrases naturally:
- "You've been feeling this..."
- "There's something deeper here..."
- "The cards are showing me..."
- "I sense this in your energy..."
- "This isn't random..."

IMPORTANT: Every article MUST end with a clear but gentle CTA.`;

const questionArticlePrompt = `Write a complete SEO-optimized blog article for a LONG-TAIL QUESTION keyword.

PRIMARY KEYWORD: {{primary_keyword}}
SECONDARY KEYWORDS: {{secondary_keywords}}

STRUCTURE:
1. SEO Title (under 60 chars, emotional, includes keyword)
2. Meta Description (under 160 chars, includes keyword, compelling)
3. Hook (first 100 words - relatable problem, use "you" to address reader)
4. Main Interpretation (600-800 words - tarot-style guidance)
   - Acknowledge their situation
   - Give card-style insight
   - Be specific to their question
5. Deep Emotional Guidance (300-400 words - connect emotionally)
6. FAQ Section (3-4 questions for SEO)
7. CTA (natural, gentle - {{cta_text}})

WORD COUNT: {{word_count}} words

Formatting:
- Use H2 for sections
- Use H3 for subsections if needed
- Short paragraphs (2-3 sentences max)
- One emoji per section maximum
- Bullet points for FAQs only

Remember: This person is searching for answers. Be their spiritual guide.`;

const problemArticlePrompt = `Write a complete SEO-optimized blog article for a PROBLEM-BASED keyword.

PRIMARY KEYWORD: {{primary_keyword}}
SECONDARY KEYWORDS: {{secondary_keywords}}

CONTEXT: The reader is dealing with: {{problem_context}}

STRUCTURE:
1. SEO Title (under 60 chars)
2. Meta Description (under 160 chars)
3. Hook - acknowledge their struggle (first 100 words)
4. Understanding the Problem (200-300 words - explain what's happening)
5. Tarot Guidance for This Problem (600-800 words - card-style insight)
6. Actionable Steps (200-300 words - what they can do)
7. When to Seek Deeper Help (100-200 words - soft CTA)
8. FAQ Section
9. Final CTA

WORD COUNT: {{word_count}} words

Make it SPECIFIC to their problem. Not generic advice.`;

const horoscopeArticlePrompt = `Write a daily/weekly tarot reading for a specific zodiac sign.

ZODIAC SIGN: {{zodiac_sign}}
READING TYPE: {{reading_type}} (daily/weekly/monthly)
DATE: {{date}}

STRUCTURE:
1. Title: "{{zodiac_sign}} {{reading_type}} Tarot Reading - {{date}}"
2. Brief intro (50 words max)
3. Card Pull: Describe the card(s) drawn
4. Main Message (300-400 words - specific guidance for this sign)
5. Love & Relationships (200-300 words)
6. Career & Finance (150-200 words)
7. Personal Growth (150-200 words)
8. One Card for the Day (50 words - quick takeaway)
9. CTA: "Get your full {{reading_type}} reading with Ginni"

TONE: Direct, personal, like you're speaking directly to this sign's energy.`;

const guideArticlePrompt = `Write a comprehensive SEO guide/tutorial article.

TOPIC: {{topic}}
PRIMARY KEYWORD: {{primary_keyword}}

STRUCTURE:
1. SEO Title
2. Meta Description
3. Introduction (what they'll learn)
4. Section 1: [Concept/Explanation]
5. Section 2: [How-to/Deeper explanation]
6. Section 3: [Examples/Case study]
7. Section 4: [Tips/Advanced guidance]
8. FAQ Section
9. Conclusion + CTA

WORD COUNT: {{word_count}} words

Make it actionable and valuable.`;

export function buildPrompt(config: ContentPromptConfig): string {
  const ctaOptions = {
    reading: "Ready for a deeper reading? [Get your personal tarot reading here]",
    whatsapp: "Want a personalized message from Ginni? [Let's connect on WhatsApp]",
    booking: "Ready for your one-on-one session? [Book your reading with Ginni]",
  };

  let template = '';

  switch (config.articleType) {
    case 'question':
      template = questionArticlePrompt
        .replace('{{primary_keyword}}', config.keywords.primary)
        .replace('{{secondary_keywords}}', config.keywords.secondary.join(', '))
        .replace('{{word_count}}', config.targetWordCount.toString())
        .replace('{{cta_text}}', ctaOptions[config.ctaType]);
      break;
    case 'problem':
      template = problemArticlePrompt
        .replace('{{primary_keyword}}', config.keywords.primary)
        .replace('{{secondary_keywords}}', config.keywords.secondary.join(', '))
        .replace('{{problem_context}}', config.topic)
        .replace('{{word_count}}', config.targetWordCount.toString());
      break;
    case 'horoscope':
      template = horoscopeArticlePrompt
        .replace('{{zodiac_sign}}', config.topic)
        .replace('{{reading_type}}', config.articleType === 'horoscope' ? 'daily' : 'weekly')
        .replace('{{date}}', new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
      break;
    case 'guide':
      template = guideArticlePrompt
        .replace('{{topic}}', config.topic)
        .replace('{{primary_keyword}}', config.keywords.primary)
        .replace('{{word_count}}', config.targetWordCount.toString());
      break;
  }

  return `${baseSystemPrompt}\n\n${template}`;
}

export function extractTitleFromContent(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : '';
}

export function extractExcerpt(content: string, maxLength: number = 160): string {
  const paragraphs = content.split('\n').filter(p => p.trim().length > 0);
  const firstParagraph = paragraphs[0] || '';
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }
  return firstParagraph.substring(0, maxLength - 3) + '...';
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}