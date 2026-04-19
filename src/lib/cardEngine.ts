import { TarotCard, getAllCards } from './tarot/deck';
import { CardHistory, SelectedCard, PickCardsOptions } from './tarot/logic';

// ========== SEEDED RANDOM GENERATOR ==========

function createSeededRNG(seed: number): () => number {
  let current = seed;
  return () => {
    current = (current * 1103515245 + 12345) & 0x7fffffff;
    return current / 0x7fffffff;
  };
}

// Create deterministic seed from user context
function createSeed(options: {
  question: string;
  readingType: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}): number {
  const { question, readingType, timestamp, userId, sessionId } = options;

  // Normalize to minute precision for same-question consistency
  const minuteBucket = Math.floor(timestamp / 60000);

  const id = userId || sessionId || 'anonymous';
  const questionTruncated = question.toLowerCase().slice(0, 50);
  const topicStr = readingType || 'general';

  const str = `${id}-${topicStr}-${questionTruncated}-${minuteBucket}`;

  // Simple hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ========== INTENT MAPPING ==========

export type IntentDomain = 'love' | 'career' | 'finance' | 'conflict' | 'action' | 'spiritual' | 'general';

export interface DomainAnalysis {
  primaryDomain: IntentDomain;
  secondaryDomain?: IntentDomain;
  emotionalTone: 'anxious' | 'hopeful' | 'confused' | 'heartbroken' | 'stuck' | 'determined' | 'neutral';
  keywords: string[];
}

// Suit-to-domain mapping for card filtering
const DOMAIN_SUIT_PRIORITY: Record<IntentDomain, string[]> = {
  love: ['cups', 'major'],
  career: ['wands', 'pentacles', 'major'],
  finance: ['pentacles', 'major'],
  conflict: ['swords', 'major'],
  action: ['wands', 'major'],
  spiritual: ['major', 'cups'],
  general: ['major', 'cups', 'wands', 'swords', 'pentacles'],
};

export function analyzeIntent(question: string, readingType?: string): DomainAnalysis {
  const lowerQ = question.toLowerCase();

  // Detect primary domain from question keywords + reading type
  let primaryDomain: IntentDomain = 'general';
  let secondaryDomain: IntentDomain | undefined;

  // Combined keyword detection
  const keywordMap: Record<string, string[]> = {
    love: ['love', 'relationship', 'partner', 'boyfriend', 'girlfriend', 'ex', 'heart', 'romance', 'marriage', 'shaadi', 'pyaar', 'crush', 'dating', 'union'],
    career: ['career', 'job', 'work', 'boss', 'colleague', 'promotion', 'salary', 'business', 'kaam', 'office', 'professional'],
    finance: ['money', 'financial', 'debt', 'invest', 'wealth', 'finance', 'paise', 'rich', 'income', 'lottery'],
    conflict: ['fight', 'argument', 'enemy', 'problem', 'issue', 'tension', 'conflict', 'dispute', 'blocked'],
    action: ['next step', 'action', 'move', 'should i', 'kya karein', 'what to do', 'decision'],
    spiritual: ['spiritual', 'meditation', 'soul', 'purpose', 'destiny', 'inner', ' intuition', 'energy'],
  };

  // Vote counting for domains
  const domainScores: Record<string, number> = {};

  for (const [domain, keywords] of Object.entries(keywordMap)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerQ.includes(keyword)) {
        score += 1;
        // Weight exact matches more
        if (lowerQ === keyword || lowerQ.includes(` ${keyword} `)) score += 0.5;
      }
    }
    if (score > 0) domainScores[domain] = score;
  }

  // Also consider reading type as strong signal
  if (readingType) {
    const typeToDomain: Record<string, IntentDomain> = {
      'love': 'love',
      'career': 'career',
      'finance': 'finance',
      'marriage': 'love',
      'no_contact': 'conflict',
      'general': 'general',
    };

    const topicDomain = typeToDomain[readingType];
    if (topicDomain && topicDomain !== 'general') {
      domainScores[topicDomain] = (domainScores[topicDomain] || 0) + 3; // Strong weight
    }
  }

  // Pick highest scoring domain
  const sorted = Object.entries(domainScores).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0) {
    primaryDomain = sorted[0][0] as IntentDomain;
  }
  if (sorted.length > 1) {
    secondaryDomain = sorted[1][0] as IntentDomain;
  }

  // Detect emotional tone
  let emotionalTone: DomainAnalysis['emotionalTone'] = 'neutral';
  const emotionMap: Record<string, string[]> = {
    anxious: ['worried', 'stress', 'nervous', 'uncertain', 'afraid', 'fear', 'scared', 'anxious', 'darr', 'ghabrat', 'tension'],
    hopeful: ['hope', 'wish', 'positive', 'good', 'better', 'dream', 'want', 'ishq', 'pyar', 'believe'],
    confused: ['confused', 'lost', 'direction', "don't know", 'what should', 'samajh', 'kya', 'paresh', ' unclear'],
    heartbroken: ['hurt', 'pain', 'broken', 'miss', 'sad', 'grief', 'breakup', 'dard', 'heartbreak'],
    stuck: ['stuck', 'blocked', "can't", 'repetitive', 'going in circles', 'atka', 'jad'],
    determined: ['will', 'determined', 'must', 'need to', 'try', 'fight', 'strong', 'karke dekho'],
  };

  for (const [tone, keywords] of Object.entries(emotionMap)) {
    for (const keyword of keywords) {
      if (lowerQ.includes(keyword)) {
        emotionalTone = tone as DomainAnalysis['emotionalTone'];
        break;
      }
    }
  }

  // Extract meaningful keywords from question
  const keywords = Object.keys(domainScores);

  return {
    primaryDomain,
    secondaryDomain,
    emotionalTone,
    keywords,
  };
}

