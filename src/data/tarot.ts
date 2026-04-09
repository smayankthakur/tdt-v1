export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles' | 'major';
export type Theme = 'love' | 'career' | 'money' | 'growth' | 'confusion' | 'decision' | 'general';
export type Emotion = 'anxious' | 'hopeful' | 'confused' | 'heartbroken' | 'ambitious' | 'stuck' | 'neutral';

export interface TarotCard {
  id: string;
  name: string;
  meaning: string;
  reversed: string;
  type: 'major' | 'minor';
  suit?: Suit;
  theme: Theme[];
  emotion: Emotion[];
}

export const tarotCards: TarotCard[] = [
  { id: 'fool', name: 'The Fool', meaning: 'New beginnings, innocence, spontaneity, free spirit', reversed: 'Recklessness, risk-taking, lack of direction', type: 'major', theme: ['growth', 'general'], emotion: ['hopeful', 'neutral'] },
  { id: 'magician', name: 'The Magician', meaning: 'Manifestation, power, skill, resourcefulness', reversed: 'Manipulation, deception, untapped potential', type: 'major', theme: ['career', 'growth'], emotion: ['ambitious', 'hopeful'] },
  { id: 'high_priestess', name: 'The High Priestess', meaning: 'Intuition, mystery, inner voice, secrets', reversed: 'Hidden agendas, surface-level understanding', type: 'major', theme: ['confusion', 'general'], emotion: ['confused', 'neutral'] },
  { id: 'empress', name: 'The Empress', meaning: 'Nurturing, abundance, fertility, creativity', reversed: 'Dependency, over-giving, emptiness', type: 'major', theme: ['love', 'growth'], emotion: ['hopeful', 'neutral'] },
  { id: 'emperor', name: 'The Emperor', meaning: 'Authority, structure, stability, leadership', reversed: 'Tyranny, rigidity, lack of discipline', type: 'major', theme: ['career', 'money'], emotion: ['ambitious', 'stuck'] },
  { id: 'hierophant', name: 'The Hierophant', meaning: 'Tradition, guidance, belief systems', reversed: 'Rebellion, non-conformity, new approaches', type: 'major', theme: ['general', 'career'], emotion: ['stuck', 'neutral'] },
  { id: 'lovers', name: 'The Lovers', meaning: 'Love, harmony, relationships, choices', reversed: 'Disharmony, imbalance, misalignment', type: 'major', theme: ['love', 'decision'], emotion: ['hopeful', 'confused'] },
  { id: 'chariot', name: 'The Chariot', meaning: 'Willpower, victory, determination, control', reversed: 'Aggression, lack of direction, stagnation', type: 'major', theme: ['career', 'decision'], emotion: ['ambitious', 'anxious'] },
  { id: 'strength', name: 'Strength', meaning: 'Courage, patience, inner strength, compassion', reversed: 'Weakness, self-doubt, aggression', type: 'major', theme: ['growth', 'general'], emotion: ['stuck', 'heartbroken'] },
  { id: 'hermit', name: 'The Hermit', meaning: 'Inner guidance, solitude, introspection', reversed: 'Isolation, loneliness, withdrawal', type: 'major', theme: ['growth', 'confusion'], emotion: ['confused', 'stuck'] },
  { id: 'wheel', name: 'Wheel of Fortune', meaning: 'Change, cycles, fate, destiny', reversed: 'Resistance to change, bad luck, stagnation', type: 'major', theme: ['general', 'decision'], emotion: ['anxious', 'hopeful'] },
  { id: 'justice', name: 'Justice', meaning: 'Balance, truth, fairness, law', reversed: 'Unfairness, dishonesty, lack of accountability', type: 'major', theme: ['decision', 'general'], emotion: ['confused', 'neutral'] },
  { id: 'hanged_man', name: 'The Hanged Man', meaning: 'Surrender, release, new perspective', reversed: 'Stuck, resistance, holding on', type: 'major', theme: ['confusion', 'growth'], emotion: ['stuck', 'confused'] },
  { id: 'death', name: 'Death', meaning: 'Transformation, endings, rebirth', reversed: 'Resistance to change, stagnation', type: 'major', theme: ['growth', 'general'], emotion: ['anxious', 'hopeful'] },
  { id: 'temperance', name: 'Temperance', meaning: 'Balance, moderation, harmony', reversed: 'Imbalance, excess, lack of patience', type: 'major', theme: ['general', 'love'], emotion: ['stuck', 'neutral'] },
  { id: 'devil', name: 'The Devil', meaning: 'Attachment, temptation, limitation', reversed: 'Liberation, release, overcoming addiction', type: 'major', theme: ['love', 'confusion'], emotion: ['heartbroken', 'stuck'] },
  { id: 'tower', name: 'The Tower', meaning: 'Sudden change, disruption, awakening', reversed: 'Avoiding disaster, fear of change', type: 'major', theme: ['growth', 'general'], emotion: ['anxious', 'heartbroken'] },
  { id: 'star', name: 'The Star', meaning: 'Hope, healing, renewal', reversed: 'Despair, loss of faith, disappointment', type: 'major', theme: ['growth', 'general'], emotion: ['hopeful', 'heartbroken'] },
  { id: 'moon', name: 'The Moon', meaning: 'Illusion, confusion, subconscious', reversed: 'Release of fear, truth revealed', type: 'major', theme: ['confusion', 'general'], emotion: ['confused', 'anxious'] },
  { id: 'sun', name: 'The Sun', meaning: 'Success, clarity, positivity', reversed: 'Temporary setback, sadness, lack of clarity', type: 'major', theme: ['general', 'career'], emotion: ['hopeful', 'ambitious'] },
  { id: 'judgement', name: 'Judgement', meaning: 'Awakening, realization, decision', reversed: 'Self-doubt, ignoring the call', type: 'major', theme: ['decision', 'general'], emotion: ['anxious', 'confused'] },
  { id: 'world', name: 'The World', meaning: 'Completion, fulfillment, closure', reversed: 'Incompletion, delay, emptiness', type: 'major', theme: ['general', 'growth'], emotion: ['hopeful', 'neutral'] },
  { id: 'ace_wands', name: 'Ace of Wands', meaning: 'New action, inspiration, growth', reversed: 'Delays, lack of direction', type: 'minor', suit: 'wands', theme: ['career', 'growth'], emotion: ['ambitious', 'hopeful'] },
  { id: 'two_wands', name: 'Two of Wands', meaning: 'Planning, future vision, decisions', reversed: 'Fear of unknown, poor planning', type: 'minor', suit: 'wands', theme: ['career', 'decision'], emotion: ['anxious', 'confused'] },
  { id: 'three_wands', name: 'Three of Wands', meaning: 'Expansion, progress, foresight', reversed: 'Obstacles, delays, frustration', type: 'minor', suit: 'wands', theme: ['career', 'growth'], emotion: ['ambitious', 'hopeful'] },
  { id: 'four_wands', name: 'Four of Wands', meaning: 'Celebration, harmony, stability', reversed: 'Unstable situation, conflict', type: 'minor', suit: 'wands', theme: ['love', 'general'], emotion: ['hopeful', 'neutral'] },
  { id: 'five_wands', name: 'Five of Wands', meaning: 'Conflict, competition, tension', reversed: 'Avoiding conflict, compromise', type: 'minor', suit: 'wands', theme: ['career', 'decision'], emotion: ['anxious', 'stuck'] },
  { id: 'six_wands', name: 'Six of Wands', meaning: 'Victory, recognition, success', reversed: 'Ego, lack of recognition, failure', type: 'minor', suit: 'wands', theme: ['career', 'general'], emotion: ['ambitious', 'hopeful'] },
  { id: 'seven_wands', name: 'Seven of Wands', meaning: 'Defense, challenge, perseverance', reversed: 'Exhaustion, giving up', type: 'minor', suit: 'wands', theme: ['career', 'growth'], emotion: ['ambitious', 'anxious'] },
  { id: 'eight_wands', name: 'Eight of Wands', meaning: 'Fast movement, rapid progress', reversed: 'Delays, frustration, waiting', type: 'minor', suit: 'wands', theme: ['career', 'general'], emotion: ['ambitious', 'anxious'] },
  { id: 'nine_wands', name: 'Nine of Wands', meaning: 'Resilience, persistence, near completion', reversed: 'Paranoia, exhaustion, giving up', type: 'minor', suit: 'wands', theme: ['career', 'growth'], emotion: ['stuck', 'anxious'] },
  { id: 'ten_wands', name: 'Ten of Wands', meaning: 'Burden, responsibility, heavy load', reversed: 'Inability to delegate, burnout', type: 'minor', suit: 'wands', theme: ['career', 'general'], emotion: ['stuck', 'anxious'] },
  { id: 'page_wands', name: 'Page of Wands', meaning: 'Curiosity, new opportunities, exploration', reversed: 'Lack of direction, procrastination', type: 'minor', suit: 'wands', theme: ['growth', 'general'], emotion: ['hopeful', 'confused'] },
  { id: 'knight_wands', name: 'Knight of Wands', meaning: 'Adventurous, energetic, passionate', reversed: 'Impatience, recklessness, lack of focus', type: 'minor', suit: 'wands', theme: ['career', 'growth'], emotion: ['ambitious', 'anxious'] },
  { id: 'queen_wands', name: 'Queen of Wands', meaning: 'Confidence, determination, warmth', reversed: 'Jealousy, insecurity, manipulation', type: 'minor', suit: 'wands', theme: ['love', 'career'], emotion: ['ambitious', 'hopeful'] },
  { id: 'king_wands', name: 'King of Wands', meaning: 'Leader, visionary, entrepreneur', reversed: 'Domineering, impatient, harsh', type: 'minor', suit: 'wands', theme: ['career', 'general'], emotion: ['ambitious', 'neutral'] },
  { id: 'ace_cups', name: 'Ace of Cups', meaning: 'New feelings, love, emotional openness', reversed: 'Emotional block, emptiness', type: 'minor', suit: 'cups', theme: ['love', 'general'], emotion: ['hopeful', 'heartbroken'] },
  { id: 'two_cups', name: 'Two of Cups', meaning: 'Partnership, connection, mutual attraction', reversed: 'Imbalance, broken relationship', type: 'minor', suit: 'cups', theme: ['love', 'general'], emotion: ['hopeful', 'heartbroken'] },
  { id: 'three_cups', name: 'Three of Cups', meaning: 'Celebration, friendship, joy', reversed: 'Over-indulgence, loneliness', type: 'minor', suit: 'cups', theme: ['love', 'general'], emotion: ['hopeful', 'neutral'] },
  { id: 'four_cups', name: 'Four of Cups', meaning: 'Contemplation, apathy, reevaluation', reversed: 'New perspective, awakening', type: 'minor', suit: 'cups', theme: ['love', 'confusion'], emotion: ['confused', 'stuck'] },
  { id: 'five_cups', name: 'Five of Cups', meaning: 'Loss, grief, disappointment', reversed: 'Acceptance, moving on, healing', type: 'minor', suit: 'cups', theme: ['love', 'general'], emotion: ['heartbroken', 'stuck'] },
  { id: 'six_cups', name: 'Six of Cups', meaning: 'Nostalgia, past relationships, innocence', reversed: 'Living in the past, unrealistic', type: 'minor', suit: 'cups', theme: ['love', 'general'], emotion: ['hopeful', 'confused'] },
  { id: 'seven_cups', name: 'Seven of Cups', meaning: 'Illusion, fantasy, wishful thinking', reversed: 'Clarity, making choices', type: 'minor', suit: 'cups', theme: ['love', 'confusion'], emotion: ['hopeful', 'confused'] },
  { id: 'eight_cups', name: 'Eight of Cups', meaning: 'Walking away, seeking deeper meaning', reversed: 'Avoidance, fear of change', type: 'minor', suit: 'cups', theme: ['love', 'growth'], emotion: ['heartbroken', 'stuck'] },
  { id: 'nine_cups', name: 'Nine of Cups', meaning: 'Satisfaction, emotional fulfillment', reversed: 'Dissatisfaction, materialism', type: 'minor', suit: 'cups', theme: ['love', 'general'], emotion: ['hopeful', 'neutral'] },
  { id: 'ten_cups', name: 'Ten of Cups', meaning: 'Harmony, family, emotional fulfillment', reversed: 'Disharmony, family conflicts', type: 'minor', suit: 'cups', theme: ['love', 'general'], emotion: ['hopeful', 'stuck'] },
  { id: 'page_cups', name: 'Page of Cups', meaning: 'Emotional message, new feelings', reversed: 'Emotional immaturity, confusion', type: 'minor', suit: 'cups', theme: ['love', 'general'], emotion: ['hopeful', 'confused'] },
  { id: 'knight_cups', name: 'Knight of Cups', meaning: 'Romantic, idealist, following heart', reversed: 'Unrealistic, jealous, moody', type: 'minor', suit: 'cups', theme: ['love', 'general'], emotion: ['hopeful', 'anxious'] },
  { id: 'queen_cups', name: 'Queen of Cups', meaning: 'Compassionate, intuitive, emotional', reversed: 'Insecurity, emotional manipulation', type: 'minor', suit: 'cups', theme: ['love', 'general'], emotion: ['hopeful', 'heartbroken'] },
  { id: 'king_cups', name: 'King of Cups', meaning: 'Emotional balance, diplomacy', reversed: 'Emotional instability, repression', type: 'minor', suit: 'cups', theme: ['love', 'career'], emotion: ['neutral', 'ambitious'] },
  { id: 'ace_swords', name: 'Ace of Swords', meaning: 'Clarity, truth, new ideas', reversed: 'Confusion, brutality, chaos', type: 'minor', suit: 'swords', theme: ['decision', 'general'], emotion: ['confused', 'ambitious'] },
  { id: 'two_swords', name: 'Two of Swords', meaning: 'Indecision, difficult choice, stalemate', reversed: 'Information revealed, decision made', type: 'minor', suit: 'swords', theme: ['decision', 'confusion'], emotion: ['confused', 'anxious'] },
  { id: 'three_swords', name: 'Three of Swords', meaning: 'Heartbreak, grief, sorrow', reversed: 'Healing, forgiveness, moving on', type: 'minor', suit: 'swords', theme: ['love', 'general'], emotion: ['heartbroken', 'anxious'] },
  { id: 'four_swords', name: 'Four of Swords', meaning: 'Rest, recovery, contemplation', reversed: 'Restlessness, burnout', type: 'minor', suit: 'swords', theme: ['growth', 'general'], emotion: ['stuck', 'neutral'] },
  { id: 'five_swords', name: 'Five of Swords', meaning: 'Conflict, tension, winning at cost', reversed: 'Forgiveness, moving on', type: 'minor', suit: 'swords', theme: ['career', 'decision'], emotion: ['anxious', 'stuck'] },
  { id: 'six_swords', name: 'Six of Swords', meaning: 'Transition, moving forward, relief', reversed: 'Stuck, resisting change', type: 'minor', suit: 'swords', theme: ['growth', 'general'], emotion: ['hopeful', 'anxious'] },
  { id: 'seven_swords', name: 'Seven of Swords', meaning: 'Deception, strategy, stealth', reversed: 'Confession, admitting mistakes', type: 'minor', suit: 'swords', theme: ['confusion', 'decision'], emotion: ['confused', 'anxious'] },
  { id: 'eight_swords', name: 'Eight of Swords', meaning: 'Restriction, trapped, victim mentality', reversed: 'Breaking free, self-liberation', type: 'minor', suit: 'swords', theme: ['confusion', 'general'], emotion: ['stuck', 'confused'] },
  { id: 'nine_swords', name: 'Nine of Swords', meaning: 'Anxiety, worry, nightmares', reversed: 'Hope, facing fears', type: 'minor', suit: 'swords', theme: ['confusion', 'general'], emotion: ['anxious', 'heartbroken'] },
  { id: 'ten_swords', name: 'Ten of Swords', meaning: 'Betrayal, endings, rock bottom', reversed: 'Recovery, healing, rebirth', type: 'minor', suit: 'swords', theme: ['general', 'growth'], emotion: ['heartbroken', 'stuck'] },
  { id: 'page_swords', name: 'Page of Swords', meaning: 'Curiosity, mental energy, new ideas', reversed: 'Scattered, immature, deceptive', type: 'minor', suit: 'swords', theme: ['growth', 'general'], emotion: ['confused', 'ambitious'] },
  { id: 'knight_swords', name: 'Knight of Swords', meaning: 'Action-oriented, ambitious, direct', reversed: 'Aggressive, impatient, tactless', type: 'minor', suit: 'swords', theme: ['career', 'decision'], emotion: ['ambitious', 'anxious'] },
  { id: 'queen_swords', name: 'Queen of Swords', meaning: 'Clear thinking, truth, independence', reversed: 'Cold, manipulative, bitter', type: 'minor', suit: 'swords', theme: ['decision', 'general'], emotion: ['neutral', 'ambitious'] },
  { id: 'king_swords', name: 'King of Swords', meaning: 'Authority, truth, intellectual power', reversed: 'Intimidating, ruthless, unfair', type: 'minor', suit: 'swords', theme: ['career', 'decision'], emotion: ['ambitious', 'neutral'] },
  { id: 'ace_pentacles', name: 'Ace of Pentacles', meaning: 'New opportunity, manifestation', reversed: 'Missed opportunity, bad timing', type: 'minor', suit: 'pentacles', theme: ['money', 'career'], emotion: ['hopeful', 'ambitious'] },
  { id: 'two_pentacles', name: 'Two of Pentacles', meaning: 'Balance, prioritization, adaptability', reversed: 'Imbalance, overwhelmed, disorganized', type: 'minor', suit: 'pentacles', theme: ['money', 'career'], emotion: ['anxious', 'stuck'] },
  { id: 'three_pentacles', name: 'Three of Pentacles', meaning: 'Teamwork, skill development, craftsmanship', reversed: 'Lack of teamwork, poor craftsmanship', type: 'minor', suit: 'pentacles', theme: ['career', 'growth'], emotion: ['ambitious', 'neutral'] },
  { id: 'four_pentacles', name: 'Four of Pentacles', meaning: 'Control, security, holding onto wealth', reversed: 'Greed, generosity, releasing control', type: 'minor', suit: 'pentacles', theme: ['money', 'general'], emotion: ['stuck', 'anxious'] },
  { id: 'five_pentacles', name: 'Five of Pentacles', meaning: 'Hardship, financial struggle, exclusion', reversed: 'Recovery, healing, hope', type: 'minor', suit: 'pentacles', theme: ['money', 'general'], emotion: ['stuck', 'heartbroken'] },
  { id: 'six_pentacles', name: 'Six of Pentacles', meaning: 'Giving, receiving, generosity', reversed: 'Selfishness, debt, inequality', type: 'minor', suit: 'pentacles', theme: ['money', 'love'], emotion: ['hopeful', 'neutral'] },
  { id: 'seven_pentacles', name: 'Seven of Pentacles', meaning: 'Patience, investment, long-term growth', reversed: 'Impatience, lack of progress', type: 'minor', suit: 'pentacles', theme: ['money', 'career'], emotion: ['stuck', 'hopeful'] },
  { id: 'eight_pentacles', name: 'Eight of Pentacles', meaning: 'Skill, effort, apprenticeship', reversed: 'Lack of focus, wasted talent', type: 'minor', suit: 'pentacles', theme: ['career', 'growth'], emotion: ['ambitious', 'hopeful'] },
  { id: 'nine_pentacles', name: 'Nine of Pentacles', meaning: 'Independence, luxury, accomplishment', reversed: 'Financial loss, dependence', type: 'minor', suit: 'pentacles', theme: ['money', 'general'], emotion: ['hopeful', 'neutral'] },
  { id: 'ten_pentacles', name: 'Ten of Pentacles', meaning: 'Wealth, family, legacy', reversed: 'Financial loss, family conflict', type: 'minor', suit: 'pentacles', theme: ['money', 'general'], emotion: ['hopeful', 'stuck'] },
  { id: 'page_pentacles', name: 'Page of Pentacles', meaning: 'Learning, new opportunity, manifestation', reversed: 'Lack of focus, materialistic', type: 'minor', suit: 'pentacles', theme: ['career', 'money'], emotion: ['hopeful', 'ambitious'] },
  { id: 'knight_pentacles', name: 'Knight of Pentacles', meaning: 'Consistency, responsibility, hard work', reversed: 'Laziness, unreliability', type: 'minor', suit: 'pentacles', theme: ['career', 'money'], emotion: ['ambitious', 'stuck'] },
  { id: 'queen_pentacles', name: 'Queen of Pentacles', meaning: 'Stability, nurturing, practicality', reversed: 'Insecurity, neglect, workaholic', type: 'minor', suit: 'pentacles', theme: ['love', 'money'], emotion: ['neutral', 'hopeful'] },
  { id: 'king_pentacles', name: 'King of Pentacles', meaning: 'Success, wealth, business wisdom', reversed: 'Greed, materialism, recklessness', type: 'minor', suit: 'pentacles', theme: ['career', 'money'], emotion: ['ambitious', 'hopeful'] },
];

