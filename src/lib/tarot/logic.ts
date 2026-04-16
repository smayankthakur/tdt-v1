import { tarotDeck, getAllCards, TarotCard } from './deck';

export { tarotDeck, getAllCards };
export type { TarotCard };

export interface SelectedCard {
  card: TarotCard;
  position: string;
  isReversed: boolean;
  weight: number;
}

export interface AnalysisResult {
  theme: string;
  emotion: string;
  urgency: 'low' | 'medium' | 'high';
  hiddenInsight: string;
}

export function analyzeQuestion(question: string): AnalysisResult {
  const lowerQ = question.toLowerCase();
  let theme = 'general';
  let emotion = 'neutral';
  let urgency: 'low' | 'medium' | 'high' = 'medium';
  
  // Detect theme
  if (lowerQ.match(/love|relationship|partner|boyfriend|girlfriend|ex|heart|romance|marriage/)) {
    theme = 'love';
  } else if (lowerQ.match(/career|job|work|boss|colleague|promotion|salary|business/)) {
    theme = 'career';
  } else if (lowerQ.match(/money|financial|rich|debt|invest|wealth|finance/)) {
    theme = 'finance';
  } else if (lowerQ.match(/no contact|hasn.t reached|not talking|silence|blocked|waiting/)) {
    theme = 'no_contact';
  }
  
  // Detect emotion
  if (lowerQ.match(/worried|stress|nervous|uncertain|afraid|fear|scared|anxious/)) {
    emotion = 'anxious';
    urgency = 'high';
  } else if (lowerQ.match(/hope|wish|positive|good|better|dream|want/)) {
    emotion = 'hopeful';
    urgency = 'low';
  } else if (lowerQ.match(/confused|lost|direction|don.t know|what should/)) {
    emotion = 'confused';
    urgency = 'high';
  } else if (lowerQ.match(/hurt|pain|broken|miss|heart|sad|grief|breakup/)) {
    emotion = 'heartbroken';
    urgency = 'high';
  } else if (lowerQ.match(/stuck|blocked|can.t|repetitive|going in circles/)) {
    emotion = 'stuck';
    urgency = 'medium';
  } else if (lowerQ.match(/will|determined|must|need to|try|fight/)) {
    emotion = 'determined';
    urgency = 'low';
  }
  
  // Hidden insight based on theme
  let hiddenInsight = '';
  if (theme === 'no_contact') {
    hiddenInsight = 'This person is waiting for contact but fear is holding them back.';
  } else if (theme === 'love') {
    hiddenInsight = 'There is emotional vulnerability beneath the surface.';
  } else if (emotion === 'anxious') {
    hiddenInsight = 'The anxiety stems from a fear of loss of control.';
  }
  
  return { theme, emotion, urgency, hiddenInsight };
}

export interface CardMetadata {
  tags: string[];
  emotions: string[];
  weightBase: number;
}

export interface EmotionAnalysis {
  primary: string;
  secondary: string;
  intensity: number;
}

export interface PickCardsOptions {
  userId?: string;
  sessionId?: string;
  topic?: string;
  question?: string;
  history?: CardHistory[];
  count?: number;
}

export interface CardHistory {
  cards: string[];
  topic?: string;
  question?: string;
  createdAt: Date;
}

