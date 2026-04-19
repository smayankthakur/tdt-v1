export type SpreadType = 
  | 'yesno'
  | 'three_card'
  | 'love'
  | 'celtic_cross'
  | 'daily'
  | 'detailed';

export interface SpreadPosition {
  name: string;
  label: string;
  labelHinglish: string;
  description: string;
}

export interface SpreadConfig {
  type: SpreadType;
  name: string;
  nameHinglish: string;
  description: string;
  positions: SpreadPosition[];
  cardCount: number;
}

export const SPREADS: Record<SpreadType, SpreadConfig> = {
  yesno: {
    type: 'yesno',
    name: 'Yes / No',
    nameHinglish: 'Haan ya Nahin',
    description: 'A simple yes or no answer to your question',
    positions: [
      { name: 'answer', label: 'Answer', labelHinglish: 'Uttar', description: 'The direct answer' },
    ],
    cardCount: 1,
  },
  three_card: {
    type: 'three_card',
    name: 'Past, Present & Future',
    nameHinglish: 'Guilt, Vartaman aur Bhvishya',
    description: 'A three-card spread showing your journey',
    positions: [
      { name: 'past', label: 'Past', labelHinglish: 'Guilt', description: 'What brought you here' },
      { name: 'present', label: 'Present', labelHinglish: 'Vartaman', description: 'Your current situation' },
      { name: 'future', label: 'Future', labelHinglish: 'Bhvishya', description: 'Where you\'re heading' },
    ],
    cardCount: 3,
  },
  love: {
    type: 'love',
    name: 'Love & Relationship',
    nameHinglish: 'Pyaar aur Rishte',
    description: 'Deep insight into relationships',
    positions: [
      { name: 'your_energy', label: 'Your Energy', labelHinglish: 'Tumhari Energy', description: 'What you bring to the relationship' },
      { name: 'their_energy', label: 'Their Energy', labelHinglish: 'Unki Energy', description: 'What they bring' },
      { name: 'connection', label: 'Connection', labelHinglish: 'Connection', description: 'The dynamic between you' },
      { name: 'guidance', label: 'Guidance', labelHinglish: 'Guidance', description: 'What the universe suggests' },
    ],
    cardCount: 4,
  },
  celtic_cross: {
    type: 'celtic_cross',
    name: 'Celtic Cross',
    nameHinglish: 'Celtic Cross',
    description: 'An advanced 8-card spread for deep clarity',
    positions: [
      { name: 'current', label: 'Current Situation', labelHinglish: 'Abhi ki Situation', description: 'Your present reality' },
      { name: 'challenge', label: 'Challenge', labelHinglish: 'Challenge', description: 'What you\'re facing' },
      { name: 'past', label: 'Past Influence', labelHinglish: 'Guilt ka Impact', description: 'From your past' },
      { name: 'future', label: 'Future Direction', labelHinglish: 'Bhvishya ki Disha', description: 'Where things are heading' },
      { name: 'advice', label: 'Advice', labelHinglish: 'Advice', description: 'What you should do' },
      { name: 'external', label: 'External Influence', labelHinglish: '外部 Influence', description: 'Outside factors' },
      { name: 'hopes', label: 'Hopes & Fears', labelHinglish: 'Ummeed aur Darr', description: 'Your inner feelings' },
      { name: 'outcome', label: 'Outcome', labelHinglish: 'Final Result', description: 'The likely outcome' },
    ],
    cardCount: 8,
  },
  daily: {
    type: 'daily',
    name: 'Daily Guidance',
    nameHinglish: 'Aaj ka Guidance',
    description: 'Start your day with cosmic insight',
    positions: [
      { name: 'theme', label: 'Today\'s Theme', labelHinglish: 'Aaj ka Theme', description: 'The energy of today' },
      { name: 'challenge', label: 'Challenge', labelHinglish: 'Challenge', description: 'Today\'s challenge' },
      { name: 'gift', label: 'Gift', labelHinglish: 'Gift', description: 'Today\'s gift/opportunity' },
    ],
    cardCount: 3,
  },
  detailed: {
    type: 'detailed',
    name: 'Detailed Reading',
    nameHinglish: 'Detailed Reading',
    description: 'Full 5-card spread for complete guidance',
    positions: [
      { name: 'situation', label: 'Situation', labelHinglish: 'Situation', description: 'What you\'re dealing with' },
      { name: 'obstacle', label: 'Obstacle', labelHinglish: 'Rukeav', description: 'What\'s holding you back' },
      { name: 'guidance', label: 'Guidance', labelHinglish: 'Guidance', description: 'What you should know' },
      { name: 'external', label: 'External Factor', labelHinglish: 'Bahar ki Taqat', description: 'What\'s helping or hurting' },
      { name: 'outcome', label: 'Outcome', labelHinglish: 'Final Result', description: 'The likely result' },
    ],
    cardCount: 5,
  },
};