// ========== REPETITION CONTROL ==========

export interface CardSelectionRecord {
  cardId: string;
  timestamp: number;
  position: string;
}

export interface UserReadingHistory {
  sessionId: string;
  readings: CardSelectionRecord[];
  lastReadingTime: number;
}

// In-memory history storage (would be persistent in real app)
const userHistoryMap = new Map<string, UserReadingHistory>();

export function getUserHistory(userId?: string, sessionId?: string): UserReadingHistory {
  const id = userId || sessionId || 'anonymous';
  if (!userHistoryMap.has(id)) {
    userHistoryMap.set(id, {
      sessionId: id,
      readings: [],
      lastReadingTime: 0,
    });
  }
  return userHistoryMap.get(id)!;
}

export function recordReadingSelection(
  userId?: string,
  sessionId?: string,
  selectedCards?: CardSelectionRecord[]
) {
  const history = getUserHistory(userId, sessionId);
  if (selectedCards) {
    history.readings.push(...selectedCards);
  }
  history.lastReadingTime = Date.now();
}

export function getCardRepetitionPenalty(
  cardId: string,
  userId?: string,
  sessionId?: string,
  maxHistory: number = 5
): number {
  const history = getUserHistory(userId, sessionId);
  const recentReadings = history.readings.slice(-maxHistory);
  const appearances = recentReadings.filter(r => r.cardId === cardId).length;

  if (appearances === 0) return 1.0;
  if (appearances === 1) return 0.7;
  if (appearances === 2) return 0.4;
  return 0.1; // Heavy penalty for 3+ recent appearances
}

export function isExactComboUsed(
  cardIds: string[],
  userId?: string,
  sessionId?: string
): boolean {
  const history = getUserHistory(userId, sessionId);
  const recent = history.readings.slice(-10); // Check last 10 readings

  // Check if this exact combination appeared recently
  for (let i = 0; i < recent.length; i += 3) {
    const combo = recent.slice(i, i + 3).map(r => r.cardId).sort();
    const current = [...cardIds].sort();
    if (JSON.stringify(combo) === JSON.stringify(current)) {
      return true;
    }
  }
  return false;
}

