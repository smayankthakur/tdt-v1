export interface VideoScript {
  hook: string;
  build: string;
  insight: string;
  cta: string;
}

export interface ContentTemplate {
  type: 'hook' | 'zodiac' | 'emotional';
  category: 'love' | 'career' | 'breakup' | 'confusion' | 'general';
  scripts: VideoScript[];
}

export const videoHooks = {
  curiosity: [
    "If you're seeing this right now, it's not random...",
    "This message was meant for you...",
    "Someone out there needed to see this today...",
    "The universe brought you here for a reason...",
    "If you've been feeling lost lately, this is for you...",
  ],
  emotional: [
    "There's someone thinking about you right now...",
    "Something you lost is about to come back...",
    "That thing you've been hoping for? It's closer than you think...",
    "Your energy has been calling out, and the universe is answering...",
    "You deserve to know what's coming...",
  ],
  zodiac: [
    "[SIGN], this is your moment...",
    "Attention [SIGN] - something big is happening...",
    "For the signs that need to hear this today...",
    "[SIGN], the cards are showing something for you...",
  ],
};

export const videoInsights = {
  love: [
    "The cards are showing a new beginning in love...",
    "Someone who walked away is about to come back...",
    "Your patience is about to pay off...",
    "The universe is clearing the path for something new...",
  ],
  career: [
    "Your hard work is about to be recognized...",
    "Opportunity is coming - be ready to receive it...",
    "Something you've been working toward is about to shift...",
    "Trust the process - your moment is coming...",
  ],
  general: [
    "Good things are coming your way...",
    "The universe has your back...",
    "Trust what you're feeling right now...",
    "Something beautiful is about to happen...",
  ],
  breakup: [
    "Healing is happening, even if you don't feel it yet...",
    "What's meant for you will never miss you...",
    "The pain you're feeling is making room for something new...",
    "Your next chapter is being written...",
  ],
  confusion: [
    "The answer you're seeking is closer than you think...",
    "Trust your intuition - it knows more than your mind...",
    "Clarity is coming - hold on a little longer...",
    "What feels unclear now will make sense soon...",
  ],
};

export const videoCTAs = {
  soft: [
    "Check your reading - link in bio",
    "Your full reading is waiting for you",
    "Go see what the cards have to say",
  ],
  curious: [
    "This isn't the full message... tap to see more",
    "Your situation is more specific than this...",
    "There's more the cards want to show you...",
  ],
};

export function generateScript(
  type: 'curiosity' | 'emotional' | 'zodiac',
  category: 'love' | 'career' | 'breakup' | 'confusion' | 'general',
  zodiacSign?: string
): VideoScript {
  const hooks = type === 'zodiac' && zodiacSign
    ? videoHooks.zodiac.map(h => h.replace('[SIGN]', zodiacSign))
    : videoHooks[type];

  const hook = hooks[Math.floor(Math.random() * hooks.length)];
  
  const buildOptions: Record<string, string[]> = {
    love: [
      "Someone special is on your mind...",
      "That connection you feel? It's real...",
      "Love is about to shift in your favor...",
    ],
    career: [
      "Your professional path is about to change...",
      "Something big is coming in your work life...",
      "The universe is preparing something for you...",
    ],
    breakup: [
      "Something precious is about to return...",
      "Healing is happening beneath the surface...",
      "Your heart is about to feel whole again...",
    ],
    confusion: [
      "I've been seeing your situation in the cards...",
      "Your energy has been calling out...",
      "There's a message the universe wants you to know...",
    ],
    general: [
      "Something significant is about to happen...",
      "The universe is aligning in your favor...",
      "Your moment is coming...",
    ],
  };

  const build = buildOptions[category][Math.floor(Math.random() * buildOptions[category].length)];
  const insight = videoInsights[category][Math.floor(Math.random() * videoInsights[category].length)];
  const cta = videoCTAs.soft[Math.floor(Math.random() * videoCTAs.soft.length)];

  return { hook, build, insight, cta };
}

export function formatScriptForTTS(script: VideoScript): string {
  return `${script.hook} ${script.build} ${script.insight} ${script.cta}`;
}

export function generateBatchScripts(
  count: number,
  type: 'curiosity' | 'emotional' | 'zodiac'
): VideoScript[] {
  const categories: ('love' | 'career' | 'breakup' | 'confusion' | 'general')[] = [
    'love', 'career', 'breakup', 'confusion', 'general'
  ];
  const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

  const scripts: VideoScript[] = [];

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const sign = zodiacSigns[i % 12];
    scripts.push(generateScript(type, category, type === 'zodiac' ? sign : undefined));
  }

  return scripts;
}

export const CONTENT_CALENDAR = {
  youtube_shorts: {
    frequency: 3,
    times: ['09:00', '14:00', '19:00'],
    types: ['curiosity', 'emotional', 'zodiac'],
  },
  instagram_reels: {
    frequency: 2,
    times: ['10:00', '18:00'],
    types: ['curiosity', 'zodiac'],
  },
  tiktok: {
    frequency: 4,
    times: ['08:00', '12:00', '16:00', '20:00'],
    types: ['curiosity', 'emotional'],
  },
};

export function getScheduledScripts(date: Date): VideoScript[] {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  if (isWeekend) {
    return generateBatchScripts(5, 'emotional');
  }
  
  return generateBatchScripts(3, 'curiosity');
}