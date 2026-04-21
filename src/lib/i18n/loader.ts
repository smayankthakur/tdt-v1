import type { Language } from './config'
import { langMap } from './config'
import { TRANSLATIONS } from './translations'
import { translations as flatTranslations } from '@/translations'

// In-memory cache for API-fetched translations
let translationCache: {
  data: Record<string, Record<string, string>>
  lastFetched: number
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Emergency fallback translations - comprehensive
const FALLBACK: Record<string, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.reading': 'Reading',
    'nav.subscription': 'Subscription',
    'nav.booking': 'Booking',
    'nav.contact': 'Contact',
    // Footer
    'footer.tagline': 'Clarity starts from within. Sometimes, you just need a moment to pause, reflect, and understand what your heart already knows.',
    'footer.navigation': 'Navigation',
    'footer.support': 'Support',
    'footer.connect': 'Connect',
    'footer.disclaimer': 'Not a replacement for professional advice. For guidance purposes only.',
    'footer.copyright': 'All rights reserved.',
    'footer.privacy': 'Privacy',
    // Home Hero
    'home.hero.sloganLine1': "This isn't just tarot...",
    'home.hero.sloganLine2': "This is clarity when life gets confusing...",
    'home.hero.quote': "The answer you're looking for... you already feel it",
    'home.hero.ctaButton': 'Know Your Fortune',
    'home.hero.ctaSubtext': "Maybe this is the answer you've been waiting for...",
    // Landing sections
    'landing.preview.title': 'A Glimpse Into Your Journey',
    'landing.preview.subtitle': 'What the cards might reveal for you',
    'landing.preview.cardTitle': 'Your Reading Preview',
    'landing.preview.pastLabel': 'The Past:',
    'landing.preview.presentLabel': 'The Present:',
    'landing.preview.guidanceLabel': 'The Guidance:',
    'landing.preview.pastText': "You've been at a crossroads...",
    'landing.preview.presentText': "There's a new opportunity approaching...",
    'landing.preview.guidanceText': 'The cards speak of hope and new beginnings...',
    'landing.preview.ctaText': 'This is just a glimpse. Your full reading awaits...',
    'landing.preview.ctaButton': "See What's Coming",
    'landing.preview.ctaSubtext': 'Takes less than 60 seconds',
    // How It Works
    'landing.howItWorks.title': 'How It Works',
    'landing.howItWorks.subtitle': 'Three simple steps to unlock your clarity',
    'landing.howItWorks.ask.title': 'Ask Your Question',
    'landing.howItWorks.ask.description': 'Focus on what truly troubles your heart',
    'landing.howItWorks.pick.title': 'Pick Your Cards',
    'landing.howItWorks.pick.description': 'Select three cards from the mystical deck',
    'landing.howItWorks.reveal.title': 'Reveal Your Answers',
    'landing.howItWorks.reveal.description': 'Receive personalized insights instantly',
    // Problems
    'landing.problems.stuck.title': 'Feeling stuck in your life?',
    'landing.problems.stuck.description': 'When everything feels motionless',
    'landing.problems.love.title': 'Confused in love or relationships?',
    'landing.problems.love.description': 'Your heart deserves honest answers',
    'landing.problems.direction.title': 'Unsure about your next move?',
    'landing.problems.direction.description': 'The universe has guidance for you',
    // About
    'landing.about.title': 'About The Journey',
    'landing.about.description': 'This platform was not created just for readings. It was created to provide clarity when life feels confusing.',
    'landing.about.bio': 'Bharti Singh is a seasoned tarot reader with over 10 years of experience guiding individuals.',
    'landing.about.linkText': 'Learn more about us',
    // Testimonials
    'testimonials.title': 'What Seekers Say',
    'testimonials.seeMore': 'See more reviews',
    // Why Section
    'whySection.title': 'Why The Devine Tarot?',
    'whySection.description': 'We combine ancient tarot wisdom with cutting-edge AI technology.',
    'whySection.features.personalized': 'Personalized readings based on your energy',
    'whySection.features.ai': 'AI-powered insights with human warmth',
    'whySection.features.privacy': '100% private and secure',
    'whySection.features.instant': 'Instant answers, anytime',
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    // About page
    'about.hero.title': 'About The Journey',
    'about.hero.subtitle': 'This platform was not created just for readings. It was created to provide clarity when life feels confusing.',
    'about.founder.role': 'Founder & Lead Tarot Reader',
    'about.founder.bio': "Over 10 years of experience guiding seekers through life's most confusing moments. What started as a personal journey into tarot evolved into a mission — making spiritual guidance accessible to everyone, anytime.",
    'about.founder.philosophy': "This platform isn't about predictions. It's about helping you see what you already feel deep inside. The cards don't tell you what to do — they help you understand what you already know.",
    'about.stats.readings': '10,000+ Readings',
    'about.stats.since': 'Since 2014',
    'about.philosophy.title': 'The Philosophy',
    'about.philosophy.clarity.title': 'Clarity Over Prediction',
    'about.philosophy.clarity.desc': "We don't tell your future. We help you see your present more clearly.",
    'about.philosophy.personal.title': 'Personal Over Generic',
    'about.philosophy.personal.desc': 'Every reading is unique. No templates, no copy-paste responses.',
    'about.philosophy.guidance.title': 'Guidance Over Advice',
    'about.philosophy.guidance.desc': 'We guide you to your own answers. The power was always within you.',
    'about.why.title': 'Why This Platform?',
    'about.why.p1': "Traditional tarot readings require appointments, waiting, and often come with a premium price tag. But clarity shouldn't wait — and it shouldn't cost a fortune.",
    'about.why.p2': 'This platform combines ancient tarot wisdom with modern AI technology to create something truly unique: readings that feel personal, that understand your emotional context, and that give you insight when you need it most.',
    'about.why.p3': "Whether you're at 2 AM with a racing mind or need a quick perspective before a big decision — the answers are here, waiting for you.",
    'about.cta.text': 'Ready to find your clarity?',
    'cta.startReading': 'Start Reading',
    // About features (no AI language)
    'home.about.feature1': 'Deep insights',
    'home.about.feature2': 'Spiritual guidance',
    'home.about.feature3': 'Personalized clarity',
    // Reading page
    'reading.selectTopic': 'What area of your life needs clarity?',
    'reading.enterQuestion': 'What would you like to know?',
    'reading.inputPlaceholder': 'Ask your question…',
    'reading.selectCards': 'Select 3 cards',
    'reading.loading': "Let's see what comes through…",
    'reading.cardsSaying': "Your cards are saying:",
  },
  hi: {
    // Nav
    'nav.home': 'होम',
    'nav.about': 'के बारे में',
    'nav.reading': 'रीडिंग',
    'nav.subscription': 'सब्सक्रिप्शन',
    'nav.booking': 'बुकिंग',
    'nav.contact': 'संपर्क',
    // Footer
    'footer.tagline': 'स्पष्टता अंदर से शुरू होती है। कभी-कभी, आपको बस रुकने, सोचने और समझने की जरूरत है कि आपका दिल क्या जानता है।',
    'footer.navigation': 'नेविगेशन',
    'footer.support': 'सहायता',
    'footer.connect': 'जुड़ें',
    'footer.disclaimer': 'यह पेशेवर सलाह का विकल्प नहीं है। केवल मार्गदर्शन के उद्देश्यों के लिए है।',
    'footer.copyright': 'सर्वाधिकार सुरक्षित।',
    'footer.privacy': 'गोपनीयता',
    // Home Hero
    'home.hero.sloganLine1': 'यह सिर्फ टैरो नहीं है...',
    'home.hero.sloganLine2': 'यह वो स्पष्टता है जब जिंदगी भ्रमित हो जाए...',
    'home.hero.quote': 'जो आप पूछना चाहते हैं... उसका उत्तर आप पहले से महसूस कर रहे हैं',
    'home.hero.ctaButton': 'अपना भविष्य जानें',
    'home.hero.ctaSubtext': 'शायद यही उत्तर है जिसका आप इंतज़ार कर रहे थे...',
    // Landing
    'landing.preview.title': 'आपकी यात्रा की एक झलक',
    'landing.preview.subtitle': 'पत्ते आपके लिए क्या प्रकट कर सकते हैं',
    'landing.preview.cardTitle': 'आपकी रीडिंग पूर्वावलोकन',
    'landing.preview.pastLabel': 'अतीत:',
    'landing.preview.presentLabel': 'वर्तमान:',
    'landing.preview.guidanceLabel': 'मार्गदर्शन:',
    'landing.preview.pastText': 'आप एक चौराहे पर थे...',
    'landing.preview.presentText': 'एक नया अवसर आ रहा है...',
    'landing.preview.guidanceText': 'पत्ते आशा और नई शुरुआत की बात करते हैं...',
    'landing.preview.ctaText': 'यह बस एक झलक है। आपकी पूरी रीडिंग इंतज़ार कर रही है...',
    'landing.preview.ctaButton': 'देखें क्या आ रहा है',
    'landing.preview.ctaSubtext': '60 सेकंड से कम समय लेता है',
    'landing.howItWorks.title': 'यह कैसे काम करता है',
    'landing.howItWorks.subtitle': 'अपनी स्पष्टता पाने के तीन आसान कदम',
    'landing.howItWorks.ask.title': 'अपना सवाल पूछें',
    'landing.howItWorks.ask.description': 'जो वाकई आपके दिल को परेशान करता है उस पर ध्यान दें',
    'landing.howItWorks.pick.title': 'अपने पत्ते चुनें',
    'landing.howItWorks.pick.description': 'रहस्यमय डेक से तीन पत्ते चुनें',
    'landing.howItWorks.reveal.title': 'अपने उत्तर जानें',
    'landing.howItWorks.reveal.description': 'तुरंत व्यक्तिगत अंतर्दृष्टि प्राप्त करें',
    'landing.problems.stuck.title': 'जीवन में अटके हुए महसूस करते हैं?',
    'landing.problems.stuck.description': 'जब सब कुछ स्थिर लगे',
    'landing.problems.love.title': 'प्यार या रिश्तों में कंफ्यूज़?',
    'landing.problems.love.description': 'आपके दिल को ईमानदार जवाब मिलने चाहिए',
    'landing.problems.direction.title': 'अपने अगले कदम के बारे में अनिश्चित?',
    'landing.problems.direction.description': 'ब्रह्मांड के पास आपके लिए मार्गदर्शन है',
    'landing.about.title': 'यात्रा के बारे में',
    'landing.about.description': 'यह प्लेटफॉर्म सिर्फ रीडिंग्स के लिए नहीं बना। जब जिंदगी कन्फ्यूजिंग लगती है तब स्पष्टता देने के लिए बना।',
    'landing.about.bio': 'भारती सिंह 10 से अधिक वर्षों के अनुभव वाली एक अनुभवी टैरो रीडर हैं।',
    'landing.about.linkText': 'हमारे बारे में और जानें',
    'testimonials.title': 'शिकारी क्या कहते हैं',
    'testimonials.seeMore': 'और समीक्षाएं देखें',
    'whySection.title': 'क्यों द डिवाइन टैरो?',
    'whySection.description': 'हम प्राचीन टैरो ज्ञान को अत्याध���न���क AI तकनीक के साथ जोड़ते हैं।',
    'whySection.features.personalized': 'आपकी ऊर्जा के आधार पर व्यक्तिगत रीडिंग',
    'whySection.features.ai': 'मानवीय गर्माहट के साथ AI-संचालित अंतर्दृष्टि',
    'whySection.features.privacy': '100% निजी और सुरक्षित',
    'whySection.features.instant': 'तुरंत जवाब, कभी भी',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'कुछ गलत हो गया',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'common.continue': 'जारी रखें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    // About page
    'about.hero.title': 'यात्रा के बारे में',
    'about.hero.subtitle': 'यह प्लेटफॉर्म सिर्फ रीडिंग्स के लिए नहीं बना। जब जिंदगी कन्फ्यूजिंग लगती है तब स्पष्टता देने के लिए बना।',
    'about.founder.role': 'संस्थापक एवं प्रमुख टैरो रीडर',
    'about.founder.bio': '10 से अधिक वर्षों का अनुभव रखने वाली एक गहरी अंतर्ज्ञान वाली टैरो रीडर। जो एक व्यक्तिगत यात्रा से शुरू हुई, वह एक मिशन बन गया — सभी के लिए आध्यात्मिक मार्गदर्शन सुलभ बनाना।',
    'about.founder.philosophy': 'यह प्लेटफॉर्म भविष्यवाणी के बारे में नहीं है। यह आपको वह दिखाने के बारे में है जो आप पहले से अंदर से महसूस करते हैं। कार्ड्स आपको क्या करना है यह नहीं बताते — वे आपको समझने में मदद करते हैं।',
    'about.stats.readings': '10,000+ रीडिंग',
    'about.stats.since': '2014 से',
    'about.philosophy.title': 'दर्शन',
    'about.philosophy.clarity.title': 'भविष्यवाणी से पहले स्पष्टता',
    'about.philosophy.clarity.desc': 'हम आपका भविष्य नहीं बताते। हम आपको अपना वर्तमान स्पष्ट रूप से देखने में मदद करते हैं।',
    'about.philosophy.personal.title': 'जेनरिक से व्यक्तिगत',
    'about.philosophy.personal.desc': 'हर रीडिंग अलग है। कोई टेम्पलेट नहीं, कोई कॉपी-पेस्ट जवाब नहीं।',
    'about.philosophy.guidance.title': 'सलाह से मार्गदर्शन',
    'about.philosophy.guidance.desc': 'हम आपको अपने जवाबों तक पहुंचाते हैं। शक्ति हमेशा आपके अंदर थी।',
    'about.why.title': 'यह प्लेटफॉर्म क्यों?',
    'about.why.p1': 'पारंपरिक टैरो रीडिंग्स के लिए अपॉइंटमेंट, इंतज़ार, और अक्सर प्रीमियम कीमत चुकानी पड़ती है। लेकिन स्पष्टता को इंतज़ार नहीं करना चाहिए।',
    'about.why.p2': 'यह प्लेटफॉर्म प्राचीन टैरो ज्ञान को आधुनिक AI तकनीक के साथ जोड़ता है — ऐसी रीडिंग्स जो व्यक्तिगत हों, जो आपके भावनात्मक संदर्भ को समझें।',
    'about.why.p3': 'चाहे आप रात 2 बजे दिमाग घूम रहा हो या बड़े फैसले से ��हले त्वरित दृष्टिकोण चाहते हों — जवाब यहाँ हैं, आपका इंतज़ार कर रहे हैं।',
    'about.cta.text': 'अपनी स्पष्टता पाने के लिए तैयार?',
    'cta.startReading': 'रीडिंग शुरू करें',
    // About features
    'home.about.feature1': 'गहरी अंतर्दृष्टि',
    'home.about.feature2': 'आध्यात्मिक मार्गदर्शन',
    'home.about.feature3': 'व्यक्तिगत स्पष्टता',
    // Reading page
    'reading.selectTopic': 'आपके जीवन में किस क्षेत्र को स्पष्टता चाहिए?',
    'reading.enterQuestion': 'आप क्या जानना चाहते हैं?',
    'reading.inputPlaceholder': 'अपना सवाल लिखें…',
    'reading.selectCards': '3 पत्ते चुनें',
    'reading.loading': 'चलो देखते हैं क्या आता है…',
    'reading.cardsSaying': 'आपके पत्ते कह रहे हैं:',
  },
  hinglish: {
    // Nav
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.reading': 'Reading',
    'nav.subscription': 'Subscription',
    'nav.booking': 'Booking',
    'nav.contact': 'Contact',
    // Footer
    'footer.tagline': 'Clarity starts from within. Kabhi-kabhi, tumhe bas ruki, socha aur samajhna padta hai ki tumhara dil kya jaanta hai.',
    'footer.navigation': 'Navigation',
    'footer.support': 'Support',
    'footer.connect': 'Connect',
    'footer.disclaimer': 'Yeh professional advice ka replace nahi hai. Sirf guidance ke liye hai.',
    'footer.copyright': 'All rights reserved.',
    'footer.privacy': 'Privacy',
    // Home Hero
    'home.hero.sloganLine1': "This sirf tarot nahi hai...",
    'home.hero.sloganLine2': "Yeh woh clarity hai jab life confusing ho jaati hai...",
    'home.hero.quote': "Jo aap poochhna chahte hain... uska jawaab aap pehle se feel kar rahe hain",
    'home.hero.ctaButton': "Apna bhavishya jaanein",
    'home.hero.ctaSubtext': "Shayad yehi jawaab hai jiska aap intezaar kar rahe the...",
    // Landing
    'landing.preview.title': 'Tumhare journey ki ek glimpse',
    'landing.preview.subtitle': 'Kya cards tumhare liye reveal kar sakte hain',
    'landing.preview.cardTitle': 'Tumhari Reading Preview',
    'landing.preview.pastLabel': 'Past:',
    'landing.preview.presentLabel': 'Present:',
    'landing.preview.guidanceLabel': 'Guidance:',
    'landing.preview.pastText': 'Tum ek crossroads par ho...',
    'landing.preview.presentText': 'Ek naya opportunity approaching hai...',
    'landing.preview.guidanceText': 'Cards hope aur new beginnings ki baat karte hain...',
    'landing.preview.ctaText': 'Yeh sirf glimpse hai. Full reading await kar rahi hai...',
    'landing.preview.ctaButton': 'Dekho kya aa raha hai',
    'landing.preview.ctaSubtext': '60 seconds se kam time lega',
    'landing.howItWorks.title': 'Yeh kaise kaam karta hai',
    'landing.howItWorks.subtitle': 'Clarity pane ke liye teen simple steps',
    'landing.howItWorks.ask.title': 'Apna sawaal poochho',
    'landing.howItWorks.ask.description': 'Jo sach mein tumhare dil ko trouble kar raha hai us par focus karo',
    'landing.howItWorks.pick.title': 'Apne cards choose karo',
    'landing.howItWorks.pick.description': 'Mystical deck se teen cards choose karo',
    'landing.howItWorks.reveal.title': 'Apne answers reveal karo',
    'landing.howItWorks.reveal.description': 'Instant personalized insights pao',
    'landing.problems.stuck.title': 'Life mein stuck feel kar rahe ho?',
    'landing.problems.stuck.description': 'Jab sab kuch stagnant lagta hai',
    'landing.problems.love.title': 'Love ya relationships mein confused?',
    'landing.problems.love.description': 'Tumhara dil honest answers deserve karta hai',
    'landing.problems.direction.title': 'Apni next move ke baare mein unsure?',
    'landing.problems.direction.description': 'Universe ke paas tumhare liye guidance hai',
    'landing.about.title': 'Journey ke baare mein',
    'landing.about.description': 'Yeh platform sirf readings ke liye nahi bana. Clarity dene ke liye bana hai jab life confusing lagti hai.',
    'landing.about.bio': 'Bharti Singh ek experienced tarot reader hain 10+ saal ke experience ke saath.',
    'landing.about.linkText': 'Humare baare mein aur jaano',
    'testimonials.title': 'Seekers kya kehte hain',
    'testimonials.seeMore': 'Aur reviews dekho',
    'whySection.title': 'Kyun The Devine Tarot?',
    'whySection.description': 'Hum ancient tarot wisdom ko AI tech ke saath mix karte hain.',
    'whySection.features.personalized': 'Tumhari energy ke according personalized readings',
    'whySection.features.ai': 'AI-powered insights with human touch',
    'whySection.features.privacy': '100% private aur secure',
    'whySection.features.instant': 'Instant answers, kabhi bhi',
    'common.loading': 'Loading...',
    'common.error': 'Kuch galat ho gaya',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    // About page
    'about.hero.title': 'About The Journey',
    'about.hero.subtitle': 'Yeh platform sirf readings ke liye nahi bana. Clarity dene ke liye bana hai jab life confusing lagti hai.',
    'about.founder.role': 'Founder & Lead Tarot Reader',
    'about.founder.bio': "Over 10 years of experience guiding seekers through life's most confusing moments. What started as a personal journey into tarot evolved into a mission.",
    'about.founder.philosophy': "Yeh platform predictions ke liye nahi hai. Yeh tumhe dikhane ke liye hai jo tum already feel kar rahe ho. Cards tumhe kya karna hai yeh nahi batate — woh samajhne mein help karte hain.",
    'about.stats.readings': '10,000+ Readings',
    'about.stats.since': 'Since 2014',
    'about.philosophy.title': 'The Philosophy',
    'about.philosophy.clarity.title': 'Clarity Over Prediction',
    'about.philosophy.clarity.desc': "Hum tumhara future nahi batate. Hum tumhe tumhara present clearly dikhane mein help karte hain.",
    'about.philosophy.personal.title': 'Personal Over Generic',
    'about.philosophy.personal.desc': 'Har reading unique hai. No templates, no copy-paste responses.',
    'about.philosophy.guidance.title': 'Guidance Over Advice',
    'about.philosophy.guidance.desc': 'Hum tumhe tumhare answers tak pahunchate hain. Power hamesha tumhare andar thi.',
    'about.why.title': 'Why This Platform?',
    'about.why.p1': 'Traditional tarot readings ke liye appointment, wait, aur premium price chahiye. But clarity wait nahi karni chahiye.',
    'about.why.p2': 'Yeh platform ancient tarot wisdom ko modern AI technology ke saath mix karta hai — readings jo personal hain, jo tumhari emotional context samajhte hain.',
    'about.why.p3': 'Chahe tum 2 AM par confused ho ya big decision se pehle quick perspective chahiye — answers yahan hain, tumhare liye wait kar rahe hain.',
    'about.cta.text': 'Ready to find your clarity?',
    'cta.startReading': 'Start Reading',
    // About features
    'home.about.feature1': 'Deep insights',
    'home.about.feature2': 'Spiritual guidance',
    'home.about.feature3': 'Personalized clarity',
    // Reading page
    'reading.selectTopic': 'Kis area mein tumhe clarity chahiye?',
    'reading.enterQuestion': 'Tum kya jaanna chahte ho?',
    'reading.inputPlaceholder': 'Apna sawaal likho…',
    'reading.selectCards': '3 cards choose karo',
    'reading.loading': "Bas dekhte hain kya aa raha hai…",
    'reading.cardsSaying': "Tumhare cards keh rahe hain:",
  },
}

