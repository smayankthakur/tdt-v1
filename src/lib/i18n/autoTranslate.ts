'use client';

const HINGLISH_REPLACEMENTS: Record<string, string> = {
  'are': 'hain',
  'is': 'hai',
  'am': 'hoon',
  'was': 'tha',
  'were': 'the',
  'have': 'hai',
  'has': 'hai',
  'had': 'tha',
  'do': 'karo',
  'does': 'karta hai',
  'did': 'kiya',
  'will': 'henge',
  'would': 'hoga',
  'can': 'sakte ho',
  'could': 'sakta tha',
  'should': 'chahiye',
  'must': 'zaruri hai',
  'need': 'chahiye',
  'want': 'chahte ho',
  'like': 'pasand hai',
  'love': 'pyar hai',
  'feel': 'feel kar rahe ho',
  'think': 'soch rahe ho',
  'know': 'jaante ho',
  'see': 'dekhte ho',
  'hear': 'sunte ho',
  'believe': 'vishwaas karte ho',
  'understand': 'samajh rahe ho',
  'want to': 'karna chahte ho',
  'going to': 'ja rahe hain',
  'have to': 'karna padega',
  'need to': 'chahiye',
  'trying to': 'koshish kar rahe ho',
  'start': 'shuru karo',
  'begin': 'shuru hoga',
  'end': 'khatam',
  'stop': 'ruk jao',
  'wait': 'ruk jao',
  'come': 'aao',
  'go': 'jao',
  'stay': 'ruko',
  'live': 'jeete ho',
  'die': 'mar jayenge',
  'happy': 'khush',
  'sad': 'udas',
  'good': 'acha',
  'bad': 'bura',
  'big': 'bada',
  'small': 'chhota',
  'new': 'naya',
  'old': 'purana',
  'great': 'bahut acha',
  'best': 'sabse acha',
  'worst': 'sabse bura',
  'right': 'sahi',
  'wrong': 'galat',
  'true': 'sach',
  'false': 'jhoot',
  'clear': 'saaf',
  'confused': 'confused',
  'lost': 'khoya hua',
  'found': 'mila',
  'help': 'madad',
  'support': 'saath',
  'time': 'waqt',
  'money': 'paisa',
  'work': 'kaam',
  'job': 'naukri',
  'career': 'career',
  'relationship': 'rishta',
  'family': 'parivar',
  'friend': 'dost',
  'enemy': 'dushman',
  'future': 'future',
  'past': 'past',
  'present': 'present',
  'today': 'aaj',
  'tomorrow': 'kal',
  'yesterday': 'kal',
  'now': 'abhi',
  'later': 'baad mein',
  'soon': 'jald',
  'always': 'hamesha',
  'never': 'kabhi nahi',
  'sometimes': 'kabhi kabhi',
  'often': 'aksar',
  'rarely': 'kam baar',
  'every': 'har',
  'nothing': 'kuch nahi',
  'something': 'kuch',
  'everything': 'sab kuch',
  'anything': 'kuch bhi',
  'everyone': 'sab',
  'someone': 'koi',
  'anyone': 'koi bhi',
  'I': 'Main',
  'you': 'Tum',
  'he': 'Wo',
  'she': 'Wo',
  'they': 'Wo log',
  'we': 'Hum',
  'me': 'Mujhe',
  'my': 'Mera',
  'your': 'Tumhara',
  'his': 'Uska',
  'her': 'Uska',
  'their': 'Unka',
  'our': 'Hamaara',
  'this': 'Ye',
  'that': 'Wo',
  'here': 'Yahan',
  'there': 'Wahan',
  'what': 'Kya',
  'who': 'Kaun',
  'where': 'Kahan',
  'when': 'Kab',
  'why': 'Kyu',
  'how': 'Kaise',
  'which': 'Konsa',
  'whether': 'Chahe',
  'if': 'Agar',
  'but': 'Lekin',
  'or': 'Ya',
  'and': 'Aur',
  'so': 'To',
  'because': 'Kyunki',
  'although': 'Halanki',
  'however': 'Lekin',
  'since': 'Se',
  'until': 'Jab tak',
  'while': 'Jab',
  'after': 'Baad',
  'before': 'Pehle',
  'during': 'Dauran',
  'between': 'Bich',
  'among': 'Me',
  'with': 'Ke saath',
  'without': 'Bina',
  'through': 'Se',
  'over': 'Upar',
  'under': 'Neeche',
  'above': 'Upar',
  'below': 'Neeche',
  'inside': 'Andar',
  'outside': 'Bahar',
  'near': 'Paas',
  'close': 'Paas',
  'fast': 'Tej',
  'slow': 'Dheele',
  'quick': 'Jaldi',
  'easy': 'Asan',
  'hard': 'Mushkil',
  'simple': 'Simple',
  'complex': 'Complex',
  'beautiful': 'Khoobsurat',
  'ugly': 'Badhshah',
  'rich': 'Ameer',
  'poor': 'Garib',
  'strong': 'Mazboot',
  'weak': 'Kamzor',
  'healthy': 'Tez',
  'sick': 'Bimari',
  'safe': 'Surakshit',
  'dangerous': 'Khatarnak',
  'busy': 'Busy',
  'important': 'Zaruri',
  'urgent': 'Jaldi',
  'possible': 'Mumkin',
  'impossible': 'Namumkin',
  'necessary': 'Zaruri',
  'optional': 'Optional',
  'required': 'Zaruri',
  'final': 'Final',
  'first': 'Pehla',
  'last': 'Akhir',
  'next': 'Agla',
  'previous': 'Pehla',
  'beginning': 'Shuruat',
  'ending': 'Khatam',
};

