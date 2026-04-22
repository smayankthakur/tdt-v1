import { keywordStrategy } from '@/lib/blog/seo-strategy';
import { HoroscopeContent } from '@/lib/horoscope/engine';

export interface SEOPage {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  content: string;
  keywords: {
    primary: string;
    secondary: string[];
  };
  cta: {
    text: string;
    url: string;
  };
  internalLinks: string[];
  template: 'question' | 'problem' | 'horoscope' | 'yesno';
}

export interface KeywordCluster {
  primary: string;
  variations: string[];
  searchIntent: 'informational' | 'navigational' | 'transactional';
  difficulty: 'low' | 'medium' | 'high';
}

export const questionKeywords: KeywordCluster[] = [
  {
    primary: "will my ex come back tarot",
    variations: [
      "will my ex come back tarot reading",
      "will my ex ever come back tarot",
      "does my ex want me back tarot",
      "tarot will my ex return",
      "will my ex contact me tarot",
    ],
    searchIntent: "informational",
    difficulty: "medium",
  },
  {
    primary: "does he think about me tarot",
    variations: [
      "does he think about me tarot meaning",
      "is he thinking about me right now tarot",
      "does he miss me tarot reading",
      "tarot does he think of me",
    ],
    searchIntent: "informational",
    difficulty: "medium",
  },
  {
    primary: "is he my soulmate tarot",
    variations: [
      "is he my soulmate tarot reading",
      "how to know if he's your soulmate tarot",
      "tarot soulmate connection",
      "soulmate tarot spread meaning",
    ],
    searchIntent: "informational",
    difficulty: "high",
  },
  {
    primary: "should i change my job tarot",
    variations: [
      "should i change my job tarot reading",
      "career change tarot reading",
      "should i quit my job tarot",
      "is it time to change careers tarot",
    ],
    searchIntent: "informational",
    difficulty: "medium",
  },
  {
    primary: "when will i meet my soulmate tarot",
    variations: [
      "when will i meet my soulmate tarot reading",
      "when will i find love tarot",
      "tarot when will love come",
      "soulmate arrival tarot reading",
    ],
    searchIntent: "informational",
    difficulty: "high",
  },
  {
    primary: "tarot for love confusion",
    variations: [
      "tarot reading love confusion",
      "tarot for confused relationships",
      "should i stay or leave tarot",
      "relationship confusion tarot reading",
    ],
    searchIntent: "informational",
    difficulty: "low",
  },
];

export const problemKeywords: KeywordCluster[] = [
  {
    primary: "tarot for heartbreak healing",
    variations: [
      "tarot for heartbreak",
      "healing after breakup tarot",
      "tarot for getting over ex",
      "heartbreak tarot reading meaning",
      "tarot moving on after breakup",
    ],
    searchIntent: "informational",
    difficulty: "low",
  },
  {
    primary: "tarot for anxious heart",
    variations: [
      "tarot for anxiety",
      "tarot for worried mind",
      "peace tarot reading",
      "tarot for clarity and peace",
    ],
    searchIntent: "informational",
    difficulty: "low",
  },
  {
    primary: "tarot decision making",
    variations: [
      "tarot for important decisions",
      "which path should i choose tarot",
      "tarot should i do x or y",
      "decision tarot spread meaning",
    ],
    searchIntent: "informational",
    difficulty: "medium",
  },
];

export const yesNoKeywords: KeywordCluster[] = [
  {
    primary: "is he cheating tarot",
    variations: [
      "is he cheating tarot reading",
      "is my partner cheating tarot",
      "tarot is she being unfaithful",
      "signs of cheating tarot reading",
    ],
    searchIntent: "informational",
    difficulty: "medium",
  },
  {
    primary: "does she love me tarot",
    variations: [
      "does she love me tarot reading",
      "is she in love with me tarot",
      "tarot does she have feelings for me",
      "how does she really feel tarot",
    ],
    searchIntent: "informational",
    difficulty: "medium",
  },
  {
    primary: "will i get the job tarot",
    variations: [
      "will i get the job tarot reading",
      "tarot will i be hired",
      "job interview tarot reading",
      "will i get promoted tarot",
    ],
    searchIntent: "informational",
    difficulty: "medium",
  },
];

