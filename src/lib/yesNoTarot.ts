// Minimal YesNo tarot functionality for the yesno page
// Uses simpler logic since detailed tarot engine is removed

export interface YesNoTarotCard {
  name: string;
  suit?: string;
  result: 'YES' | 'NO' | 'MAYBE';
}

const yesNoCards: YesNoTarotCard[] = [
  { name: 'The Fool', result: 'YES' },
  { name: 'The Magician', result: 'YES' },
  { name: 'The High Priestess', result: 'MAYBE' },
  { name: 'The Empress', result: 'YES' },
  { name: 'The Emperor', result: 'MAYBE' },
  { name: 'The Lovers', result: 'YES' },
  { name: 'The Chariot', result: 'YES' },
  { name: 'Strength', result: 'YES' },
  { name: 'The Hermit', result: 'MAYBE' },
  { name: 'Wheel of Fortune', result: 'MAYBE' },
  { name: 'Justice', result: 'MAYBE' },
  { name: 'The Hanged Man', result: 'NO' },
  { name: 'Death', result: 'NO' },
  { name: 'Temperance', result: 'MAYBE' },
  { name: 'The Devil', result: 'NO' },
  { name: 'The Tower', result: 'NO' },
  { name: 'The Star', result: 'YES' },
  { name: 'The Moon', result: 'MAYBE' },
  { name: 'The Sun', result: 'YES' },
  { name: 'Judgement', result: 'YES' },
  { name: 'The World', result: 'YES' },
];

const cardImageMap: Record<string, string> = {
  'The Fool': 'tc-fool',
  'The Magician': 'tc-magician',
  'The High Priestess': 'tc-high-priestess',
  'The Empress': 'tc-empress',
  'The Emperor': 'tc-emperor',
  'The Lovers': 'tc-lovers',
  'The Chariot': 'tc-chariot',
  'Strength': 'tc-strength',
  'The Hermit': 'tc-hermit',
  'Wheel of Fortune': 'tc-wheel',
  'Justice': 'tc-justice',
  'The Hanged Man': 'tc-hanged-man',
  'Death': 'tc-death',
  'Temperance': 'tc-temperance',
  'The Devil': 'tc-devil',
  'The Tower': 'tc-tower',
  'The Star': 'tc-star',
  'The Moon': 'tc-moon',
  'The Sun': 'tc-sun',
  'Judgement': 'tc-judgement',
  'The World': 'tc-world',
};

export function selectYesNoCard(question: string): YesNoTarotCard {
  const hash = question.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  const index = Math.abs(hash) % yesNoCards.length;
  return yesNoCards[index];
}

export function getCardImage(cardName: string): string {
  const normalized = cardName.toLowerCase().replace(/[^a-z]/g, '-');
  return `/tdt-v3/cards/${cardImageMap[cardName] || normalized}.png`;
}

const emotionalOpenings = {
  YES: [
    'The energy says yes—this path aligns with your truth.',
    'A strong affirmative—conditions favor your desire.',
    'The cards confirm: movement toward this goal is supported.',
  ],
  NO: [
    'The wisdom here says no—not the right time or way.',
    'A protective energy blocks this path for now.',
    'The answer is no, but it shields you from greater difficulty.',
  ],
  MAYBE: [
    'The situation remains fluid—too many variables to be certain.',
    'Mixed signals suggest waiting for clearer timing.',
    'Neither yes nor no—the answer lies in your choices ahead.',
  ],
};

const guidanceTexts = {
  YES: [
    'Proceed with confidence—but stay attuned to signs along the way.',
    'This affirmation carries responsibility—act with clear intention.',
    'The green light is yours; trust your ability to navigate forward.',
  ],
  NO: [
    'Use this pause to gather resources and refine your approach.',
    'Redirect this energy toward what is possible right now.',
    'This no protects what is fragile; tend to your foundation first.',
  ],
  MAYBE: [
    'Observe without forcing—allow clarity to emerge naturally.',
    'Your next action should be small, reversible, and observant.',
    'Sit with the ambiguity; the answer will reveal itself in time.',
  ],
};

export function generateYesNoResponse(question: string, card: YesNoTarotCard) {
  const openings = emotionalOpenings[card.result];
  const guidance = guidanceTexts[card.result];

  return {
    resultText: card.result,
    cardName: card.name,
    emotionalOpening: openings[Math.floor(Math.random() * openings.length)],
    guidanceIntro: 'What this means for you:',
    guidance: guidance[Math.floor(Math.random() * guidance.length)],
  };
}

export const yesNoSuspenseMessages = [
  'The cards are gathering…',
  'Reading the signs for you…',
  'Listening to what wants to be known…',
  'The answer is forming…',
];

export const yesNoEmptyQuestionMessage = 'A question needs your heart, not just your words.';
