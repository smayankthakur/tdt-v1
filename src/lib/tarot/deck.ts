export interface TarotCard {
  id: string;
  name: string;
  meaning: string;
  type: 'major' | 'minor';
  suit?: string;
}

export const tarotDeck: TarotCard[] = [
  // Major Arcana
  { id: 'fool', name: 'The Fool', meaning: 'New beginnings, innocence, trust the journey', type: 'major' },
  { id: 'magician', name: 'The Magician', meaning: 'Manifestation, using your skills to create', type: 'major' },
  { id: 'high-priestess', name: 'The High Priestess', meaning: 'Intuition, hidden knowledge, trust your instincts', type: 'major' },
  { id: 'empress', name: 'The Empress', meaning: 'Nurturing, abundance, creative energy', type: 'major' },
  { id: 'emperor', name: 'The Emperor', meaning: 'Structure, authority, stability', type: 'major' },
  { id: 'hierophant', name: 'The Hierophant', meaning: 'Tradition, guidance, belief systems', type: 'major' },
  { id: 'lovers', name: 'The Lovers', meaning: 'Love, harmony, important choices', type: 'major' },
  { id: 'chariot', name: 'The Chariot', meaning: 'Willpower, determination, victory', type: 'major' },
  { id: 'strength', name: 'Strength', meaning: 'Courage, patience, inner power', type: 'major' },
  { id: 'hermit', name: 'The Hermit', meaning: 'Introspection, wisdom, solitude', type: 'major' },
  { id: 'wheel', name: 'Wheel of Fortune', meaning: 'Change, fate, turning point', type: 'major' },
  { id: 'justice', name: 'Justice', meaning: 'Balance, truth, fairness', type: 'major' },
  { id: 'hanged-man', name: 'The Hanged Man', meaning: 'Surrender, release, new perspective', type: 'major' },
  { id: 'death', name: 'Death', meaning: 'Transformation, endings, rebirth', type: 'major' },
  { id: 'temperance', name: 'Temperance', meaning: 'Balance, moderation, harmony', type: 'major' },
  { id: 'devil', name: 'The Devil', meaning: 'Attachment, temptation, limitation', type: 'major' },
  { id: 'tower', name: 'The Tower', meaning: 'Sudden change, disruption, awakening', type: 'major' },
  { id: 'star', name: 'The Star', meaning: 'Hope, healing, inspiration', type: 'major' },
  { id: 'moon', name: 'The Moon', meaning: 'Intuition, dreams, the unconscious', type: 'major' },
  { id: 'sun', name: 'The Sun', meaning: 'Success, clarity, positivity', type: 'major' },
  { id: 'judgement', name: 'Judgement', meaning: 'Awakening, realization, decision', type: 'major' },
  { id: 'world', name: 'The World', meaning: 'Completion, fulfillment, closure', type: 'major' },
  
  // Wands (Action/Career)
  { id: 'ace-wands', name: 'Ace of Wands', meaning: 'New action, inspiration, growth', type: 'minor', suit: 'wands' },
  { id: 'two-wands', name: 'Two of Wands', meaning: 'Planning, future vision, decisions', type: 'minor', suit: 'wands' },
  { id: 'three-wands', name: 'Three of Wands', meaning: 'Expansion, progress, foresight', type: 'minor', suit: 'wands' },
  { id: 'four-wands', name: 'Four of Wands', meaning: 'Celebration, harmony, stability', type: 'minor', suit: 'wands' },
  { id: 'five-wands', name: 'Five of Wands', meaning: 'Conflict, competition, tension', type: 'minor', suit: 'wands' },
  { id: 'six-wands', name: 'Six of Wands', meaning: 'Victory, recognition, success', type: 'minor', suit: 'wands' },
  { id: 'seven-wands', name: 'Seven of Wands', meaning: 'Defense, challenge, perseverance', type: 'minor', suit: 'wands' },
  { id: 'eight-wands', name: 'Eight of Wands', meaning: 'Fast movement, rapid progress', type: 'minor', suit: 'wands' },
  { id: 'nine-wands', name: 'Nine of Wands', meaning: 'Resilience, persistence, near completion', type: 'minor', suit: 'wands' },
  { id: 'ten-wands', name: 'Ten of Wands', meaning: 'Burden, responsibility, heavy load', type: 'minor', suit: 'wands' },
  
  // Cups (Emotions/Love)
  { id: 'ace-cups', name: 'Ace of Cups', meaning: 'New feeling, emotional awakening, love', type: 'minor', suit: 'cups' },
  { id: 'two-cups', name: 'Two of Cups', meaning: 'Partnership, love, mutual attraction', type: 'minor', suit: 'cups' },
  { id: 'three-cups', name: 'Three of Cups', meaning: 'Celebration, friendship, joy', type: 'minor', suit: 'cups' },
  { id: 'four-cups', name: 'Four of Cups', meaning: 'Disappointment, apathy, contemplation', type: 'minor', suit: 'cups' },
  { id: 'five-cups', name: 'Five of Cups', meaning: 'Loss, grief, moving on', type: 'minor', suit: 'cups' },
  { id: 'six-cups', name: 'Six of Cups', meaning: 'Nostalgia, memories, innocence', type: 'minor', suit: 'cups' },
  { id: 'seven-cups', name: 'Seven of Cups', meaning: 'Fantasy, choices, wishful thinking', type: 'minor', suit: 'cups' },
  { id: 'eight-cups', name: 'Eight of Cups', meaning: 'Walking away, searching, emotional journey', type: 'minor', suit: 'cups' },
  { id: 'nine-cups', name: 'Nine of Cups', meaning: 'Satisfaction, wishes, contentment', type: 'minor', suit: 'cups' },
  { id: 'ten-cups', name: 'Ten of Cups', meaning: 'Love, harmony, family happiness', type: 'minor', suit: 'cups' },
  
  // Swords (Thoughts/Decisions)
  { id: 'ace-swords', name: 'Ace of Swords', meaning: 'Clarity, truth, new idea', type: 'minor', suit: 'swords' },
  { id: 'two-swords', name: 'Two of Swords', meaning: 'Indecision, blocked, conflict', type: 'minor', suit: 'swords' },
  { id: 'three-swords', name: 'Three of Swords', meaning: 'Heartbreak, pain, grief', type: 'minor', suit: 'swords' },
  { id: 'four-swords', name: 'Four of Swords', meaning: 'Rest, recovery, peace', type: 'minor', suit: 'swords' },
  { id: 'five-swords', name: 'Five of Swords', meaning: 'Conflict, win-lose, aggression', type: 'minor', suit: 'swords' },
  { id: 'six-swords', name: 'Six of Swords', meaning: 'Transition, journey, moving on', type: 'minor', suit: 'swords' },
  { id: 'seven-swords', name: 'Seven of Swords', meaning: 'Strategy, deception, defense', type: 'minor', suit: 'swords' },
  { id: 'eight-swords', name: 'Eight of Swords', meaning: 'Trapped, restricted, victim', type: 'minor', suit: 'swords' },
  { id: 'nine-swords', name: 'Nine of Swords', meaning: 'Anxiety, fear, nightmares', type: 'minor', suit: 'swords' },
  { id: 'ten-swords', name: 'Ten of Swords', meaning: 'Betrayal, ending, pain', type: 'minor', suit: 'swords' },
  
  // Pentacles (Material/Finance)
  { id: 'ace-pentacles', name: 'Ace of Pentacles', meaning: 'Opportunity, new beginning, prosperity', type: 'minor', suit: 'pentacles' },
  { id: 'two-pentacles', name: 'Two of Pentacles', meaning: 'Balance, choices, flexibility', type: 'minor', suit: 'pentacles' },
  { id: 'three-pentacles', name: 'Three of Pentacles', meaning: 'Work, collaboration, skill', type: 'minor', suit: 'pentacles' },
  { id: 'four-pentacles', name: 'Four of Pentacles', meaning: 'Security, control, holding on', type: 'minor', suit: 'pentacles' },
  { id: 'five-pentacles', name: 'Five of Pentacles', meaning: 'Hardship, isolation, struggle', type: 'minor', suit: 'pentacles' },
  { id: 'six-pentacles', name: 'Six of Pentacles', meaning: 'Generosity, sharing, charity', type: 'minor', suit: 'pentacles' },
  { id: 'seven-pentacles', name: 'Seven of Pentacles', meaning: 'Patience, investment, reward', type: 'minor', suit: 'pentacles' },
  { id: 'eight-pentacles', name: 'Eight of Pentacles', meaning: 'Skill, learning, craft', type: 'minor', suit: 'pentacles' },
  { id: 'nine-pentacles', name: 'Nine of Pentacles', meaning: 'Independence, luxury, accomplishment', type: 'minor', suit: 'pentacles' },
  { id: 'ten-pentacles', name: 'Ten of Pentacles', meaning: 'Wealth, legacy, family', type: 'minor', suit: 'pentacles' },
];

export function getCardById(id: string): TarotCard | undefined {
  return tarotDeck.find(card => card.id === id);
}

export function getAllCards(): TarotCard[] {
  return tarotDeck;
}