const themeKeywords: Record<Theme, string[]> = {
  love: ['love', 'relationship', 'partner', 'heart', 'romance', 'marriage', 'crush', 'attraction', 'lonely', ' breakup', 'ex', 'dating', 'soulmate', 'connection'],
  career: ['work', 'job', 'career', 'boss', 'promotion', 'interview', 'business', 'project', 'professional', 'ambition', 'success', 'office'],
  money: ['money', 'financial', 'wealth', 'income', 'investment', 'rich', 'poor', 'financial', 'budget', 'salary', 'expense', 'debt'],
  growth: ['personal', 'growth', 'spiritual', 'self', 'future', 'life', 'purpose', 'meaning', 'change', 'transformation', 'healing'],
  confusion: ['confused', 'lost', 'don\'t know', 'uncertain', 'unclear', 'what should', 'advice', 'help me', 'should i'],
  decision: ['should i', 'choice', 'decide', 'option', 'path', 'which', 'choose', 'alternative', 'commitment'],
  general: []
};

const emotionKeywords: Record<Emotion, string[]> = {
  anxious: ['worried', 'scared', 'afraid', 'nervous', 'stress', 'anxious', 'fear', 'panic', 'overthinking', 'dread'],
  hopeful: ['hope', 'wish', 'dream', 'positive', 'better', 'future', 'excited', 'optimistic', 'manifest'],
  confused: ['confused', 'lost', 'don\'t understand', 'uncertain', 'unclear', 'mixed', 'conflicting'],
  heartbroken: ['hurt', 'pain', 'sad', 'grief', 'loss', 'heartbreak', 'broken', 'depressed', 'crying', 'tears'],
  ambitious: ['want', 'desire', 'goal', 'achieve', 'success', 'career', 'advance', 'grow', 'build'],
  stuck: ['stuck', 'can\'t', 'no progress', 'end', 'feel', 'trying', 'effort', 'change'],
  neutral: []
};

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

