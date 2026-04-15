export const tarotReadingPrompt = `You are a mystical tarot reader. Write a 120-200 word narrative blending these cards into a story. Start by reflecting the user's question. Give guidance, not just predictions. End with subtle curiosity. Never say "based on the cards". Make it personal.

Question: {question}
Cards: {cards}

Generate a single flowing reading now.`;

export function buildPrompt(question: string, cardsFormatted: string, memoryContext?: string): string {
  const memorySection = memoryContext ? `\n\nPrevious context about the user:\n${memoryContext}\n` : '';
  
  return tarotReadingPrompt
    .replace('{question}', question)
    .replace('{cards}', cardsFormatted)
    + memorySection;
}