// Extended card metadata with tags and emotions
const CARD_METADATA: Record<string, CardMetadata> = {
  fool: { tags: ['new', 'adventure', 'trust'], emotions: ['excited', 'uncertain', 'hopeful'], weightBase: 1.0 },
  magician: { tags: ['manifestation', 'power', 'skill'], emotions: ['confident', 'ready', 'capable'], weightBase: 1.0 },
  'high-priestess': { tags: ['intuition', 'mystery', 'hidden'], emotions: ['curious', 'seeking', 'introspective'], weightBase: 1.0 },
  empress: { tags: ['love', 'nurturing', 'abundance'], emotions: ['hopeful', 'longing', 'creative'], weightBase: 1.0 },
  emperor: { tags: ['control', 'structure', 'authority'], emotions: ['anxious', 'seeking-stability', 'determined'], weightBase: 1.0 },
  lovers: { tags: ['love', 'harmony', 'choice'], emotions: ['longing', 'conflicted', 'hopeful'], weightBase: 1.3 },
  chariot: { tags: ['victory', 'will', 'determination'], emotions: ['determined', 'frustrated', 'ready'], weightBase: 1.0 },
  strength: { tags: ['courage', 'patience', 'inner-power'], emotions: ['tired', 'brave', 'persistent'], weightBase: 1.0 },
  hermit: { tags: ['wisdom', 'solitude', 'guidance'], emotions: ['lost', 'seeking', 'reflective'], weightBase: 1.0 },
  wheel: { tags: ['change', 'fate', 'opportunity'], emotions: ['anxious', 'hopeful', 'expectant'], weightBase: 1.0 },
  justice: { tags: ['balance', 'truth', 'karma'], emotions: ['seeking-justice', 'guilty', 'balanced'], weightBase: 1.0 },
  'hanged-man': { tags: ['surrender', 'pause', 'new-perspective'], emotions: ['stuck', 'confused', 'patient'], weightBase: 1.0 },
  death: { tags: ['transformation', 'ending', 'new-beginning'], emotions: ['fearful', 'ready', 'transforming'], weightBase: 1.1 },
  temperance: { tags: ['balance', 'patience', 'moderation'], emotions: ['restless', 'seeking-balance', 'calm'], weightBase: 1.0 },
  devil: { tags: ['temptation', 'shadow', 'addiction'], emotions: ['tempted', 'trapped', 'desiring'], weightBase: 1.1 },
  tower: { tags: ['breakdown', 'revelation', 'chaos'], emotions: ['shocked', 'fearful', 'relieved'], weightBase: 1.0 },
  star: { tags: ['hope', 'healing', 'inspiration'], emotions: ['hopeful', 'healing', 'peaceful'], weightBase: 1.3 },
  moon: { tags: ['intuition', 'illusion', 'dreams'], emotions: ['confused', 'dreamy', 'paranoid'], weightBase: 1.0 },
  sun: { tags: ['success', 'joy', 'vitality'], emotions: ['happy', 'successful', 'optimistic'], weightBase: 1.2 },
  judgement: { tags: ['awakening', 'renewal', 'call'], emotions: ['judgmental', 'hopeful', 'ready'], weightBase: 1.0 },
  world: { tags: ['completion', 'achievement', 'wholeness'], emotions: ['accomplished', 'complete', 'fulfilled'], weightBase: 1.1 },
  // Cups (emotional cards)
  'ace-cups': { tags: ['love', 'new-feeling', 'emotion'], emotions: ['hopeful', 'loving', 'emotional'], weightBase: 1.2 },
  'two-cups': { tags: ['love', 'partnership', 'union'], emotions: ['longing', 'loving', 'connected'], weightBase: 1.4 },
  'three-cups': { tags: ['celebration', 'friendship', 'joy'], emotions: ['happy', 'social', 'joyful'], weightBase: 1.0 },
  'four-cups': { tags: ['disappointment', 'apathy', 'contemplation'], emotions: ['disappointed', 'bored', 'reflective'], weightBase: 1.0 },
  'five-cups': { tags: ['loss', 'grief', 'moving-on'], emotions: ['grieving', 'sad', 'lost'], weightBase: 1.2 },
  'six-cups': { tags: ['nostalgia', 'memories', 'innocence'], emotions: ['nostalgic', 'wistful', 'sweet'], weightBase: 1.1 },
  'seven-cups': { tags: ['fantasy', 'choices', 'wishful-thinking'], emotions: ['dreaming', 'confused', 'wishful'], weightBase: 1.0 },
  'eight-cups': { tags: ['walking-away', 'search', 'emotional'], emotions: ['sad', 'seeking', 'moving-on'], weightBase: 1.1 },
  'nine-cups': { tags: ['satisfaction', 'wishes', 'contentment'], emotions: ['happy', 'satisfied', 'fulfilled'], weightBase: 1.2 },
  'ten-cups': { tags: ['love', 'harmony', 'family'], emotions: ['loving', 'happy', 'fulfilled'], weightBase: 1.3 },
  // Swords (mental cards)
  'ace-swords': { tags: ['clarity', 'truth', 'new-idea'], emotions: ['clear', 'determined', 'truthful'], weightBase: 1.1 },
  'two-swords': { tags: ['conflict', 'indecision', 'blocked'], emotions: ['confused', 'stuck', 'conflicted'], weightBase: 1.1 },
  'three-swords': { tags: ['heartbreak', 'pain', 'grief'], emotions: ['hurt', 'sad', 'heartbroken'], weightBase: 1.3 },
  'four-swords': { tags: ['rest', 'recovery', 'peace'], emotions: ['tired', 'resting', 'peaceful'], weightBase: 1.0 },
  'five-swords': { tags: ['conflict', 'win-lose', 'aggression'], emotions: ['angry', 'competitive', 'hurt'], weightBase: 1.0 },
  'six-swords': { tags: ['transition', 'journey', 'moving-on'], emotions: ['hopeful', 'moving', 'transitioning'], weightBase: 1.0 },
  'seven-swords': { tags: ['strategy', 'defense', 'conflict'], emotions: ['defensive', 'strategic', 'worried'], weightBase: 1.0 },
  'eight-swords': { tags: ['trapped', '限制', 'victim'], emotions: ['trapped', 'stuck', 'helpless'], weightBase: 1.1 },
  'nine-swords': { tags: ['anxiety', 'fear', 'nightmare'], emotions: ['anxious', 'fearful', 'worried'], weightBase: 1.2 },
  'ten-swords': { tags: ['betrayal', 'ending', 'pain'], emotions: ['betrayed', 'devastated', 'ended'], weightBase: 1.1 },
  // Wands (action cards)
  'ace-wands': { tags: ['inspiration', 'new-beginnings', 'action'], emotions: ['inspired', 'ready', 'energetic'], weightBase: 1.1 },
  'two-wands': { tags: ['planning', 'future', 'progress'], emotions: ['planning', 'optimistic', 'ready'], weightBase: 1.0 },
  'three-wands': { tags: ['progress', 'expansion', 'patience'], emotions: ['growing', 'patient', 'expectant'], weightBase: 1.0 },
  'four-wands': { tags: ['celebration', 'home', 'harmony'], emotions: ['happy', 'celebrating', 'home'], weightBase: 1.1 },
  'five-wands': { tags: ['conflict', 'competition', 'challenge'], emotions: ['competitive', 'stressed', 'challenged'], weightBase: 1.0 },
  'six-wands': { tags: ['victory', 'recognition', 'triumph'], emotions: ['victorious', 'proud', 'celebrated'], weightBase: 1.2 },
  'seven-wands': { tags: ['defense', 'challenge', 'will'], emotions: ['defensive', 'determined', 'challenged'], weightBase: 1.0 },
  'eight-wands': { tags: ['speed', 'movement', 'rapid-change'], emotions: ['fast-paced', 'moving', 'quick'], weightBase: 1.0 },
  'nine-wands': { tags: ['perseverance', 'last-stand', 'tired'], emotions: ['tired', 'persevering', 'holding-on'], weightBase: 1.0 },
  'ten-wands': { tags: ['burden', 'responsibility', 'weight'], emotions: ['burdened', 'heavy', 'stressed'], weightBase: 1.1 },
  // Pentacles (material cards)
  'ace-pentacles': { tags: ['opportunity', 'new-beginnings', 'material'], emotions: ['excited', 'opportunistic', 'new'], weightBase: 1.1 },
  'two-pentacles': { tags: ['balance', 'choices', 'flexibility'], emotions: ['balancing', 'choosing', 'flexible'], weightBase: 1.0 },
  'three-pentacles': { tags: ['work', 'collaboration', 'skill'], emotions: ['working', 'skilled', 'collaborative'], weightBase: 1.0 },
  'four-pentacles': { tags: ['security', 'control', 'holding-on'], emotions: ['secure', 'controlling', 'guarded'], weightBase: 1.0 },
  'five-pentacles': { tags: ['hardship', 'isolation', 'struggle'], emotions: ['struggling', 'isolated', 'needy'], weightBase: 1.1 },
  'six-pentacles': { tags: ['generosity', 'sharing', 'charity'], emotions: ['generous', 'giving', 'receiving'], weightBase: 1.0 },
  'seven-pentacles': { tags: ['patience', 'investment', 'reward'], emotions: ['patient', 'investing', 'waiting'], weightBase: 1.0 },
  'eight-pentacles': { tags: ['skill', 'learning', 'craft'], emotions: ['learning', 'skilled', 'practicing'], weightBase: 1.0 },
  'nine-pentacles': { tags: ['independence', 'luxury', 'accomplishment'], emotions: ['independent', 'accomplished', 'comfortable'], weightBase: 1.1 },
  'ten-pentacles': { tags: ['wealth', 'legacy', 'family'], emotions: ['wealthy', 'fulfilled', 'established'], weightBase: 1.2 },
};

