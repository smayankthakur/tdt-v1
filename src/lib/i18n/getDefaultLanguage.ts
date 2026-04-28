export function getDefaultLanguage(): 'en' | 'hi' | 'hinglish' {
  if (typeof window === 'undefined') return 'en';

  const saved = localStorage.getItem('lang');
  if (saved) return saved as any;

  const browserLang = navigator.language.toLowerCase();

  if (browserLang.includes('hi')) return 'hi';

  return 'en';
}
