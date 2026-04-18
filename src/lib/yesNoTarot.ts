export type YesNoResult = 'YES' | 'NO' | 'MAYBE';

export interface YesNoTarotCard {
  name: string;
  result: YesNoResult;
  guidance: string;
}

export const yesNoTarot: YesNoTarotCard[] = [
  { name: 'The Fool', result: 'YES', guidance: 'Nayi shuruat ke liye taiyaar ho jao. Universes tumhare saath hai.' },
  { name: 'The Magician', result: 'YES', guidance: ' tumhari paas wo sab kuch hai jo tumhe chahiye. Abhi ki power use karo.' },
  { name: 'The High Priestess', result: 'MAYBE', guidance: 'Andar ki aawaz suno. Sachai usme chupi hai jo tum dhund rahe ho.' },
  { name: 'The Empress', result: 'YES', guidance: 'Love aur taqat ki energy tumhare paas aa rahi hai. Growth confirm hai.' },
  { name: 'The Emperor', result: 'YES', guidance: 'Control aur authority tumhare haath mein hai. Structure ka result milega.' },
  { name: 'The Hierophant', result: 'MAYBE', guidance: 'Tradition ke raaste mein kuch answer milein ge, par original tarika bhi socho.' },
  { name: 'The Lovers', result: 'YES', guidance: 'Connection strong hai. Love ki direction clear hai.' },
  { name: 'The Chariot', result: 'YES', guidance: 'Willpower se sab kuch possible hai. Determination jeet lega.' },
  { name: 'Strength', result: 'YES', guidance: 'Andar ki shakti se yeh safal hoga. Patience rakhho.' },
  { name: 'The Hermit', result: 'NO', guidance: 'Thoda door hokar socho. Solitude mein answer milega.' },
  { name: 'Wheel of Fortune', result: 'YES', guidance: 'Change aa raha hai jo favo kar raha hai. Timing perfect hai.' },
  { name: 'Justice', result: 'MAYBE', guidance: 'Fairness ka result aayega. Wait karo aur watch karo.' },
  { name: 'The Hanged Man', result: 'NO', guidance: 'Rukh jao aur naye angle se dekho. Current plan se kuch nahi hoga.' },
  { name: 'Death', result: 'YES', guidance: 'Transformation ho raha hai. Purana khatam ho raha hai, nayi shuruat ho rahi hai.' },
  { name: 'Temperance', result: 'YES', guidance: 'Balance rakhho. Moderate approach se result milega.' },
  { name: 'The Devil', result: 'NO', guidance: 'Attachment ya temptation se door rehna hoga.' },
  { name: 'The Tower', result: 'NO', guidance: 'Sudden disruption possible hai. Prepare rehna chahiye.' },
  { name: 'The Star', result: 'YES', guidance: 'Hope full power ke saath. Healing aur positivity aa rahi hai.' },
  { name: 'The Moon', result: 'MAYBE', guidance: 'Confusion hai. Trust karo apni inner feeling ko.' },
  { name: 'The Sun', result: 'YES', guidance: 'Clarity aur success confirm hai. Positive energy bahut zyada hai.' },
  { name: 'Judgement', result: 'YES', guidance: 'Awakening ka samay hai. Answer reveal hone wala hai.' },
  { name: 'The World', result: 'YES', guidance: 'Completion ke kareeb ho. Tum apni destination par pahunch rahe ho.' },
  { name: 'Ace of Wands', result: 'YES', guidance: 'Nayi inspiration aur creative energy aa rahi hai.' },
  { name: 'Two of Wands', result: 'MAYBE', guidance: 'Future planning mein kuch unclear hai.' },
  { name: 'Three of Wands', result: 'YES', guidance: 'Progress happening hai. Expansion ke signs hain.' },
  { name: 'Four of Wands', result: 'YES', guidance: 'Celebration ke vibes hain. Harmony secure hai.' },
  { name: 'Five of Wands', result: 'MAYBE', guidance: 'Competition ya conflict kaafi strong hai.' },
  { name: 'Six of Wands', result: 'YES', guidance: 'Victory tumhare liye taiyaar hai. Recognition aayega.' },
  { name: 'Seven of Wands', result: 'YES', guidance: 'Defense strong hai. Fight karo, tum jeetoge.' },
  { name: 'Eight of Wands', result: 'YES', guidance: 'Fast movement happening hai. Quick results ke signs hain.' },
  { name: 'Nine of Wands', result: 'YES', guidance: 'Last push chahiye. Tumalmost pahunch gaye ho.' },
  { name: 'Ten of Wands', result: 'NO', guidance: 'Bohot burden hai. Kuch release karna padega.' },
  { name: 'Page of Wands', result: 'YES', guidance: 'Nayi opportunities explore karne ke liye ready rho.' },
  { name: 'Knight of Wands', result: 'YES', guidance: 'Action liye taiyaar ho. Passion se movement hoga.' },
  { name: 'Queen of Wands', result: 'YES', guidance: 'Confidence ke saath aage badho. Determination se kaam hoga.' },
  { name: 'King of Wands', result: 'YES', guidance: 'Leadership ki khooshish results dega. Victory tumhari hai.' },
  { name: 'Ace of Cups', result: 'YES', guidance: 'Nayi feelings involve hain. Emotional new beginning hai.' },
  { name: 'Two of Cups', result: 'YES', guidance: 'Partnership strong hai. Mutual connection confirm hai.' },
  { name: 'Three of Cups', result: 'YES', guidance: 'Celebration time hai. Joy aur friendship full hai.' },
  { name: 'Four of Cups', result: 'MAYBE', guidance: 'Disappointment ke baad nayi opportunity mil sakti hai.' },
  { name: 'Five of Cups', result: 'NO', guidance: 'Loss handle karna pad sakta hai. Focus remaining pe rakho.' },
  { name: 'Six of Cups', result: 'YES', guidance: 'Nostalgic happy vibes hain. Past se positivity milegi.' },
  { name: 'Seven of Cups', result: 'MAYBE', guidance: 'Be careful with illusions. Reality check karo.' },
  { name: 'Eight of Cups', result: 'NO', guidance: 'Chhod jaana better hai. Emotional journey continue.' },
  { name: 'Nine of Cups', result: 'YES', guidance: 'Emotional satisfaction milne wala hai.' },
  { name: 'Ten of Cups', result: 'YES', guidance: 'Family harmony aur love full confirm hai.' },
  { name: 'Ace of Swords', result: 'YES', guidance: 'Clarity aa gayi hai. Truth tumhare paas hai.' },
  { name: 'Two of Swords', result: 'MAYBE', guidance: 'Decision mushkil hai. Ek choice zaroor karni hai.' },
  { name: 'Three of Swords', result: 'NO', guidance: 'Heartbreak possible hai. Pain zaroor hoga.' },
  { name: 'Four of Swords', result: 'NO', guidance: 'Rest aur recovery ke liye time chahiye.' },
  { name: 'Five of Swords', result: 'NO', guidance: 'Conflict se better hai door rehna.' },
  { name: 'Six of Swords', result: 'YES', guidance: 'Transition kaafi positive hai. Aage movement hoga.' },
  { name: 'Seven of Swords', result: 'MAYBE', guidance: 'Deception ka dar hai. Careful rho.' },
  { name: 'Eight of Swords', result: 'NO', guidance: 'Trapped feel ho raha hai. Liberation tough hai.' },
  { name: 'Nine of Swords', result: 'NO', guidance: 'Anxiety aur worry bahut zyada hai.' },
  { name: 'Ten of Swords', result: 'NO', guidance: 'Rock bottom possible hai. Bohot mushkil samay hai.' },
  { name: 'Ace of Pentacles', result: 'YES', guidance: 'Material opportunity aa rahi hai. New beginning confirm hai.' },
  { name: 'Two of Pentacles', result: 'MAYBE', guidance: 'Balance karna padega. Juggling challenging hai.' },
  { name: 'Three of Pentacles', result: 'YES', guidance: 'Teamwork results dega. Collaboration successful hai.' },
  { name: 'Four of Pentacles', result: 'MAYBE', guidance: 'Security strong hone ke baad bhi kuch release karna hoga.' },
  { name: 'Five of Pentacles', result: 'NO', guidance: 'Financial struggle continue kar sakta hai.' },
  { name: 'Six of Pentacles', result: 'YES', guidance: 'Generosity ke results aayenge. Share karo, receive karoge.' },
  { name: 'Seven of Pentacles', result: 'YES', guidance: 'Patience results dega. Investment worth hai.' },
  { name: 'Eight of Pentacles', result: 'YES', guidance: 'Skill development productive hai. Focus results dega.' },
  { name: 'Nine of Pentacles', result: 'YES', guidance: 'Independence aur luxury achievements confirm hain.' },
  { name: 'Ten of Pentacles', result: 'YES', guidance: 'Wealth aur family legacy secure hai.' },
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

type QuestionTone = 'positive' | 'negative' | 'confused';

const positiveKeywords = [
  'kya', 'will', 'can', 'do', 'possible', 'success', 'achieve', 'win', 'get', 'have', 'good', '好消息',
  'good news', 'expect', 'hoping', 'wish', 'want', 'go', 'make', 'take', 'move', 'start',
  'begin', 'grow', 'improve', 'better', 'positive'
];

const negativeKeywords = [
  'not', "won't", "can't", 'never', 'no', 'dont', "don't", 'failed', 'lose', 'end',
  'stop', 'avoid', 'wrong', 'bad', 'wrong', 'hurt', 'pain', 'fear', 'worry', 'avoid',
  'stop', 'leave', 'broke', 'broken', 'stop', 'finish', 'over', 'done'
];

const confusedKeywords = [
  'should', 'would', 'could', 'what', 'how', 'when', 'whether', 'if', 'confused',
  'lost', 'unclear', 'uncertain', 'decide', 'choice', 'option', 'which', 'help', 'advice'
];

function analyzeQuestionTone(question: string): QuestionTone {
  const lowerQ = question.toLowerCase();
  
  const positiveCount = positiveKeywords.filter(k => lowerQ.includes(k)).length;
  const negativeCount = negativeKeywords.filter(k => lowerQ.includes(k)).length;
  const confusedCount = confusedKeywords.filter(k => lowerQ.includes(k)).length;
  
  if (confusedCount > positiveCount && confusedCount > negativeCount) return 'confused';
  if (negativeCount > positiveCount) return 'negative';
  return 'positive';
}

function getMatchingResultTones(tone: QuestionTone): YesNoResult[] {
  switch (tone) {
    case 'positive':
      return ['YES', 'MAYBE'];
    case 'negative':
      return ['NO', 'MAYBE'];
    case 'confused':
      return ['MAYBE', 'YES', 'NO'];
    default:
      return ['YES', 'NO', 'MAYBE'];
  }
}

export function selectYesNoCard(question: string): YesNoTarotCard {
  const tone = analyzeQuestionTone(question);
  const seed = hashCode(question + Date.now().toString().slice(0, 8));
  const preferredResults = getMatchingResultTones(tone);
  
  const matchingCards = yesNoTarot.filter(card => preferredResults.includes(card.result));
  
  if (matchingCards.length === 0) {
    const randomIdx = Math.floor(seededRandom(seed) * yesNoTarot.length);
    return yesNoTarot[randomIdx];
  }
  
  const weightedCards = matchingCards.map((card, idx) => {
    let weight = 1;
    if (tone === 'confused' && card.result === 'MAYBE') weight += 2;
    else if (tone === 'positive' && card.result === 'YES') weight += 2;
    else if (tone === 'negative' && card.result === 'NO') weight += 2;
    weight += seededRandom(seed + idx) * 2;
    return { card, weight };
  });
  
  const totalWeight = weightedCards.reduce((sum, cw) => sum + cw.weight, 0);
  let random = seededRandom(seed) * totalWeight;
  
  for (const { card, weight } of weightedCards) {
    random -= weight;
    if (random <= 0) return card;
  }
  
  return weightedCards[0].card;
}

const emotionalOpenings: Record<YesNoResult, string[]> = {
  YES: [
    "Jo energy aa rahi hai... yeh ek clear YES ki taraf ja rahi hai...",
    "Universe bol raha hai, haan!",
    "Tumhara question sun liya gaya hai... aur jawaab HAI!",
    "Energy positively strong hai. Yeh hoga!",
    "Card ke saare signals YES ki taraf arrow kar rahe hain..."
  ],
  NO: [
    "Yeh kaafi clearly NO ki taraf ja raha hai...",
    "Universe keh raha hai abhi NAHIN...",
    "Card bol rahe hain, is waqt yeh sahi nahi hai.",
    "Timing abhi perfect nahi hai. Wait karna pad sakta hai.",
    "Jo energy aa rahi hai... woh NO ki taraf directed hai."
  ],
  MAYBE: [
    "Yeh ek tricky sawaal hai...",
    "Card keh raha hai thoda uncertain hai.",
    "Is par depends karta hai tumhaara next move kya hoga.",
    "Energy is balanced par khali nahi. Consider carefully.",
    "Universe keh raha hai socho, socho, fir decide karo."
  ]
};

const guidanceIntros: Record<YesNoResult, string[]> = {
  YES: [
    "Is card ka signal yeh keh raha hai:",
    "Guidance yeh aa raha hai:",
    "Jo guidance aapko mil raha hai:",
    "Iska matlab yeh hai:"
  ],
  NO: [
    "Iska signal clear hai:",
    "Guidance bolta hai:",
    "Jo guidance aapko mil raha hai:",
    "Iska matlab seedha hai:"
  ],
  MAYBE: [
    "Is card ki Guidance:",
    "Jo guidance aapko mil raha hai:",
    "Iska matlab:",
    "Guidance yeh keh rahi hai:"
  ]
};

export function generateYesNoResponse(question: string, card: YesNoTarotCard): { 
  emotionalOpening: string; 
  resultText: string; 
  guidanceIntro: string;
  guidance: string;
  cardName: string;
} {
  const seed = hashCode(question);
  const emotionalOpeningsList = emotionalOpenings[card.result];
  const guidanceIntrosList = guidanceIntros[card.result];
  
  const emotionalOpening = emotionalOpeningsList[Math.floor(seededRandom(seed) * emotionalOpeningsList.length)];
  const guidanceIntro = guidanceIntrosList[Math.floor(seededRandom(seed + 1) * guidanceIntrosList.length)];
  
  let resultText: string;
  switch (card.result) {
    case 'YES':
      resultText = seededRandom(seed + 2) > 0.5 ? 'BIG YES!' : 'YES';
      break;
    case 'NO':
      resultText = seededRandom(seed + 2) > 0.5 ? 'NOT THIS TIME' : 'NO';
      break;
    default:
      resultText = seededRandom(seed + 2) > 0.5 ? 'WAIT & SEE' : 'MAYBE';
  }
  
  const guidance = card.guidance;
  
  return {
    emotionalOpening,
    resultText,
    guidanceIntro,
    guidance,
    cardName: card.name
  };
}

export const yesNoSuspenseMessages = [
  "Connecting with your energy...",
  "The cards are listening...",
  "Let me see what's coming through for you...",
];

export const yesNoEmptyQuestionMessage = "Pehle apna sawal likho... tabhi kuch clear aayega";