const DEVANAGARI_MAP: Record<string, string> = {
  'a': 'अ',
  'aa': 'आ',
  'i': 'इ',
  'ee': 'ई',
  'u': 'उ',
  'oo': 'ऊ',
  'e': 'ए',
  'ai': 'ऐ',
  'o': 'ओ',
  'au': 'औ',
  'an': 'अं',
  'ah': 'अः',
  'k': 'क',
  'kh': 'ख',
  'g': 'ग',
  'gh': 'घ',
  'c': 'च',
  'ch': 'छ',
  'j': 'ज',
  'jh': 'झ',
  't': 'ट',
  'th': 'ठ',
  'd': 'ड',
  'dh': 'ढ',
  'n': 'न',
  'p': 'प',
  'ph': 'फ',
  'b': 'ब',
  'bh': 'भ',
  'm': 'म',
  'y': 'य',
  'r': 'र',
  'l': 'ल',
  'v': 'व',
  'w': 'व',
  'sh': 'श',
  's': 'स',
  'h': 'ह',
  'q': 'क़',
  'x': 'क्ष',
  'f': 'फ',
  'z': 'ज़',
};

const HINDI_WORDS: Record<string, string> = {
  'what': 'क्या',
  'who': 'कौन',
  'where': 'कहाँ',
  'when': 'कब',
  'why': 'क्यों',
  'how': 'कैसे',
  'which': 'कौन सा',
  'yes': 'हाँ',
  'no': 'नहीं',
  'please': 'कृपया',
  'thank': 'धन्यवाद',
  'thanks': 'धन्यवाद',
  'sorry': 'माफ़ करें',
  'hello': 'नमस्ते',
  'goodbye': 'अलविदा',
  'good morning': 'सुप्रभात',
  'good night': 'शुभ रात्रि',
  'good evening': 'शुभ संध्या',
  'love': 'प्रेम',
  'heart': 'दिल',
  'soul': 'आत्मा',
  'mind': 'मन',
  'life': 'जीवन',
  'time': 'समय',
  'moment': 'पल',
  'day': 'दिन',
  'night': 'रात',
  'peace': 'शांति',
  'joy': 'आनंद',
  'hope': 'आशा',
  'fear': 'डर',
  'anger': 'गुस्सा',
  'pain': 'दर्द',
  'happiness': 'खुशी',
  'sadness': 'उदासी',
  'success': 'सफलता',
  'failure': 'असफलता',
  'friend': 'मित्र',
  'enemy': 'शत्रु',
  'truth': 'सत्य',
  'lie': 'झूठ',
  'magic': 'जादू',
  'universe': 'ब्रह्मांड',
  'energy': 'ऊर्जा',
  'power': 'शक्ति',
  'strength': 'शक्ति',
  'wisdom': 'बुद्धि',
  'knowledge': 'ज्ञान',
  'university': 'विश्वविद्यालय',
  'college': 'कॉलेज',
  'school': 'विद्यालय',
  'teacher': 'शिक्षक',
  'student': 'छात्र',
  'doctor': 'डॉक्टर',
  'engineer': 'इंजीनियर',
  'lawyer': 'वकील',
  'police': 'पुलिस',
  'government': 'सरकार',
  'country': 'देश',
  'city': 'शहर',
  'village': 'गाँव',
  'road': 'सड़क',
  'house': 'मकान',
  'home': 'घर',
  'family': 'परिवार',
  'mother': 'माँ',
  'father': 'पिता',
  'sister': 'बहन',
  'brother': 'भाई',
  'son': 'बेटा',
  'daughter': 'बेटी',
  'wife': 'पत्नी',
  'husband': 'पति',
  'friend': 'मित्र',
  'lover': 'प्रेमी',
  'enemy': 'शत्रु',
  'king': 'राजा',
  'queen': 'रानी',
  'god': 'भगवान',
  'goddess': 'देवी',
  'lord': 'भगवान',
  'master': 'स्वामी',
  'owner': 'मालिक',
  'boss': 'साहब',
  'employee': 'कर्मचारी',
  'worker': '���ज��ूर',
  'farmer': 'किसान',
  'shopkeeper': 'दुकानदार',
  'merchant': 'व्यापारी',
  'businessman': 'व्यापारी',
  'actor': 'अभिनेता',
  'actress': 'अभिनेत्री',
  'singer': 'गायक',
  'musician': 'संगीतकार',
  'artist': 'कलाकार',
  'painter': 'चित्रकार',
  'writer': 'लेखक',
  'poet': 'कवि',
  'journalist': 'पत्रकार',
  'reporter': 'रिपोर्टर',
  'photographer': 'फोटोग्राफर',
  'chef': 'शेफ',
  'pilot': 'पायलट',
  'driver': 'चालक',
  'captain': 'कप्तान',
  'soldier': 'सैनिक',
  'army': 'सेना',
  'navy': 'नौसेना',
  'air force': 'वायु सेना',
  'president': 'राष्ट्रपति',
  'minister': 'मंत्री',
  'judge': 'न्यायाधीश',
  'lawyer': 'वकील',
  'minister': 'मंत्री',
  'prime minister': 'प्रधान मंत्री',
  'chief minister': 'मुख्य मंत्री',
  'governor': 'राज्यपाल',
  'mayor': 'महापौर',
  'leader': 'नेता',
  'hero': 'वीर',
  'king': 'राजा',
  'queen': 'रानी',
  'prince': 'राजकुमार',
  'princess': 'राजकुमारी',
  'queen': 'महारानी',
  'lord': 'भगवान',
  'goddess': 'देवी',
  'lord': 'प्रभु',
};

