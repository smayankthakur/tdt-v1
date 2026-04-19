import { TarotCard, SelectedCard } from './tarot/logic';
import { DomainAnalysis, getCardInterpretation } from './cardEngine';

// ========== CONTEXT ANALYSIS ==========

export interface ReadingContext {
  emotion: string;
  topic: string;
  urgency: 'low' | 'medium' | 'high';
  hiddenInsight: string;
  question: string;
  name: string;
}

export function createContextFromAnalysis(
  analysis: DomainAnalysis,
  question: string,
  name: string
): ReadingContext {
  // Map DomainAnalysis to ReadingContext
  const urgencyMap: Record<string, 'low' | 'medium' | 'high'> = {
    anxious: 'high',
    hopeful: 'low',
    confused: 'high',
    heartbroken: 'high',
    stuck: 'medium',
    determined: 'low',
    neutral: 'medium',
  };

  // Generate hidden insight based on domain and emotion
  let hiddenInsight = '';
  if (analysis.primaryDomain === 'no_contact') {
    hiddenInsight = 'The person you\'re thinking about is also holding something in—they want to reach out but fear is stopping them.';
  } else if (analysis.primaryDomain === 'love') {
    hiddenInsight = 'There\'s emotional vulnerability beneath the surface that neither of you is naming yet.';
  } else if (analysis.emotionalTone === 'anxious') {
    hiddenInsight = 'Your anxiety comes from a deep need for control—but the real answer lies in surrender.';
  } else if (analysis.emotionalTone === 'confused') {
    hiddenInsight = 'You already know the answer, you\'re just waiting for permission to act on it.';
  }

  return {
    emotion: analysis.emotionalTone,
    topic: analysis.primaryDomain,
    urgency: urgencyMap[analysis.emotionalTone] || 'medium',
    hiddenInsight,
    question,
    name,
  };
}

