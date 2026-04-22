import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export interface UserMemory {
  id: string;
  user_id: string;
  key: string;
  value: string;
  updated_at: string;
}

const THEME_KEYWORDS: Record<string, string> = {
  love: 'love',
  relationship: 'love',
  partner: 'love',
  heart: 'love',
  career: 'work',
  job: 'work',
  money: 'money',
  financial: 'money',
  health: 'health',
  family: 'family',
  future: 'future',
  life: 'life',
};

const EMOTION_KEYWORDS: Record<string, string> = {
  confused: 'confused',
  stuck: 'stuck',
  anxious: 'anxious',
  worried: 'anxious',
  sad: 'sad',
  hurt: 'hurt',
  hopeful: 'hopeful',
  excited: 'excited',
};

export function extractThemes(question: string): string[] {
  const lowerQ = question.toLowerCase();
  const themes: string[] = [];
  
  for (const [keyword, theme] of Object.entries(THEME_KEYWORDS)) {
    if (lowerQ.includes(keyword) && !themes.includes(theme)) {
      themes.push(theme);
    }
  }
  
  return themes.length > 0 ? themes : ['general'];
}

export function extractEmotion(question: string): string {
  const lowerQ = question.toLowerCase();
  
  for (const [keyword, emotion] of Object.entries(EMOTION_KEYWORDS)) {
    if (lowerQ.includes(keyword)) {
      return emotion;
    }
  }
  
  return 'neutral';
}

export function generateMemorySummary(
  question: string,
  cards: { card_name: string }[]
): string {
  const themes = extractThemes(question);
  const emotion = extractEmotion(question);
  const cardNames = cards.map(c => c.card_name).join(', ');
  
  return `Theme: ${themes.join(', ')} | Emotion: ${emotion} | Cards: ${cardNames}`;
}

export async function updateUserMemory(
  userId: string,
  question: string,
  response: string,
  cards: { card_name: string }[]
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    console.log('[Memory] Would update for', userId);
    return true;
  }

  try {
    const themes = extractThemes(question);
    const emotion = extractEmotion(question);
    const summary = generateMemorySummary(question, cards);

    const memoryEntries = [
      { key: 'last_question', value: question.slice(0, 500) },
      { key: 'themes', value: themes.join(',') },
      { key: 'emotion', value: emotion },
      { key: 'recent_summary', value: summary },
      { key: 'reading_count', value: 'increment' },
    ];

    for (const entry of memoryEntries) {
      if (entry.key === 'reading_count') {
        const { data: existing } = await supabase
          .from('user_memory')
          .select('value')
          .eq('user_id', userId)
          .eq('key', 'reading_count')
          .single();
        
        const newCount = (parseInt(existing?.value || '0') + 1).toString();
        
        await supabase
          .from('user_memory')
          .upsert({
            user_id: userId,
            key: 'reading_count',
            value: newCount,
          }, { onConflict: 'user_id,key' });
      } else {
        await supabase
          .from('user_memory')
          .upsert({
            user_id: userId,
            key: entry.key,
            value: entry.value,
          }, { onConflict: 'user_id,key' });
      }
    }

    return true;
  } catch (err) {
    console.error('[Memory Update Error]', err);
    return false;
  }
}

export async function getUserMemory(userId: string): Promise<UserMemory[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('user_memory')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[Memory Fetch Error]', err);
    return [];
  }
}

export function buildMemoryContext(memory: UserMemory[]): string {
  if (memory.length === 0) return '';
  
  const themes = memory.find(m => m.key === 'themes')?.value;
  const emotion = memory.find(m => m.key === 'emotion')?.value;
  const lastQuestion = memory.find(m => m.key === 'last_question')?.value;
  const count = memory.find(m => m.key === 'reading_count')?.value;
  
  let context = 'User background: ';
  if (themes) context += `Main interests: ${themes}. `;
  if (emotion && emotion !== 'neutral') context += `Current state: ${emotion}. `;
  if (count && parseInt(count) > 1) context += `Has done ${count} readings. `;
  if (lastQuestion) context += `Last question asked: "${lastQuestion.slice(0, 100)}..."`;
  
  return context;
}