// ========== CARD SELECTION ENGINE ==========

interface CardScore {
  card: TarotCard;
  baseScore: number;
  domainBonus: number;
  emotionBonus: number;
  repetitionPenalty: number;
  finalScore: number;
}

export function scoreCards(
  allCards: TarotCard[],
  domainAnalysis: DomainAnalysis,
  userId?: string,
  sessionId?: string
): CardScore[] {
  const domainPriority = DOMAIN_SUIT_PRIORITY[domainAnalysis.primaryDomain] || DOMAIN_SUIT_PRIORITY.general;
  const secondaryDomain = domainAnalysis.secondaryDomain;
  const secondaryPriority = secondaryDomain ? DOMAIN_SUIT_PRIORITY[secondaryDomain] : [];

  return allCards.map(card => {
    let baseScore = 1.0;
    let domainBonus = 0;
    let emotionBonus = 0;

    // Suit match bonus
    if (card.suit && domainPriority.includes(card.suit)) {
      domainBonus += 1.5; // Primary suit gets big boost
    }
    if (card.suit && secondaryPriority && secondaryPriority.includes(card.suit)) {
      domainBonus += 0.8; // Secondary suit gets moderate boost
    }
    if (card.type === 'major') {
      domainBonus += 0.5; // Major arcana always relevant
    }

    // Emotion match bonus
    if (card.emotions.includes(domainAnalysis.emotionalTone)) {
      emotionBonus += 1.0;
    }

    baseScore += domainBonus + emotionBonus;

    // Repetition penalty
    const repetitionFactor = getCardRepetitionPenalty(cardIdFromCard(card), userId, sessionId);

    const finalScore = baseScore * repetitionFactor;

    return {
      card,
      baseScore,
      domainBonus,
      emotionBonus,
      repetitionPenalty: repetitionFactor,
      finalScore,
    };
  });
}

function cardIdFromCard(card: TarotCard): string {
  return card.id;
}

// Weighted random selection from scored cards
export function selectCardsWeighted(
  scoredCards: CardScore[],
  count: number,
  seededRandom: () => number
): SelectedCard[] {
  const positions = ['Past', 'Present', 'Future'];
  const selected: SelectedCard[] = [];
  const usedIndices = new Set<number>();

  for (let posIdx = 0; posIdx < count; posIdx++) {
    const available = scoredCards
      .map((sc, idx) => ({ ...sc, idx }))
      .filter(item => !usedIndices.has(item.idx));

    if (available.length === 0) break;

    const totalWeight = available.reduce((sum, item) => sum + item.finalScore, 0);
    let random = seededRandom() * totalWeight;

    let chosenIdx = available[0].idx;
    for (const item of available) {
      random -= item.finalScore;
      if (random <= 0) {
        chosenIdx = item.idx;
        break;
      }
    }

    usedIndices.add(chosenIdx);
    const chosen = scoredCards[chosenIdx];

    selected.push({
      card: chosen.card,
      position: positions[posIdx] || `Position ${posIdx + 1}`,
      isReversed: seededRandom() < 0.2, // 20% reversed
      weight: chosen.finalScore,
    });
  }

  return selected;
}

// Main entry: Generate card set for selection
export function generateCardSet(input: {
  question: string;
  readingType: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  count?: number;
}): { cards: TarotCard[]; analysis: DomainAnalysis } {
  const { question, readingType, timestamp, userId, sessionId, count = 9 } = input;

  // 1. Seed RNG (same question-minute = similar patterns)
  const seed = createSeed({
    question,
    readingType,
    timestamp,
    userId,
    sessionId,
  });
  const rng = createSeededRNG(seed);

  // 2. Analyze intent
  const analysis = analyzeIntent(question, readingType);

  // 3. Get all cards and score them
  const allCards = getAllCards();
  const scoredCards = scoreCards(allCards, analysis, userId, sessionId);

  // 4. Sort by final score descending
  scoredCards.sort((a, b) => b.finalScore - a.finalScore);

  // 5. Take top candidates (top 20 cards)
  const topCandidates = scoredCards.slice(0, 20);

  // 6. Weighted random selection from top candidates
  const selectedObjects = selectCardsWeighted(topCandidates, count, rng);

  // Return just the card objects (not the full SelectedCard which has position)
  return {
    cards: selectedObjects.map(sc => sc.card),
    analysis,
  };
}

