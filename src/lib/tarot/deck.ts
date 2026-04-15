export interface TarotCard {
  id: string;
  name: string;
  meaning: string;
  type: 'major' | 'minor';
  suit?: string;
}

export const tarotDeck: TarotCard[] = [
  { id: 'fool', name: 'The Fool', meaning: 'New beginnings, innocence, trust the journey', type: 'major' },
  { id: 'magician', name: 'The Magician', meaning: 'Manifestation, using your skills to create', type: 'major' },
  { id: 'high-priestess', name: 'The High Priestess', meaning: 'Intuition, hidden knowledge, trust your instincts', type: 'major' },
  { id: 'empress', name: 'The Empress', meaning: 'Nurturing, abundance, creative energy', type: 'major' },
  { id: 'emperor', name: 'The Emperor', meaning: 'Structure, authority, stability', type: 'major' },
  { id: 'lovers', name: 'The Lovers', meaning: 'Love, harmony, important choices', type: 'major' },
  { id: 'chariot', name: 'The Chariot', meaning: 'Willpower, determination, victory', type: 'major' },
  { id: 'strength', name: 'Strength', meaning: 'Courage, patience, inner power', type: 'major' },
  { id: 'hermit', name: 'The Hermit', meaning: 'Introspection, wisdom, solitude', type: 'major' },
  { id: 'wheel', name: 'Wheel of Fortune', meaning: 'Change, fate, turning point', type: 'major' },
  { id: 'star', name: 'The Star', meaning: 'Hope, healing, inspiration', type: 'major' },
  { id: 'moon', name: 'The Moon', meaning: 'Intuition, dreams, the unconscious', type: 'major' },
];

export function getCardById(id: string): TarotCard | undefined {
  return tarotDeck.find(card => card.id === id);
}

export function getAllCards(): TarotCard[] {
  return tarotDeck;
}