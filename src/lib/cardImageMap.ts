const CARD_NAME_MAPPING: Record<string, string> = {
  // Major Arcana
  'the fool': 'The Fool',
  'the magician': 'The Magician',
  'the high priestess': 'The High Priestess',
  'the highpriestess': 'The High Priestess',
  'the empress': 'The Empress',
  'the emperor': 'The Emperor',
  'the hierophant': 'The Herophant',
  'the herophant': 'The Herophant',
  'the lovers': 'The Lovers',
  'the chariot': 'The Chariot',
  'strength': 'Strength',
  'the hermit': 'The Hermit',
  'wheel of fortune': 'Wheel of Fortune',
  'the wheel': 'Wheel of Fortune',
  'justice': 'Justice',
  'the hanged man': 'The Hanged Man',
  'the hangedman': 'The Hanged Man',
  'death': 'Death',
  'temperance': 'Temperance',
  'the devil': 'The Devil',
  'the tower': 'The Tower',
  'the star': 'The Star',
  'the moon': 'The Moon',
  'the sun': 'The Sun',
  'judgement': 'Judgement',
  'the world': 'The World',
  
  // Wands
  'ace of wands': 'Ace of Wands',
  'two of wands': 'Two of Wands',
  'three of wands': 'Three of Wands',
  'four of wands': 'Four of Wands',
  'five of wands': 'Five of Wands',
  'six of wands': 'Six of Wands',
  'seven of wands': 'Seven of Wands',
  'eight of wands': 'Eight of Wands',
  'nine of wands': 'Nine of Wands',
  'ten of wands': 'Ten of Wands',
  'page of wands': 'Page of Wands',
  'knight of wands': 'Knight of Wands',
  'queen of wands': 'Queen of Wands',
  'king of wands': 'King of Wands',
  
  // Cups
  'ace of cups': 'Ace of Cups',
  'two of cups': 'Two of Cups',
  'three of cups': 'Three of Cups',
  'four of cups': 'Four of Cups',
  'five of cups': 'Five of Cups',
  'six of cups': 'Six of Cups',
  'seven of cups': 'Seven of Cups',
  'eight of cups': 'Eight of Cups',
  'nine of cups': 'Nine of Cups',
  'ten of cups': 'Ten of Cups',
  'page of cups': 'Page of Cups',
  'knight of cups': 'Knight of Cups',
  'queen of cups': 'Queen of Cups',
  'king of cups': 'King of Cups',
  
  // Swords
  'ace of swords': 'Ace of Swords',
  'two of swords': 'Two of Swords',
  'three of swords': 'Three of Swords',
  'four of swords': 'Four of Swords',
  'five of swords': 'Five of Swords',
  'six of swords': 'Six of Swords',
  'seven of swords': 'Seven of Swords',
  'eight of swords': 'Eight of Swords',
  'nine of swords': 'Nine of Swords',
  'ten of swords': 'Ten of Swords',
  'page of swords': 'Page of Swords',
  'knight of swords': 'Knight of Swords',
  'queen of swords': 'Queen of Swords',
  'king of swords': 'King of Swords',
  
  // Pentacles
  'ace of pentacles': 'Ace of Pentacle',
  'two of pentacles': 'Two of Pentacle',
  'three of pentacles': 'Three of Pentacle',
  'four of pentacles': 'Four of Pentacle',
  'five of pentacles': 'Five of Pentacle',
  'six of pentacles': 'Six of Pentacle',
  'seven of pentacles': 'Seven of Pentacle',
  'eight of pentacles': 'Eight of Pentacle',
  'nine of pentacles': 'Nine of Pentacle',
  'ten of pentacles': 'Ten of Pentacle',
  'page of pentacles': 'Page of Pentacle',
  'knight of pentacles': 'Knight of Pentacle',
  'queen of pentacles': 'Queen of Pentacle',
  'king of pentacles': 'King of Pentacle',
};

const CARD_IMAGE_CACHE = new Map<string, string>();
const FALLBACK_CARD_IMAGE = '/card_img/The Fool.png';

function normalizeCardName(cardName: string): string {
  if (!cardName) return '';
  
  return cardName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/of$/, '')
    .trim();
}

export function getCardImage(cardName: string): string {
  if (!cardName) {
    return FALLBACK_CARD_IMAGE;
  }
  
  if (CARD_IMAGE_CACHE.has(cardName)) {
    return CARD_IMAGE_CACHE.get(cardName)!;
  }
  
  const normalized = normalizeCardName(cardName);
  const mappedName = CARD_NAME_MAPPING[normalized];
  const fileName = mappedName || cardName;
  
  const path = `/card_img/${fileName}.png`;
  CARD_IMAGE_CACHE.set(cardName, path);
  
  return path;
}

export function getCardImageUrl(cardName: string): string {
  const path = getCardImage(cardName);
  
  if (typeof window !== 'undefined') {
    try {
      const img = new window.Image();
      img.src = path;
      if (!img.complete) {
        console.warn('Missing card image:', cardName);
        return FALLBACK_CARD_IMAGE;
      }
    } catch (e) {
      return path;
    }
  }
  
  return path;
}

export function validateCardImage(cardName: string): boolean {
  if (!cardName) return false;
  
  const normalized = normalizeCardName(cardName);
  return normalized in CARD_NAME_MAPPING || normalized.length > 0;
}

export const CARD_IMAGE_BASE_PATH = '/card_img';

export const AVAILABLE_CARDS = Object.values(CARD_NAME_MAPPING);
