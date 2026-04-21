export type DetectedLanguage = 'hinglish' | 'hi' | 'en';

const HINDI_WORDS_IN_ROMAN = [
  'kya', 'kaise', 'kab', 'kyu', 'kyun', 'mujhe', 'tumhe', 'humhe',
  'hai', 'hain', 'tha', 'thiye', 'ho', 'nahi', 'nahi', 'matlab',
  'kuch', 'sab', 'koi', 'mera', 'tera', 'humara', 'tumhara',
  'apna', 'jao', 'aao', 'dekh', 'suno', 'bolo', 'kaho',
  'raha', 'rahi', 'rahe', 'gaya', 'gayi', 'gayi', 'gia',
  'kar', 'karo', 'kare', 'lena', 'dena', 'jana', 'ana',
  'aur', 'yaa', 'ya', 'lekin', 'magAR', 'paranT', 'to',
  'is', 'us', 'yeh', 'woh', 'ye', 'wo', 'raha', 'hua',
  'sakta', 'sakti', 'sakte', 'paana', 'milna', 'jaana',
  'chahiye', 'chahie', 'zarurat', 'jo', 'to',
  'abhi', 'phir', 'fir', 'tab', 'tabhi', 'kabhi', 'hamesha',
  'kal', 'aaj', 'raat', 'din', 'Morning', 'Evening', 'Night',
  'pyaar', 'pyar', 'ishq', 'dard', 'khushi', 'dhadkan',
  'dil', 'jaan', 'raat', 'raah', 'raaste', 'tariq', 'taareekh',
  'buddhi', 'aqal', 'soch', 'vishwas', 'imaan', 'bhakti',
  'kaam', 'dhandha', 'roz', 'kaam', 'paisa', 'peesha',
];

const HINDI_DEVANAGARI_PATTERN = /[\u0900-\u097F]/;

const ENGLISH_ONLY_PATTERN = /^[a-zA-Z\s\.,!?\'\-]+$/;

export function detectLanguageFromText(text: string): DetectedLanguage {
  if (!text || text.trim().length < 2) {
    return 'en';
  }
  
  const lowerText = text.toLowerCase().trim();
  
  if (HINDI_DEVANAGARI_PATTERN.test(text)) {
    return 'hi';
  }
  
  const hindiWordCount = HINDI_WORDS_IN_ROMAN.filter(word => 
    lowerText.includes(word.toLowerCase())
  ).length;
  
  const totalWords = lowerText.split(/\s+/).filter(w => w.length > 0).length;
  const hindiRatio = hindiWordCount / Math.max(totalWords, 1);
  
  if (hindiRatio > 0.25 || hindiWordCount >= 2) {
    return 'hinglish';
  }
  
  if (!HINDI_WORDS_IN_ROMAN.some(word => lowerText.includes(word))) {
    return 'en';
  }
  
  return 'hinglish';
}

export function detectLanguageWithConfidence(text: string): { 
  language: DetectedLanguage; 
  confidence: number;
} {
  if (!text || text.trim().length < 2) {
    return { language: 'en', confidence: 0 };
  }
  
  const lowerText = text.toLowerCase().trim();
  
  if (HINDI_DEVANAGARI_PATTERN.test(text)) {
    return { language: 'hi', confidence: 0.95 };
  }
  
  const hindiWordCount = HINDI_WORDS_IN_ROMAN.filter(word => 
    lowerText.includes(word.toLowerCase())
  ).length;
  
  const totalWords = lowerText.split(/\s+/).filter(w => w.length > 0).length;
  
  if (hindiWordCount >= 3) {
    return { 
      language: 'hinglish', 
      confidence: Math.min(0.5 + (hindiWordCount * 0.15), 0.95) 
    };
  }
  
  if (hindiWordCount >= 1 && totalWords <= 10) {
    return { 
      language: 'hinglish', 
      confidence: Math.min(0.3 + (hindiWordCount * 0.2), 0.7) 
    };
  }
  
  if (hindiWordCount === 0 && totalWords > 5) {
    return { language: 'en', confidence: 0.8 };
  }
  
  return { language: 'hinglish', confidence: 0.5 };
}

export function shouldAutoSwitch(
  currentLanguage: string, 
  detectedLanguage: DetectedLanguage,
  confidence: number
): boolean {
  if (currentLanguage === detectedLanguage) {
    return false;
  }
  
  if (confidence < 0.6) {
    return false;
  }
  
  return true;
}

export const LANGUAGE_DETECTION_STORAGE_KEY = 'divine_tarot_language_lock';

export function lockLanguage(language: DetectedLanguage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LANGUAGE_DETECTION_STORAGE_KEY, language);
}

export function isLanguageLocked(): DetectedLanguage | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LANGUAGE_DETECTION_STORAGE_KEY) as DetectedLanguage | null;
}

export function unlockLanguage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LANGUAGE_DETECTION_STORAGE_KEY);
}