export const zodiacKeywordBase = {
  Aries: [
    "aries horoscope today",
    "aries daily tarot reading",
    "aries love horoscope",
    "aries career horoscope",
  ],
  Taurus: [
    "taurus horoscope today",
    "taurus daily tarot reading",
    "taurus love horoscope",
    "taurus career horoscope",
  ],
  Gemini: [
    "gemini horoscope today",
    "gemini daily tarot reading",
    "gemini love horoscope",
    "gemini career horoscope",
  ],
  Cancer: [
    "cancer horoscope today",
    "cancer daily tarot reading",
    "cancer love horoscope",
    "cancer career horoscope",
  ],
  Leo: [
    "leo horoscope today",
    "leo daily tarot reading",
    "leo love horoscope",
    "leo career horoscope",
  ],
  Virgo: [
    "virgo horoscope today",
    "virgo daily tarot reading",
    "virgo love horoscope",
    "virgo career horoscope",
  ],
  Libra: [
    "libra horoscope today",
    "libra daily tarot reading",
    "libra love horoscope",
    "libra career horoscope",
  ],
  Scorpio: [
    "scorpio horoscope today",
    "scorpio daily tarot reading",
    "scorpio love horoscope",
    "scorpio career horoscope",
  ],
  Sagittarius: [
    "sagittarius horoscope today",
    "sagittarius daily tarot reading",
    "sagittarius love horoscope",
    "sagittarius career horoscope",
  ],
  Capricorn: [
    "capricorn horoscope today",
    "capricorn daily tarot reading",
    "capricorn love horoscope",
    "capricorn career horoscope",
  ],
  Aquarius: [
    "aquarius horoscope today",
    "aquarius daily tarot reading",
    "aquarius love horoscope",
    "aquarius career horoscope",
  ],
  Pisces: [
    "pisces horoscope today",
    "pisces daily tarot reading",
    "pisces love horoscope",
    "pisces career horoscope",
  ],
};

function generateSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateTitle(keyword: string): string {
  const formatted = keyword
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  if (!formatted.includes('Tarot')) {
    return `${formatted} - Tarot Reading`;
  }
  return formatted;
}

function generateMetaDescription(keyword: string): string {
  return `Discover what the tarot cards reveal about "${keyword.replace(/-/g, ' ')}". Get your personalized reading and find the answers you're seeking.`;
}

function generatePageContent(keyword: string, type: SEOPage['template']): string {
  const baseContent = `
    <h1>${generateTitle(keyword)}</h1>
    
    <p>The universe brought you here for a reason. That question you've been carrying - the one that keeps you up at night - the cards are ready to answer it.</p>
    
    <h2>What the Cards Are Showing</h2>
    <p>When I look into your situation regarding "${keyword.replace(/-/g, ' ')}", the cards reveal important insights that you need to know right now.</p>
    
    <p>You've been feeling uncertain. Maybe even lost. The confusion you're experiencing isn't random - it's a signal from the universe that something significant is about to shift.</p>
    
    <h2>The Deeper Message</h2>
    <p>Here's what the cards want you to understand: You have more power in this situation than you realize. The answer isn't outside of you - it's within.</p>
    
    <p>There's something you've been missing. Something you've been overlooking. The universe is trying to show you, but you need to be open to seeing it.</p>
    
    <h2>What You Need to Do</h2>
    <p>Based on your reading, here's what I recommend:</p>
    <ul>
      <li>Trust your intuition - it's rarely wrong</li>
      <li>Release the need to control the outcome</li>
      <li>Pay attention to signs and synchronicities</li>
      <li>Take one small step forward</li>
    </ul>
    
    <h2>Your Personal Reading Awaits</h2>
    <p>This general insight is just the surface. Your specific situation requires a deeper dive. The cards have more to show you - but you need to ask the right questions.</p>
  `;

  return baseContent;
}

export function generateSEOPage(
  keywordCluster: KeywordCluster,
  type: SEOPage['template'] = 'question'
): SEOPage {
  const primary = keywordCluster.primary;
  
  const page: SEOPage = {
    id: `page_${generateSlug(primary)}`,
    slug: generateSlug(primary),
    title: generateTitle(primary),
    metaDescription: generateMetaDescription(primary),
    content: generatePageContent(primary, type),
    keywords: {
      primary,
      secondary: keywordCluster.variations.slice(0, 4),
    },
    cta: {
      text: "Get Your Personal Tarot Reading",
      url: "/reading",
    },
    internalLinks: [
      "/horoscope/daily",
      "/blog/love-tarot-guide",
      "/blog/tarot-spreads-explained",
    ],
    template: type,
  };

  return page;
}