// Final card selection after user picks
export function finalizeReadingCards(
  userPickedIds: string[],
  availableCards: TarotCard[],
  domainAnalysis: DomainAnalysis,
  userId?: string,
  sessionId?: string
): SelectedCard[] {
  const positions = ['Past', 'Present', 'Future'];

  const pickedCards = availableCards
    .filter(c => userPickedIds.includes(c.id))
    .slice(0, 3);

  // Use seeded RNG for reversal (tied to question)
  const seed = createSeed({
    question: JSON.stringify(userPickedIds),
    readingType: domainAnalysis.primaryDomain,
    timestamp: Date.now(),
    userId,
    sessionId,
  });
  const rng = createSeededRNG(seed);

  return pickedCards.map((card, idx) => ({
    card,
    position: positions[idx] || `Position ${idx + 1}`,
    isReversed: rng() < 0.2,
    weight: 1,
  }));
}

// ========== CARD MEANING INTEGRATION ==========

export function getCardInterpretation(
  card: TarotCard,
  position: string,
  domain: IntentDomain,
  emotion: string
): string {
  const upright = card.upright;
  const reversed = card.reversed;
  const positionLabel = position.toLowerCase();

  const baseMeaning = card.type === 'major'
    ? `**${card.name}** — Major Arcana card representing ${card.keywords[0] || ' archetypal energy'}`
    : `**${card.name}** (${card.suit}) — ${card.keywords[0] || 'a minor arcana influence'}`;

  const positionContext = position === 'Past'
    ? 'Ye past ka signal hai jo aaj tak tumhare life ka asar kar raha hai.'
    : position === 'Present'
    ? 'Ye abhi tumhare life mein active energy hai.'
    : 'Ye aane wale future mein kya laane wala hai, woh dikha raha hai.';

  const domainFlavor = getDomainFlavor(domain, card, position);

  return `${baseMeaning}\n\n${domainFlavor}\n\n${positionContext}`;
}

function getDomainFlavor(domain: IntentDomain, card: TarotCard, position: string): string {
  const cardName = card.name.toLowerCase();

  // Love domain specific interpretations
  if (domain === 'love') {
    if (cardName.includes('cups') || cardName.includes('lovers') || cardName.includes('empress')) {
      return `Yeh card tumhare love life mein emotional energy dikha raha hai. Tumhara dil connected hai, par clarity abhi missing hai.`;
    }
    if (cardName.includes('swords')) {
      return `Yeh card relationship mein mental conflict ya communication breakdown dikha raha hai.`;
    }
  }

  // Career domain
  if (domain === 'career') {
    if (cardName.includes('wands')) {
      return `Yeh card professional growth aur action-oriented energy dikha raha hai.`;
    }
    if (cardName.includes('pentacles')) {
      return `Yeh card material stability aur career foundation se related hai.`;
    }
  }

  // Finance domain
  if (domain === 'finance') {
    if (cardName.includes('pentacles')) {
      return `Yeh card financial situation直接 related hai. Stability ya opportunity dono se relevant hai.`;
    }
  }

  // Conflict domain
  if (domain === 'conflict') {
    if (cardName.includes('swords')) {
      return `Yeh card mental tension ya argument se related hai. Koi batt fighting chal rahi hai.`;
    }
  }

  // Generic fallback
  return `Yeh card **${card.keywords.join(', ')}** jaise energies lae raha hai tumhare situation mein.`;
}

// ========== UTILITY: Build card signature for repetition detection ==========

export function buildCardSignature(cards: string[]): string {
  return [...cards].sort().join('|');
}