export function getSpreadForType(readingType: string): SpreadConfig {
  const typeMap: Record<string, SpreadType> = {
    'detailed': 'detailed',
    'yesno': 'yesno',
    'daily': 'daily',
    'union': 'love',
    'thirdparty': 'three_card',
    'shaadi': 'love',
    'soulmate': 'love',
    'baby': 'love',
    'partner': 'love',
    'spiritual': 'celtic_cross',
    'month': 'daily',
    'universe': 'detailed',
    'action': 'three_card',
    'relationship': 'celtic_cross',
  };
  
  const spreadType = typeMap[readingType] || 'three_card';
  return SPREADS[spreadType];
}

export function getPositionInterpretation(
  cardName: string,
  position: SpreadPosition,
  language: string = 'hinglish'
): string {
  const positionOpening: Record<string, Record<string, string>> = {
    past: {
      hinglish: `Jo ${cardName} guilt ki taraf point kar raha hai...`,
      english: `What ${cardName} reveals about your past...`,
      hindi: `Jo ${cardName} aapke vartaman ki or indicate kar raha hai...`,
    },
    present: {
      hinglish: `Ab ${cardName} jo dikh raha hai...`,
      english: `As ${cardName} shows now...`,
      hindi: `Ab jo ${cardName} dikha raha hai...`,
    },
    future: {
      hinglish: `Jo aage hone vala hai... ${cardName} is direction mein...`,
      english: `Looking ahead, ${cardName} points to...`,
      hindi: `Aage jo hone wala hai... ${cardName} is disha mein...`,
    },
    current: {
      hinglish: `Is waqt jo energy hai... ${cardName}...`,
      english: `Right now, ${cardName} is showing...`,
      hindi: `Is waqt jo energy hai... ${cardName}...`,
    },
    challenge: {
      hinglish: `Jo challenge tumhare samne hai... ${cardName} is batata hai...`,
      english: `The challenge ahead: ${cardName} reveals...`,
      hindi: `Jo challenge aapke samne hai... ${cardName} bata raha hai...`,
    },
    advice: {
      hinglish: `Is ke liye guidance jo mil rahi hai... ${cardName}...`,
      english: ` guidance coming through: ${cardName}...`,
      hindi: `Is ke liye jo guidance mil rahi hai... ${cardName}...`,
    },
    outcome: {
      hinglish: `Final result jo dikh raha hai... ${cardName}...`,
      english: `The outcome: ${cardName} suggests...`,
      hindi: `Jo final result dikha raha hai... ${cardName}...`,
    },
  };
  
  const key = position.name.toLowerCase();
  return positionOpening[key]?.[language] || positionOpening.current[language] || 
    `Jo ${cardName} dikh raha hai...`;
}

export function getShuffleMessages(language: string = 'hinglish'): string[] {
  const messages: Record<string, string[]> = {
    hinglish: [
      "Cards arrange ho rahe hain...",
      "Thoda patience rakhho...",
      "Jo aana hai woh aa raha hai...",
      "Energy align ho rahi hai...",
    ],
    english: [
      "The cards are shuffling...",
      "Hold on a moment...", 
      "What's meant to come is coming...",
      "Aligning your energy...",
    ],
    hindi: [
      "Cards arrange ho rahe hain...",
      "Thoda sabr rakhho...",
      "Jo aana hai woh aa raha hai...",
      "Energy align ho rahi hai...",
    ],
  };
  
  return messages[language] || messages.hinglish;
}

export function getRevealMessages(language: string = 'hinglish'): string[] {
  const messages: Record<string, string[]> = {
    hinglish: [
      "Yeh pehla signal hai...",
      "Jo abhi aa raha hai woh important hai...",
      "Dekho kya dikh raha hai...",
      "Ismein kuch interesting hai...",
    ],
    english: [
      "Here's the first signal...",
      "What comes through now is significant...", 
      "Take a look at what reveals...",
      "Something interesting is emerging...",
    ],
  };
  
  return messages[language] || messages.hinglish;
}