export function analyzeQuestion(question: string): { theme: Theme; emotion: Emotion; urgency: 'low' | 'medium' | 'high'; hiddenInsight: string } {
  const lowerQ = question.toLowerCase();
  
  let theme: Theme = 'general';
  let maxThemeCount = 0;
  for (const [t, keywords] of Object.entries(themeKeywords)) {
    const count = keywords.filter(k => lowerQ.includes(k)).length;
    if (count > maxThemeCount) {
      maxThemeCount = count;
      theme = t as Theme;
    }
  }

  let emotion: Emotion = 'neutral';
  let maxEmotionCount = 0;
  for (const [e, keywords] of Object.entries(emotionKeywords)) {
    const count = keywords.filter(k => lowerQ.includes(k)).length;
    if (count > maxEmotionCount) {
      maxEmotionCount = count;
      emotion = e as Emotion;
    }
  }

  const urgency: 'low' | 'medium' | 'high' = 
    lowerQ.includes('urgent') || lowerQ.includes('asap') || lowerQ.includes('immediately') ? 'high' :
    lowerQ.includes('soon') || lowerQ.includes('when') ? 'medium' : 'low';

  let hiddenInsight = '';
  if (theme === 'love' && emotion === 'confused') hiddenInsight = 'There may be a choice to make about a relationship that you\'ve been avoiding';
  else if (theme === 'career' && emotion === 'anxious') hiddenInsight = 'You feel your professional path is uncertain, but you have more control than you realize';
  else if (theme === 'decision' && emotion === 'stuck') hiddenInsight = 'You already know the answer deep down, but fear is holding you back';
  else if (emotion === 'heartbroken') hiddenInsight = 'There\'s a pain you haven\'t fully processed yet—it\'s time to honor your feelings';
  else if (theme === 'growth' && emotion === 'hopeful') hiddenInsight = 'You\'re on the verge of a meaningful transformation';
  else hiddenInsight = 'The universe is guiding you toward clarity';

  return { theme, emotion, urgency, hiddenInsight };
}