// Emotion keyword mappings
const EMOTION_KEYWORDS: Record<string, string[]> = {
  longing: ['miss', 'come back', 'want', 'need', 'love', 'heart', 'together', 'no contact', 'ex', 'breakup'],
  anxiety: ['career', 'job', 'work', 'money', 'financial', 'stress', 'worried', 'future', 'stability'],
  confusion: ['confused', 'don\'t know', 'uncertain', 'lost', 'direction', 'what should', 'help me'],
  hope: ['hopeful', 'hope', 'wish', 'best', 'positive', 'good', 'better', 'dream'],
  fear: ['scared', 'afraid', 'fear', 'worried', 'anxious', 'nervous', 'terrified'],
  sadness: ['sad', 'hurt', 'pain', 'depressed', 'lonely', 'broken', 'crying', 'grief'],
  anger: ['angry', 'hurt', 'betrayed', 'hate', 'frustrated', 'annoyed', 'mad'],
  excitement: ['excited', 'happy', 'joy', 'celebrate', 'great', 'amazing', 'wonderful'],
  determination: ['will', 'determined', 'must', 'need to', 'going to', 'try', 'fight'],
};

// Topic keyword mappings
const TOPIC_KEYWORDS: Record<string, string[]> = {
  love: ['love', 'relationship', 'partner', 'dating', 'marriage', 'crush', 'heart', 'romance', 'boyfriend', 'girlfriend'],
  career: ['career', 'job', 'work', 'boss', 'colleague', 'promotion', 'salary', 'unemployed', 'business'],
  finance: ['money', 'financial', 'rich', 'debt', 'invest', 'income', 'lottery', 'wealth', 'prosperity'],
  health: ['health', 'sick', 'ill', 'doctor', 'hospital', 'wellness', 'heal', 'disease'],
  family: ['family', 'parent', 'mother', 'father', 'sibling', 'child', 'kids', 'marriage', 'wedding'],
  general: ['future', 'life', 'path', 'purpose', ' destiny', 'luck', 'fortune', 'question'],
};