export function generateZodiacPage(
  sign: string,
  type: 'daily' | 'love' | 'career' = 'daily'
): SEOPage {
  const keyword = `${sign.toLowerCase()} ${type} ${type === 'daily' ? 'horoscope tarot' : type}`;
  
  const titles: Record<string, string> = {
    daily: `${sign} Daily Horoscope & Tarot Reading - Today`,
    love: `${sign} Love Horoscope & Tarot Reading`,
    career: `${sign} Career Horoscope & Tarot Reading`,
  };

  return {
    id: `horoscope_${sign.toLowerCase()}_${type}`,
    slug: `/horoscope/${sign.toLowerCase()}-${type}`,
    title: titles[type],
    metaDescription: `Get your ${sign.toLowerCase()} ${type} horoscope and tarot reading. Discover what the stars have in store for you today.`,
    content: generateHoroscopePageContent(sign, type),
    keywords: {
      primary: keyword,
      secondary: zodiacKeywordBase[sign as keyof typeof zodiacKeywordBase] || [],
    },
    cta: {
      text: `Get Your Full ${sign} Reading`,
      url: `/reading?sign=${sign.toLowerCase()}`,
    },
    internalLinks: [
      '/reading',
      '/blog/tarot-basics',
    ],
    template: 'horoscope',
  };
}

function generateHoroscopePageContent(sign: string, type: string): string {
  return `
    <h1>${sign} ${type === 'daily' ? 'Daily' : type.charAt(0).toUpperCase() + type.slice(1)} Horoscope</h1>
    
    <p>Welcome, ${sign}. The stars have a message for you today.</p>
    
    <h2>Your ${type === 'daily' ? 'Today' : type} Reading</h2>
    <p>The cards are showing significant energy for you right now. There's a theme of {theme} that runs through your day.</p>
    
    <p>Trust what you're feeling. Your intuition is especially strong today.</p>
    
    <h2>Love & Relationships</h2>
    <p>{love_content}</p>
    
    <h2>Career & Ambitions</h2>
    <p>{career_content}</p>
    
    <h2>Personal Guidance</h2>
    <p>Take a moment to connect with yourself today. What is your soul trying to tell you?</p>
  `;
}

export function generateAllQuestionPages(): SEOPage[] {
  return questionKeywords.map(cluster => generateSEOPage(cluster, 'question'));
}

export function generateAllProblemPages(): SEOPage[] {
  return problemKeywords.map(cluster => generateSEOPage(cluster, 'problem'));
}

export function generateAllYesNoPages(): SEOPage[] {
  return yesNoKeywords.map(cluster => generateSEOPage(cluster, 'yesno'));
}

export function generateAllZodiacPages(): SEOPage[] {
  const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const types: ('daily' | 'love' | 'career')[] = ['daily', 'love', 'career'];
  
  const pages: SEOPage[] = [];
  
  for (const sign of signs) {
    for (const type of types) {
      pages.push(generateZodiacPage(sign, type));
    }
  }
  
  return pages;
}

export function generateAllPages(): SEOPage[] {
  return [
    ...generateAllQuestionPages(),
    ...generateAllProblemPages(),
    ...generateAllYesNoPages(),
    ...generateAllZodiacPages(),
  ];
}

export function getTotalPageCount(): number {
  return questionKeywords.length + problemKeywords.length + yesNoKeywords.length + (12 * 3);
}

export const INTERNAL_LINK_STRATEGY: Record<string, { anchor: string; url: string }[]> = {
  question: [
    { anchor: "free tarot reading", url: "/reading" },
    { anchor: "daily horoscope", url: "/horoscope/daily" },
    { anchor: "love tarot guide", url: "/blog/love-tarot-guide" },
  ],
  problem: [
    { anchor: "get a reading", url: "/reading" },
    { anchor: "tarot for beginners", url: "/blog/tarot-basics" },
    { anchor: "speak to Ginni", url: "/booking" },
  ],
  horoscope: [
    { anchor: "your personal reading", url: "/reading" },
    { anchor: "other signs", url: "/horoscope/daily" },
    { anchor: "tarot reading", url: "/reading" },
  ],
  yesno: [
    { anchor: "get your reading", url: "/reading" },
    { anchor: "ask Ginni", url: "/booking" },
  ],
};

export function addInternalLinks(page: SEOPage): SEOPage {
  const links = INTERNAL_LINK_STRATEGY[page.template] || INTERNAL_LINK_STRATEGY.question;
  return {
    ...page,
    internalLinks: links.map(l => l.url),
  };
}