function getSuitForEmotion(emotion: Emotion): Suit {
  switch (emotion) {
    case 'anxious': case 'confused': return 'swords';
    case 'heartbroken': case 'hopeful': return 'cups';
    case 'ambitious': return 'wands';
    case 'stuck': return 'pentacles';
    default: return 'major';
  }
}

export interface SelectedCard {
  card: TarotCard;
  position: string;
  isReversed: boolean;
  reason: string;
}

export function selectCards(question: string, count: number = 3, previousCards?: string[]): SelectedCard[] {
  const analysis = analyzeQuestion(question);
  const seed = hashCode(question + Date.now().toString().slice(0, 8));
  
  const urgencyReversalChance = analysis.urgency === 'high' ? 0.5 : analysis.urgency === 'medium' ? 0.35 : 0.25;
  const emotionReversalChance = analysis.emotion === 'confused' ? 0.45 : analysis.emotion === 'stuck' ? 0.35 : 0.25;
  const reversalChance = Math.max(urgencyReversalChance, emotionReversalChance);

  const prioritySuits: Suit[] = [getSuitForEmotion(analysis.emotion)];
  if (analysis.theme === 'love') prioritySuits.push('cups');
  else if (analysis.theme === 'career' || analysis.theme === 'money') prioritySuits.push('pentacles', 'wands');
  else if (analysis.theme === 'growth') prioritySuits.push('major');

  const positions = count === 3 ? ['Past / What Brought You Here', 'Present / Current Energy', 'Future / Direction Ahead'] :
                    count === 5 ? ['Past', 'Present', 'Obstacle', 'Guidance', 'Outcome'] :
                    ['Current Focus'];

  const selected: SelectedCard[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < count; i++) {
    const positionRole = i === 0 ? 'challenge' : i === count - 1 ? 'outcome' : 'guidance';
    let pool = tarotCards.filter(c => !usedIds.has(c.id));
    
    pool = pool.filter(c => {
      const themeMatch = c.theme.includes(analysis.theme) || c.theme.includes('general');
      const emotionMatch = c.emotion.includes(analysis.emotion) || c.emotion.includes('neutral');
      return themeMatch && emotionMatch;
    });

    if (pool.length < 3) {
      pool = tarotCards.filter(c => !usedIds.has(c.id));
    }

    if (positionRole === 'challenge' && analysis.emotion === 'confused') {
      const challengeCards = pool.filter(c => 
        c.id.includes('moon') || c.id.includes('hanged') || c.id.includes('swords') || c.id.includes('devil')
      );
      if (challengeCards.length > 0) pool = challengeCards;
    }

    const rankedPool = pool.map((card, idx) => {
      let score = 0;
      const suitMatch = prioritySuits.includes(card.suit || 'major');
      if (suitMatch) score += 3;
      if (card.emotion.includes(analysis.emotion)) score += 2;
      if (card.theme.includes(analysis.theme)) score += 2;
      if (card.type === 'major' && analysis.theme !== 'career' && analysis.theme !== 'money') score += 1;
      score += seededRandom(seed + idx + i * 100) * 2;
      return { card, score };
    }).sort((a, b) => b.score - a.score);

    const topCandidates = rankedPool.slice(0, Math.min(5, rankedPool.length));
    const selectedIdx = Math.floor(seededRandom(seed + i * 17 + Date.now()) * topCandidates.length);
    const selectedCard = topCandidates[selectedIdx].card;

    usedIds.add(selectedCard.id);
    
    const isReversed = seededRandom(seed + i * 31) < reversalChance;
    
    let reason = '';
    if (i === 0) {
      reason = `Reflects the ${analysis.theme} energy and ${analysis.emotion} feeling detected in your question`;
    } else if (i === count - 1) {
      reason = `Shows the direction your situation is heading based on current energy`;
    } else {
      reason = `Offers guidance for navigating your current path`;
    }

    selected.push({
      card: selectedCard,
      position: positions[i],
      isReversed,
      reason
    });
  }

  const hasOnlyPositive = selected.every(s => 
    !s.card.reversed && (s.card.meaning.includes('positive') || s.card.meaning.includes('success') || s.card.meaning.includes('fulfillment'))
  );
  
  if (hasOnlyPositive && analysis.emotion !== 'hopeful') {
    const challengeIdx = Math.floor(seededRandom(seed) * selected.length);
    selected[challengeIdx].isReversed = true;
  }

  return selected;
}