/**
 * Get translation from nested structure (existing system)
 */
function getNestedTranslation(key: string, lang: Language): string {
  const mappedLang = langMap[lang] || lang
  const keys = key.split('.')
  let value: unknown = TRANSLATIONS[mappedLang]

  if (!value) {
    return key
  }

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key
    }
  }

  return typeof value === 'string' ? value : key
}

/**
 * Get translation from flat store (auto-generated keys)
 */
function getFlatTranslation(key: string, lang: Language): string | undefined {
  const mappedLang = langMap[lang] || lang
  // Use explicit typing to satisfy TypeScript
  const flatDicts: Record<string, Record<string, string>> = flatTranslations
  const langDict = flatDicts[mappedLang as keyof typeof flatDicts]
  return langDict?.[key]
}

/**
 * Sync translation getter (main export for useLanguage)
 * Merges nested and flat translation sources
 */
export function getTranslationSync(key: string, lang: Language): string {
  // 1. Try nested structure first (existing translations)
  const nested = getNestedTranslation(key, lang)
  // If nested returned something different from key, it's a valid translation
  if (nested !== key) return nested

  // 2. Try flat store (CMS-managed)
  const flat = getFlatTranslation(key, lang)
  if (flat) return flat

  // 3. Try emergency fallback
  const fallbackValue = FALLBACK[lang]?.[key]
  if (fallbackValue) {
    return fallbackValue
  }

  // 4. Return human-readable fallback - extract last part of key
  const parts = key.split('.')
  const readable = parts[parts.length - 1]
  if (readable && readable.length > 0) {
    return readable.charAt(0).toUpperCase() + readable.slice(1)
  }
  return key
}