// Seeded random number generator (deterministic)
function createSeededRNG(seed: number): () => number {
  let current = seed;
  return () => {
    current = (current * 1103515245 + 12345) & 0x7fffffff;
    return current / 0x7fffffff;
  };
}

// Create seed from user context
function createSeed(options: PickCardsOptions): number {
  const { userId, sessionId, topic, question } = options;
  
  // Normalize inputs
  const id = userId || sessionId || 'anonymous';
  const topicStr = topic || 'general';
  const questionStr = question?.toLowerCase().slice(0, 50) || '';
  
  // Simple hash function
  let hash = 0;
  const str = `${id}-${topicStr}-${questionStr}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Extract emotion from question
function extractEmotion(question: string): EmotionAnalysis {
  const lowerQ = question.toLowerCase();
  let primary = 'neutral';
  let secondary = 'neutral';
  let intensity = 0.5;
  
  // Check each emotion keyword
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQ.includes(keyword)) {
        if (intensity < 0.7) {
          secondary = primary;
          primary = emotion;
          intensity = Math.min(1, intensity + 0.3);
        }
      }
    }
  }
  
  return { primary, secondary, intensity };
}

// Extract topic from question or explicit topic
function extractTopic(topic?: string, question?: string): string {
  if (topic) return topic.toLowerCase();
  
  const lowerQ = question?.toLowerCase() || '';
  
  for (const [topicName, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerQ.includes(keyword)) {
        return topicName;
      }
    }
  }
  
  return 'general';
}

// Calculate card weight based on topic, emotion, and history
function calculateCardWeight(
  card: TarotCard,
  metadata: CardMetadata,
  topic: string,
  emotion: EmotionAnalysis,
  history: CardHistory[]
): number {
  let weight = metadata.weightBase;
  
  // Topic match bonus (+0.5)
  if (metadata.tags.includes(topic)) {
    weight += 0.5;
  }
  
  // Emotion match bonus (+0.7)
  if (metadata.emotions.includes(emotion.primary)) {
    weight += 0.7;
  }
  if (metadata.emotions.includes(emotion.secondary)) {
    weight += 0.4;
  }
  
  // High emotion intensity bonus
  if (emotion.intensity > 0.7) {
    weight *= 1.2;
  }
  
  // Repetition penalty from history
  if (history.length > 0) {
    const recentCards = history.slice(0, 5).flatMap(h => h.cards);
    const cardAppearances = recentCards.filter(c => c === card.id).length;
    
    // Reduce weight for recently used cards
    weight *= Math.pow(0.4, cardAppearances);
    
    // Hard block: don't repeat exact 3-card combo
    // (handled in final selection)
  }
  
  return weight;
}

// Get card metadata with fallback
function getCardMetadata(card: TarotCard): CardMetadata {
  return CARD_METADATA[card.id] || {
    tags: ['general'],
    emotions: ['neutral'],
    weightBase: 1.0
  };
}

// The main card picking function
export function pickCards(options: PickCardsOptions): SelectedCard[] {
  const {
    userId,
    sessionId,
    topic,
    question,
    history = [],
    count = 3
  } = options;
  
  // 1. Extract topic and emotion
  const extractedTopic = extractTopic(topic, question);
  const emotion = extractEmotion(question || '');
  
  // 2. Get all cards and score them
  const allCards = getAllCards();
  const scoredCards = allCards.map(card => {
    const metadata = getCardMetadata(card);
    const weight = calculateCardWeight(card, metadata, extractedTopic, emotion, history);
    return { card, weight };
  });
  
  // 3. Sort by weight (highest first)
  scoredCards.sort((a, b) => b.weight - a.weight);
  
  // 4. Create seeded RNG
  const seed = createSeed({ userId, sessionId, topic, question });
  const seededRandom = createSeededRNG(seed);
  
  // 5. Select from top candidates (top 10-15)
  const topCandidatesCount = Math.min(15, Math.max(count * 4, allCards.length));
  const topCandidates = scoredCards.slice(0, topCandidatesCount);
  
  // 6. Weighted random selection
  const selected: SelectedCard[] = [];
  const positions = ['Past', 'Present', 'Future'];
  const availableIndices = new Set<number>(topCandidates.map((_, i) => i));
  
  // Track which card IDs have been selected to prevent exact repeat
  const selectedCardIds = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    // Get available candidates
    const available = Array.from(availableIndices).filter(idx => {
      const cardId = topCandidates[idx].card.id;
      return !selectedCardIds.has(cardId);
    });
    
    if (available.length === 0) break;
    
    // Weighted selection from available
    const weights = available.map(idx => topCandidates[idx].weight);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = seededRandom() * totalWeight;
    
    let selectedIndex = available[0];
    for (let j = 0; j < available.length; j++) {
      random -= weights[j];
      if (random <= 0) {
        selectedIndex = available[j];
        break;
      }
    }
    
    const selectedCard = topCandidates[selectedIndex];
    selectedCardIds.add(selectedCard.card.id);
    availableIndices.delete(selectedIndex);
    
    // Randomly determine if reversed (20% chance)
    const isReversed = seededRandom() < 0.2;
    
    selected.push({
      card: selectedCard.card,
      position: positions[i] || `Position ${i + 1}`,
      isReversed,
      weight: selectedCard.weight
    });
  }
  
  return selected;
}

// Legacy function for backward compatibility
export function selectRandomCards(count: number = 3): SelectedCard[] {
  return pickCards({ count });
}

// Format cards for AI with FULL data
export function formatCardsForAI(selectedCards: SelectedCard[]): string {
  return selectedCards
    .map((sc, index) => {
      const card = sc.card;
      const position = sc.position || ['Past', 'Present', 'Future'][index] || `Position ${index + 1}`;
      const orientation = sc.isReversed ? ' (Reversed)' : '';
      const meaning = sc.isReversed ? card.reversed : card.upright;
      const positionMeaning = card.positionMeanings 
        ? (position.toLowerCase().includes('past') ? card.positionMeanings.past 
           : position.toLowerCase().includes('present') ? card.positionMeanings.present 
           : card.positionMeanings.future)
        : '';
      
      return `CARD ${index + 1}: ${card.name} (${position})${orientation}
Keywords: ${card.keywords.join(', ')}
Emotions: ${card.emotions.join(', ')}
Core Meaning: ${meaning}
Position Meaning: ${positionMeaning}`;
    })
    .join('\n\n---\n\n');
}

// Format cards in a compact way for frontend display
export function formatCardsCompact(selectedCards: SelectedCard[]): string {
  return selectedCards
    .map(sc => {
      const position = sc.position || 'Position';
      const orientation = sc.isReversed ? ' (Reversed)' : '';
      return `${sc.card.name} (${position})${orientation}: ${sc.isReversed ? sc.card.reversed : sc.card.upright}`;
    })
    .join(' | ');
}