export const getRandomCards = (count: number): TarotCard[] => {
  const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const toneTemplates = {
  anxious: [
    "I can feel the weight of what you're carrying right now...",
    "There's a tension here that hasn't been easy to sit with...",
    "Your question alone tells me this has been on your mind more than you let others see..."
  ],
  hopeful: [
    "There's something you're wishing for, aren't you?",
    "I sense a quiet optimism beneath your words...",
    "Your question carries a spark of hope that the universe has noticed..."
  ],
  confused: [
    "The fog you're in is real, and it's okay to not have all the answers right now...",
    "I'm sensing that this situation has been sitting heavily on your mind...",
    "There's a confusion here, but it's not without purpose..."
  ],
  heartbroken: [
    "I can feel the ache in your words...",
    "There's a pain here that deserves to be acknowledged...",
    "What you're carrying—it matters. It really does..."
  ],
  ambitious: [
    "I sense someone who's ready to make things happen...",
    "There's fire in your question, ambition that's been brewing...",
    "You know what you want. The universe is listening..."
  ],
  stuck: [
    "This feeling of being stuck—it's temporary, even if it doesn't feel that way...",
    "There's a frustration here, a sense of trying without movement...",
    "You've been pushing, but something has been holding you back..."
  ],
  neutral: [
    "I'm sensing that this situation has been on your mind...",
    "There's something you're seeking clarity about...",
    "The universe is ready to show you what you need to see..."
  ]
};

const cardNarratives: Record<string, (card: TarotCard, isReversed: boolean, position: string) => string> = {
  'The Lovers': (card, isReversed, position) => {
    if (isReversed) return `Then there's ${card.name}—reversed, suggesting a misalignment. Perhaps you're questioning whether your values truly align with what you want, or there's a part of you that feels torn between two paths.`;
    return `First, ${card.name} appears—a beautiful sign of connection and the choices we face. This card speaks to partnerships, but also to the relationship you have with yourself. There may be a decision to make, or perhaps you're seeking harmony in an important bond.`;
  },
  'The Moon': (card, isReversed, position) => {
    if (isReversed) return `The ${card.name} here, reversed, suggests you're beginning to see through the fog—truth is starting to emerge.`;
    return `The ${card.name} speaks to that intuitive, almost dreamlike space where things aren't always what they seem. You're being asked to trust what you feel, even when it doesn't make logical sense.`;
  },
  'The Tower': (card, isReversed, position) => {
    if (isReversed) return `The ${card.name} reversed suggests you've been bracing for impact that may never come—or perhaps you've already survived what you feared most.`;
    return `The ${card.name} appears—and I know this card can feel frightening, but it's not destruction. It's revelation. Something that seemed stable is being shaken so something more authentic can emerge.`;
  },
  'default': (card, isReversed, position) => {
    if (isReversed) return `Then ${card.name}—reversed—suggests a need to release or reverse something in your situation.`;
    return `The ${card.name} speaks to ${card.meaning.toLowerCase()}. It's appearing here to guide you toward understanding.`;
  }
};

function generateToneOpening(emotion: Emotion): string {
  const templates = toneTemplates[emotion] || toneTemplates.neutral;
  const index = Math.floor(Math.random() * templates.length);
  return templates[index];
}

function generateCardNarrative(cards: SelectedCard[]): string {
  const narratives: string[] = [];
  
  for (const { card, position, isReversed } of cards) {
    const narrativeFn = cardNarratives[card.name] || cardNarratives.default;
    narratives.push(narrativeFn(card, isReversed, position));
  }
  
  return narratives.join(' ');
}

function generateGuidance(cards: SelectedCard[], analysis: { theme: Theme; emotion: Emotion; hiddenInsight: string }): string {
  const guidanceTemplates = {
    love: "In matters of the heart, trust what feels right—not just what looks right on paper.",
    career: "Your ambition is noticed. But remember: success without peace is just another form of exhaustion.",
    money: "Focus on what you can control. The universe provides, but you must be open to receiving.",
    growth: "You're being called to transform. It won't be comfortable, but it will be worth it.",
    confusion: "Stop looking for answers in the same place you lost them. Sometimes the clarity comes from within.",
    decision: "There's no wrong choice—only choices that teach. Trust yourself to navigate whatever you choose.",
    general: "The universe is guiding you. Sometimes the clearest path is the one that feels scariest."
  };

  return guidanceTemplates[analysis.theme] || guidanceTemplates.general;
}

export function generateInterpretation(question: string, cards: SelectedCard[]): string {
  const analysis = analyzeQuestion(question);
  
  const opening = generateToneOpening(analysis.emotion);
  const cardNarrative = generateCardNarrative(cards);
  const guidance = generateGuidance(cards, analysis);
  
  const curiosityGap = [
    "This is just the surface of what I'm seeing...",
    "There's a deeper layer here that needs more time to fully uncover...",
    "Your energy suggests there's more unfolding soon...",
    "There's more beneath this situation that hasn't fully revealed itself yet..."
  ];
  const selectedGap = curiosityGap[Math.floor(Math.random() * curiosityGap.length)];

  return `${opening} ${cardNarrative} ${guidance} ${selectedGap}`;
}
