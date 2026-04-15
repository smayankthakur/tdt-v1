export interface KeywordStrategy {
  love: string[];
  career: string[];
  general: string[];
}

export interface ProblemKeywordStrategy {
  love_confusion: string[];
  heartbreak: string[];
  decision_making: string[];
  anxiety: string[];
}

export interface DailyKeywordStrategy {
  daily_zodiac: string[];
  weekly_zodiac: string[];
  monthly_zodiac: string[];
}

export interface ContentCluster {
  main: string;
  supporting: string[];
}

export interface KeywordStrategyAll {
  question_keywords: KeywordStrategy;
  problem_keywords: ProblemKeywordStrategy;
  daily_keywords: DailyKeywordStrategy;
  clusters: Record<string, ContentCluster>;
}

export const keywordStrategy: KeywordStrategyAll = {
  question_keywords: {
    love: [
      "will my ex come back tarot reading",
      "does he think about me tarot meaning",
      "is he my soulmate tarot reading",
      "when will i meet my soulmate tarot",
      "should i stay in this relationship tarot",
      "is my love coming back tarot",
      "what does he really feel for me tarot",
      "why is he acting distant tarot",
      "will we get married tarot reading",
      "is she thinking about me tarot",
    ],
    career: [
      "should i change my job tarot",
      "will i get promoted tarot reading",
      "what career should i choose tarot",
      "is my boss hiding something tarot",
      "should i start my own business tarot",
      "will i get the job tarot reading",
      "career change tarot reading meaning",
    ],
    general: [
      "what does my future hold tarot",
      "is this the right path for me tarot",
      "what do the cards want me to know",
      "what message does the universe have for me",
    ],
  },
  problem_keywords: {
    love_confusion: [
      "tarot for love confusion",
      "love tarot reading when confused",
      "tarot for relationship confusion",
      "should i wait for him tarot",
    ],
    heartbreak: [
      "tarot for heartbreak healing",
      "tarot for getting over ex",
      "heartbreak tarot reading meaning",
      "tarot for moving on after breakup",
    ],
    decision_making: [
      "tarot decision making guide",
      "tarot for important life decisions",
      "which path should i choose tarot",
    ],
    anxiety: [
      "tarot for anxious heart",
      "tarot for peace and clarity",
      "tarot for worried mind",
    ],
  },
  daily_keywords: {
    daily_zodiac: [
      "today tarot reading for Aries",
      "today tarot reading for Taurus",
      "today tarot reading for Gemini",
      "today tarot reading for Cancer",
      "today tarot reading for Leo",
      "today tarot reading for Virgo",
      "today tarot reading for Libra",
      "today tarot reading for Scorpio",
      "today tarot reading for Sagittarius",
      "today tarot reading for Capricorn",
      "today tarot reading for Aquarius",
      "today tarot reading for Pisces",
    ],
    weekly_zodiac: [
      "weekly tarot reading for love Aries",
      "weekly tarot reading for career Taurus",
    ],
    monthly_zodiac: [
      "monthly tarot reading April 2026",
    ],
  },
  clusters: {
    love_tarot_reading: {
      main: "Love Tarot Reading - Complete Guide",
      supporting: [
        "Will My Ex Come Back Tarot",
        "Does He Think About Me Tarot",
        "Is He My Soulmate Tarot",
        "When Will I Meet My Soulmate",
        "Love Decision Tarot Spread",
      ],
    },
    career_tarot_reading: {
      main: "Career Tarot Reading Guide",
      supporting: [
        "Should I Change My Job Tarot",
        "Will I Get Promoted Tarot",
        "Business Tarot Reading",
        "Career Path Tarot Spread",
      ],
    },
    daily_tarot_reading: {
      main: "Daily Tarot Reading",
      supporting: [
        "Today's Tarot for Each Zodiac",
        "Daily Love Tarot Reading",
        "Daily Career Tarot Reading",
      ],
    },
  },
};

export const KEYWORD_DENSITY = {
  primary: "1.5-2%",
  secondary: "0.5-1%",
  lsi_keywords: "5-10 per article",
};

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const CONTENT_CATEGORIES = {
  love: "Love & Relationships",
  career: "Career & Finance",
  daily: "Daily Horoscope",
  guides: "Tarot Guides",
  spiritual: "Spiritual Growth",
};

export function getKeywordsForType(type: 'question' | 'problem' | 'horoscope', category?: string): string[] {
  if (type === 'horoscope') {
    return keywordStrategy.daily_keywords.daily_zodiac;
  }
  
  if (type === 'question') {
    const cat = category || 'love';
    return keywordStrategy.question_keywords[cat as keyof KeywordStrategy] || [];
  }
  
  if (type === 'problem') {
    const cat = category || 'love_confusion';
    return keywordStrategy.problem_keywords[cat as keyof ProblemKeywordStrategy] || [];
  }
  
  return [];
}