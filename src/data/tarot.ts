export interface TarotCard {
  id: string;
  name: string;
  meaning: string;
  reversed: string;
  type: 'major' | 'minor';
}

export const tarotCards: TarotCard[] = [
  {
    id: 'fool',
    name: 'The Fool',
    meaning: 'New beginnings, innocence, spontaneity, free spirit',
    reversed: 'Recklessness, risk-taking, lack of direction',
    type: 'major'
  },
  {
    id: 'magician',
    name: 'The Magician',
    meaning: 'Manifestation, power, skill, resourcefulness',
    reversed: 'Manipulation, deception, untapped potential',
    type: 'major'
  },
  {
    id: 'high-priestess',
    name: 'The High Priestess',
    meaning: 'Intuition, mystery, inner voice, secrets',
    reversed: 'Hidden agendas, surface-level understanding',
    type: 'major'
  },
  {
    id: 'empress',
    name: 'The Empress',
    meaning: 'Nurturing, abundance, fertility, creativity',
    reversed: 'Dependency, over-giving, emptiness',
    type: 'major'
  },
  {
    id: 'emperor',
    name: 'The Emperor',
    meaning: 'Authority, structure, stability, leadership',
    reversed: 'Tyranny, rigidity, lack of discipline',
    type: 'major'
  },
  {
    id: 'lovers',
    name: 'The Lovers',
    meaning: 'Love, harmony, relationships, choices',
    reversed: 'Disharmony, imbalance, misalignment',
    type: 'major'
  },
  {
    id: 'chariot',
    name: 'The Chariot',
    meaning: 'Willpower, victory, determination, control',
    reversed: 'Aggression, lack of direction, stagnation',
    type: 'major'
  },
  {
    id: 'strength',
    name: 'Strength',
    meaning: 'Courage, patience, inner strength, compassion',
    reversed: 'Weakness, self-doubt, aggression',
    type: 'major'
  },
  {
    id: 'hermit',
    name: 'The Hermit',
    meaning: 'Inner guidance, solitude, introspection',
    reversed: 'Isolation, loneliness, withdrawal',
    type: 'major'
  },
  {
    id: 'wheel',
    name: 'Wheel of Fortune',
    meaning: 'Change, cycles, fate, destiny',
    reversed: 'Resistance to change, bad luck, stagnation',
    type: 'major'
  },
  {
    id: 'justice',
    name: 'Justice',
    meaning: 'Balance, truth, fairness, law',
    reversed: 'Unfairness, dishonesty, lack of accountability',
    type: 'major'
  },
  {
    id: 'hanged-man',
    name: 'The Hanged Man',
    meaning: 'Surrender, release, new perspective',
    reversed: 'Stuck, resistance, holding on',
    type: 'major'
  }
];

export const getRandomCards = (count: number): TarotCard[] => {
  const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const generateInterpretation = (question: string, cards: TarotCard[]): string => {
  const cardInterpretations = cards.map((card, index) => {
    const positions = ['past', 'present', 'future'];
    return `The ${card.name} in your ${positions[index]} speaks to ${card.meaning.toLowerCase()}.`;
  }).join(' ');

  return `I sense that this situation has been weighing on you more than you admit. ${cardInterpretations} The universe is revealing that you're at a pivotal moment. Trust your intuition—it's guiding you toward the answer you seek. The cards suggest that clarity is coming, but you must be patient with yourself. What feels uncertain now will become clear in time.`;
};