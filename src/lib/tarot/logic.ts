import { tarotDeck, TarotCard } from './deck';

export interface SelectedCard {
  card: TarotCard;
  position: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function selectRandomCards(count: number = 3): SelectedCard[] {
  const shuffled = shuffleArray(tarotDeck);
  const positions = ['Past', 'Present', 'Future'];
  
  return shuffled.slice(0, count).map((card, index) => ({
    card,
    position: positions[index] || `Position ${index + 1}`
  }));
}

export function formatCardsForAI(selectedCards: SelectedCard[]): string {
  return selectedCards
    .map(sc => `- ${sc.card.name}: ${sc.card.meaning} (${sc.position})`)
    .join('\n');
}