export function detectLanguageFromText(text: string): 'en' | 'hi' | 'hinglish' {
  if (!text || text.length === 0) return 'en';

  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) {
    return 'hi';
  }

  const latinChars = text.match(/[a-zA-Z]/g) || [];
  const totalChars = text.replace(/[^a-zA-Z\u0900-\u097F]/g, '').length;
  
  if (totalChars > 0 && latinChars.length / totalChars > 0.5) {
    return 'en';
  }

  const romanizedIndicators = ['hai', 'hain', 'ka', 'ki', 'ko', 'ke', 'se', 'me', 'pe', 'ka', 'ra', 're', 'na'];
  const words = text.toLowerCase().split(/\s+/);
  const romanizedCount = words.filter(w => romanizedIndicators.includes(w)).length;
  
  if (romanizedCount > words.length * 0.3) {
    return 'hinglish';
  }

  return 'en';
}

export async function convertToHinglish(text: string): Promise<string> {
  if (!text) return text;

  const words = text.split(/\s+/);
  const converted = words.map(word => {
    const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const replacement = HINGLISH_REPLACEMENTS[clean];
    if (replacement) {
      return word.replace(new RegExp(clean, 'i'), replacement);
    }
    return word;
  });

  return converted.join(' ');
}

export async function translateToHindi(text: string): Promise<string> {
  if (!text) return text;

  const words = text.split(/\s+/);
  const converted = words.map(word => {
    const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const hindi = HINDI_WORDS[clean];
    if (hindi) {
      return word.replace(new RegExp(clean, 'i'), hindi);
    }
    return word;
  });

  if (converted.join(' ').match(/[a-zA-Z]/)) {
    const directMap: Record<string, string> = {};
    for (const [eng, hin] of Object.entries(HINDI_WORDS)) {
      directMap[eng.toLowerCase()] = hin;
    }
    
    return words.map(w => directMap[w.toLowerCase()] || w).join(' ');
  }

  return converted.join(' ');
}

export function detectHardcodedText(text: string): boolean {
  if (!text) return false;
  if (text.includes('.')) return false;
  if (text.match(/^[a-z]+$/i)) return false;
  if (text.length > 3 && !text.match(/[A-Z]/) && text === text.toLowerCase()) {
    console.warn('[i18n] Possible hardcoded:', text);
    return true;
  }
  return false;
}