function analyzeQuestion(question: string): Omit<ReadingContext, 'name'> {
  const lowerQ = question.toLowerCase();
  
  // Detect emotion
  let emotion = 'neutral';
  let urgency: 'low' | 'medium' | 'high' = 'medium';
  
  if (lowerQ.match(/worried|stress|nervous|uncertain|afraid|fear|scared|anxious|darr|ghabrat/)) {
    emotion = 'anxious';
    urgency = 'high';
  } else if (lowerQ.match(/hope|wish|positive|good|better|dream|want|hope|ishq|pyar/)) {
    emotion = 'hopeful';
    urgency = 'low';
  } else if (lowerQ.match(/confused|lost|direction|don't know|what should|samajh|kya|paresh/)) {
    emotion = 'confused';
    urgency = 'high';
  } else if (lowerQ.match(/hurt|pain|broken|miss|heart|sad|grief|breakup|dard/)) {
    emotion = 'heartbroken';
    urgency = 'high';
  } else if (lowerQ.match(/stuck|blocked|can't|repetitive|going in circles|atka|jad/)) {
    emotion = 'stuck';
    urgency = 'medium';
  } else if (lowerQ.match(/will|determined|must|need to|try|fight|strong/)) {
    emotion = 'determined';
    urgency = 'low';
  }
  
  // Detect topic
  let topic = 'general';
  if (lowerQ.match(/love|relationship|partner|boyfriend|girlfriend|ex|heart|romance|marriage|shaadi|pyaar/)) {
    topic = 'love';
  } else if (lowerQ.match(/career|job|work|boss|colleague|promotion|salary|business|kaam/)) {
    topic = 'career';
  } else if (lowerQ.match(/money|financial|rich|debt|invest|wealth|finance|paise/)) {
    topic = 'finance';
  } else if (lowerQ.match(/no contact|hasn't reached|not talking|silence|blocked|waiting|block/)) {
    topic = 'no_contact';
  } else if (lowerQ.match(/future|life|path|purpose|destiny|luck|fortune|question/)) {
    topic = 'general';
  }
  
  // Hidden insight based on topic
  let hiddenInsight = '';
  if (topic === 'no_contact') {
    hiddenInsight = "The person you're thinking about is also holding something in—they want to reach out but fear is stopping them.";
} else if (topic === 'love') {
    hiddenInsight = "There's emotional vulnerability beneath the surface that neither of you is naming yet.";
} else if (emotion === 'anxious') {
    hiddenInsight = "Your anxiety comes from a deep need for control—but the real answer lies in surrender.";
} else if (emotion === 'confused') {
    hiddenInsight = "You already know the answer, you're just waiting for permission to act on it.";
  }
  
  return { emotion, topic, urgency, hiddenInsight };
}

// ========== VARIATION ENGINE ==========

const OPENINGS = {
  anxious: [
    (name: string) => `${name}, main dekhta hoon ki tumhare andar ek tension hai… jo baar-baar tumhe sochne par majboor kar rahi hai.`,
    (name: string) => `${name}, jo confusion tum feel kar rahe ho… woh bilkul valid hai.`,
    (name: string) => `${name}, thoda darr hai tumme… lekin woh darr tumhe bakwass nahi dikh raha.`,
  ],
  hopeful: [
    (name: string) => `${name}, ek aasha tumme hai jo kabhi nahi maar sakti… aur main woh energy dekh raha hoon.`,
    (name: string) => `${name}, tumhara dil kuch acha soch raha hai… aur universe bhi wahi signal de raha hai.`,
    (name: string) => `${name}, tumhara belief abhi strong hai… use build karte jao.`,
  ],
  confused: [
    (name: string) => `${name}, tumhare question mein kuch clarity missing hai… lekin pattern woh bhi dikh raha hai.`,
    (name: string) => `${name}, jo tum pooch rahe ho… usme pure confusion ke saath ek sahi direction bhi dikh raha hai.`,
    (name: string) => `${name}, tum mentally stuck lag rahe ho… par energy shift ho rahi hai.`,
  ],
  heartbroken: [
    (name: string) => `${name}, main dikh raha hoon ki tumhe kisi se emotional pain ho raha hai… jo tum hide kar rahe ho.`,
    (name: string) => `${name}, tumhara heart sab kuch feel kar raha hai… lekin mind confuse hai.`,
    (name: string) => `${name}, tumhari emotional state thoda fragile hai… par healing bhi start ho rahi hai.`,
  ],
  default: [
    (name: string) => `${name}, jo tum pooch rahe ho… usme ek confusion hai, lekin uske andar ek clear pattern bhi dikh raha hai.`,
    (name: string) => `${name}, tumhare situation mein kuch interesting chal raha hai… jo tum abhi nahi samajh paaye.`,
    (name: string) => `${name}, suno… jo tum dhundh rahe ho woh tumhare aas-paas hai, bas dhyan nahi dekh paaye.`,
  ],
};

const PRESENT_STATES = {
  anxious: [
    "Tumhare liye abhi ek transition phase chal raha hai… jismein uncertainty high hai, lekin control tumhare paas nahi hai.",
    "Energy dikh rahi hai ki tum stress kar rahe ho future ke liye… lekin present mein kuch change nahi ho raha.",
    "Tum soch rahe ho ki kya wrong ho raha hai… par asal mein kuch slow-bright chal raha hai.",
  ],
  hopeful: [
    "Tumhari hope realistic hai… universe tumhare liye opportunities create kar raha hai, bas tumhe sign pakadne honge.",
    "Positive energy tumhare saath hai… lekin patience ki zaroorat hai.",
    "Jo tum chahte ho woh possible hai… lekin timing important hai.",
  ],
  confused: [
    "Tum confused feel kar rahe ho kyunki tum do perspectives beech mein ho… ek emotional, ek logical.",
    "Confusion isiliye hai kyunki tum ek choice nahi kar paa rahe… jo actually dono option acceptable hain.",
    "Tum soch rahe ho ki koi galat ho raha hai… par asal mein tum sirf clarity ko miss kar rahe ho.",
  ],
  heartbroken: [
    "Tum emotionally drained feel kar rahe ho… par heart abhi bhi open hai, jo ek good sign hai.",
    "Pain jo tum feel kar rahe ho… woh processed nahi hua hai, block ho gaya hai.",
    "Tumhara connection broken ho gaya hai… lekin emotional cord abhi bhi connected hai.",
  ],
  default: [
    "Tumhare life mein ek shift aanewala hai… woh sudden nahi, slowly prepare ho raha hai.",
    "Current energy dikh raha hai ki tum ek decision point par ho… jo tumhe zyada sochne wala signal de raha hai.",
    "Situation tumhare liye clear nahi hai… par universe tumhe patterns dikha raha hai, tum bas unhe miss kar rahe ho.",
  ],
};

const PATTERN_INSIGHTS = {
  love: [
    "Yeh pattern isiliye hai kyunki dono ke beech emotional investment unequal hai… ek wait kar raha hai, doosra soch raha hai.",
    "Connection strong hai… lekin communication wahan breakdown ho raha hai jahan dono expect karte hain.",
    "Love woh hai… lekin commitment ka fear dono ke andar chhupa hai.",
  ],
  career: [
    "Professional growth abhi pause par hai… kyunki tum internally change karne ka time le rahe ho.",
    "Work environment toxic lag raha hai… par tum wahan se nikalne ka risk nahi le sakte.",
    "Tum apni skills showcase nahi kar paaye… isliye recognition milna difficult ho raha hai.",
  ],
  finance: [
    "Financial stability chinta ki baat hai… lekin abundance woh tumhare aas-paas hai, bas flow nahi ho raha.",
    "Money issues usually emotional issues ki reflection hoti hain… tum security ke liye struggle kar rahe ho, lekin internally insecure ho.",
    "Wealth creation ka path blocked lag raha hai… par woh resources already tumhare paas hain, bas manage nahi kar paaye.",
  ],
  no_contact: [
    "Silence isiliye hai kyunki woh person bhi confused hai… woh tumse baat karna chahta hai, lekin guilt ya fear rok raha hai.",
    "No contact woh choice nahi hai… woh situation ka outcome hai jismein dono ka ego hurt ho gaya hai.",
    "Person tumhe miss kar raha hai… lekin ego yeh nahi manne dega ki woh pehle contact kare.",
  ],
  default: [
    "Yeh pattern isiliye repeat ho raha hai kyunki tum ek particular lesson seekhne par phase ho… jab tak wo seekh na jaa, woh pattern break nahi karega.",
    "Koi cheez baar-baar waisi hi aa rahi hai… kyunki tum ek wound ko ignore kar rahe ho jo heal nahi hua.",
    "Universe tumhe wahi sign de raha hai… jab tak tum uspar act nahi karoge, woh louder banaiga.",
  ],
};

const FUTURE_FLOW = {
  love: [
    "Aane wale mahine mein clarity aayegi… kyunki planetary position favorable ho rahi hai.",
    "Communication improve hone wala hai… lekin tumhe pehle step lena hoga.",
    "Commitment ka time aa raha hai… lekin patience ke saath.",
  ],
  career: [
    "New opportunity aane wala hai… par tumhe uske liye prepare rehna hoga.",
    "Promotion ya change ka sign aa raha hai… lekin thoda wait karna padega.",
    "Tumhara hard work abhi result nahi de raha… lekin seedha future mein dega.",
  ],
  general: [
    "Energy shift ho raha hai… tumhe next 2-3 mahine mein important signs milenge.",
    "Situation improve hogi… lekin tum apni approach change karoge toh jaldi.",
    "Timing abhi complex hai… par april-se clear ho jaayega.",
  ],
};

const GUIDANCES = {
  patient: [
    "Abhi patience rakhna zaroori hai… rush karne se situation worse ho sakta hai.",
    "Control tumhare paas nahi hai… lekin response tumhare paas hai. Soch samajh karte raho.",
    "Kuch cheezein time ke saath solve hoti hain… abhi force mat karo.",
  ],
  action: [
    "Ab step lena hoga… dar se mat bhaago. First move karo.",
    "Communicate karo… baat karte hi half tension khatam ho jaayegi.",
    "Clear boundaries set karo… woh tumhe peace milega.",
  ],
  reflection: [
    "Apni feelings ko journal karo… woh tumhe clairity dega.",
    "Meditation ya solitude mein time do… answers wahi milenge.",
    "Past patterns ko recognize karo… taki woh future mein repeat na ho.",
  ],
};

const CLOSINGS = [
  "Tum already feel kar rahe ho kya sahi hai… bas ab usse ignore mat karo.",
  "Jo tumhara dil keh raha hai woh… use validate karo. Woh galat nahi hai.",
  "Trust your intuition… woh tumhe wrong nahi dikhayegi.",
  "Ab tumhe apni inner voice sunni hogi… woh tumhare liye best guide hai.",
];

// ========== PHRASE VARIATIONS ==========
// These replace mechanical phrasing

const PHRASE_VARIATIONS = {
  "I see": ["Mujhe lag raha hai", "Mujhe dikh raha hai", "Energy dikh rahi hai", "Signal aa raha hai"],
  "You are": ["Tum ho", "Tumhare andar hai", "Tumhari energy hai"],
  "It seems": ["Lag raha hai", "Dekhne mein aa raha hai", "Feeling aa raha hai"],
  "The cards indicate": ["Cards kehte hain", "Energy bat rahi hai", "Pattern dikh raha hai"],
  "You should": ["Tumhe karna chahiye", "Best rahega ki", "Aage badhne ke liye"],
  "Because": ["Kyunki", "Isliye ki", "Us baat ke baad ki"],
};

function varyPhrase(text: string): string {
  let result = text;
  Object.entries(PHRASE_VARIATIONS).forEach(([original, alternatives]) => {
    alternatives.forEach(alt => {
      result = result.replace(new RegExp(original, 'gi'), alt);
    });
  });
  return result;
}

// ========== CARD INTERPRETATION ==========

function interpretCardInContext(card: SelectedCard, context: ReadingContext): string {
  const { card: cardData, position, isReversed } = card;
  const orientation = isReversed ? ' (Reversed)' : '';
  const meaning = isReversed ? cardData.reversed : cardData.upright;

  // Use the new card-specific interpretation engine
  const interpretation = getCardInterpretation(
    cardData,
    position,
    context.topic as any,
    context.emotion
  );

  // Add orientation note if reversed
  const orientationNote = isReversed
    ? `\n\n**Reversed meaning:** Card ki energy abhi distorted hai ya internalized. ${cardData.reversed}`
    : '';

  return `${interpretation}\n\n**What this card says now:** ${meaning}${orientationNote}`;
}

// ========== MAIN READING GENERATOR ==========

export interface HumanizedReading {
  opening: string;
  presentEnergy: string;
  underlyingPattern: string;
  direction: string;
  guidance: string;
  closing: string;
  cardInterpretations: string[];
}

export function generateHumanizedReading(
  context: ReadingContext,
  selectedCards: SelectedCard[]
): HumanizedReading {
  // Select opening based on emotion
  const openingPool = OPENINGS[context.emotion] || OPENINGS.default;
  const opening = openingPool[Math.floor(Math.random() * openingPool.length)](context.name);
  
  // Present energy
  const presentPool = PRESENT_STATES[context.emotion] || PRESENT_STATES.default;
  const presentEnergy = presentPool[Math.floor(Math.random() * presentPool.length)];
  
  // Underlying pattern
  const patternPool = PATTERN_INSIGHTS[context.topic] || PATTERN_INSIGHTS.default;
  const underlyingPattern = patternPool[Math.floor(Math.random() * patternPool.length)];
  
  // Future direction
  const directionPool = FUTURE_FLOW[context.topic] || FUTURE_FLOW.general;
  const direction = directionPool[Math.floor(Math.random() * directionPool.length)];
  
  // Guidance
  let guidancePool: string[];
  if (context.emotion === 'anxious' || context.emotion === 'stuck') {
    guidancePool = GUIDANCES.reflection;
  } else if (context.urgency === 'high') {
    guidancePool = GUIDANCES.action;
  } else {
    guidancePool = GUIDANCES.patient;
  }
  const guidance = guidancePool[Math.floor(Math.random() * guidancePool.length)];
  
  // Closing
  const closing = CLOSINGS[Math.floor(Math.random() * CLOSINGS.length)];
  
  // Card interpretations (3 cards)
  const cardInterpretations = selectedCards.map(sc => 
    interpretCardInContext(sc, context)
  );
  
  return {
    opening: varyPhrase(opening),
    presentEnergy: varyPhrase(presentEnergy),
    underlyingPattern: varyPhrase(underlyingPattern),
    direction: varyPhrase(direction),
    guidance: varyPhrase(guidance),
    closing: varyPhrase(closing),
    cardInterpretations: cardInterpretations.map(varyPhrase),
  };
}

// ========== STREAMING FORMATTER ==========

export function formatReadingForStream(reading: HumanizedReading): string[] {
  const sections: string[] = [];
  
  // Opening hook
  sections.push(reading.opening);
  sections.push(''); // pause
  
  // Present energy
  sections.push('Jo tumhare liye abhi chal raha hai woh yeh hai:');
  sections.push(reading.presentEnergy);
  sections.push('');
  
  // Card interpretations (interleaved)
  sections.push('Tumhare cards yeh keh rahe hain:');
  reading.cardInterpretations.forEach((interp, idx) => {
    sections.push(`\n${interp}`);
    if (idx < reading.cardInterpretations.length - 1) {
      sections.push(''); // pause between cards
    }
  });
  
  sections.push(''); // major pause
  
  // Underlying pattern
  sections.push('Iske pichhe jo pattern hai woh yeh hai:');
  sections.push(reading.underlyingPattern);
  sections.push('');
  
  // Direction
  sections.push('Aage kya jaane wala hai:');
  sections.push(reading.direction);
  sections.push('');
  
  // Guidance
  sections.push('Ab tum kya karte ho:');
  sections.push(reading.guidance);
  sections.push('');
  
  // Closing
  sections.push(reading.closing);
  
  return sections;
}

// ========== FULL OUTPUT GENERATOR ==========

export function createFullReadingOutput(
  name: string,
  question: string,
  selectedCards: SelectedCard[]
): string {
  const context = analyzeQuestion(question);
  context.name = name;
  
  const humanized = generateHumanizedReading(context, selectedCards);
  
  const sections = formatReadingForStream(humanized);
  return sections.join('\n\n');
}