/**
 * Load translations from API with caching
 */
export async function loadTranslations(lang: Language = 'en'): Promise<Record<string, string>> {
  // Check cache first
  if (translationCache && (Date.now() - translationCache.lastFetched) < CACHE_DURATION) {
    const cacheLang = lang as keyof typeof translationCache.data
    return translationCache.data[cacheLang] || {}
  }

  try {
    // Fetch from API (for dynamic CMS updates)
    const res = await fetch('/api/translations', {
      cache: 'no-store'
    })

    if (res.ok) {
      const data = await res.json()
      translationCache = {
        data,
        lastFetched: Date.now()
      }
      return data[lang] || data.english || {}
    }
  } catch (error) {
    console.warn('[i18n] Failed to fetch translations from API, using fallback:', error)
  }

  // Fallback: merge static sources (nested + flat)
  const result: Record<string, string> = {}
  
  // From nested (flatten all keys)
  const flattenNested = (obj: unknown, prefix = ''): void => {
    if (obj && typeof obj === 'object') {
      Object.entries(obj as Record<string, unknown>).forEach(([k, v]) => {
        const newPrefix = prefix ? `${prefix}.${k}` : k
        if (typeof v === 'string') {
          result[newPrefix] = v
        } else {
          flattenNested(v, newPrefix)
        }
      })
    }
  }
  flattenNested(TRANSLATIONS[lang] || {})
  
  // From flat store
  const flatDicts: Record<string, Record<string, string>> = flatTranslations
  const flatLangKey = lang as keyof typeof flatDicts
  Object.assign(result, flatDicts[flatLangKey] || {})
  
  return result
}

/**
 * Clear translation cache (call after CMS updates)
 */
export function clearTranslationCache(): void {
  translationCache = null
}

/**
 * Refresh translations (clear cache; next fetch will be fresh)
 */
export function refreshTranslations(): void {
  clearTranslationCache()
}
