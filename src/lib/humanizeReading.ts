import { SelectedCard } from './tarot/logic';
import { DomainAnalysis } from './cardEngine';

export interface ReadingContext {
  emotion: string;
  topic: string;
  urgency: 'low' | 'medium' | 'high';
  hiddenInsight: string;
  question: string;
  name: string;
}

export interface UnifiedReading {
  fullNarrative: string;
}

function analyzeQuestion(question: string): Omit<ReadingContext, 'name'> {
  const lowerQ = question.toLowerCase();
  
  let emotion = 'neutral';
  let urgency: 'low' | 'medium' | 'high' = 'medium';
  
  if (lowerQ.match(/worried|stress|nervous|uncertain|afraid|fear|scared|anxious|darr|ghabrat|tense/)) {
    emotion = 'anxious';
    urgency = 'high';
  } else if (lowerQ.match(/hope|wish|positive|good|better|dream|want|hope|ishq|pyar|excited/)) {
    emotion = 'hopeful';
    urgency = 'low';
  } else if (lowerQ.match(/confused|lost|direction|don't know|what should|samajh|kya|paresh|unclear/)) {
    emotion = 'confused';
    urgency = 'high';
  } else if (lowerQ.match(/hurt|pain|broken|miss|heart|sad|grief|breakup|dard|ache/)) {
    emotion = 'heartbroken';
    urgency = 'high';
  } else if (lowerQ.match(/stuck|blocked|can't|repetitive|going in circles|atka|jad|stop/)) {
    emotion = 'stuck';
    urgency = 'medium';
  } else if (lowerQ.match(/will|determined|must|need to|try|fight|strong|resolve/)) {
    emotion = 'determined';
    urgency = 'low';
  }
  
  let topic = 'general';
  if (lowerQ.match(/love|relationship|partner|boyfriend|girlfriend|ex|heart|romance|marriage|shaadi|pyaar|uska|unka/)) {
    topic = 'love';
  } else if (lowerQ.match(/career|job|work|boss|colleague|promotion|salary|business|kaam|office/)) {
    topic = 'career';
  } else if (lowerQ.match(/money|financial|rich|debt|invest|wealth|finance|paise|financial/)) {
    topic = 'finance';
  } else if (lowerQ.match(/no contact|hasn't reached|not talking|silence|blocked|waiting|block|answer|call|message/)) {
    topic = 'no_contact';
  }
  
  let hiddenInsight = '';
  if (topic === 'no_contact') {
    hiddenInsight = "woh insaan bhi internally confuse hai—unhe tumse baat karni hai, lekin koi element unhe rok raha hai.";
  } else if (topic === 'love') {
    hiddenInsight = "Dekho, ek emotional vulnerability hai jo surface par naam nahi ho raha.";
  } else if (emotion === 'anxious') {
    hiddenInsight = "Tumhara tension actually control ki khoj se aata hai—par asli answer surrender mein hai.";
  } else if (emotion === 'confused') {
    hiddenInsight = "Tum already jaante ho answer, bas action lene ki permission ka intezar kar rahe ho.";
  }
  
  return { emotion, topic, urgency, hiddenInsight, question };
}

const UNIFIED_OPENINGS: Record<string, ((name: string, topic: string) => string)[]> = {
  anxious: [
    (name) => `${name}, jo bhaavana tumhare andar chal rahi hai—woh bilkul valid hai. Dekho, tension ka maanna hi usse solve karne ka pehla kadam hai.`,
    (name, topic) => `${name}, main dekh raha hoon ki is situation mein tum ekdum tense ho—aur yeh feeling galat nahi hai.`,
    (name) => `${name}, thoda sa ghabrahat hai jo baar-baar wapas aata hai, aur main samajh sakta hoon ki kyun.`,
  ],
  hopeful: [
    (name) => `${name}, ek aasha hai jo abhi tumhare andar quiet si jagah bhar rahi hai—aur woh bohot powerful hai.`,
    (name, topic) => `${name}, jo ummeed tumhara dil kar raha hai woh bilkul sahi hai. Universe tumhare saath hai.`,
    (name) => `${name}, maine jo energy dekhi hai woh positive hai—tum kuch strong create kar rahe ho.`,
  ],
  confused: [
    (name) => `${name}, jo sawaal tumhare mind mein ghum raha hai—woh confusion bilkul natural hai.`,
    (name, topic) => `${name}, tumhe lag raha hai ki kuch khaali hai, lekin woh khaali actually ek space hai jahan se clarity aayegi.`,
    (name) => `${name}, tum mentally do Tarafon beech fas gaye ho—aur yeh samajhna mushkil hai.`,
  ],
  heartbroken: [
    (name) => `${name}, jo dard ho raha hai woh bahar dikh raha hai—lekin main dekh sakta hoon ki andar kai cheezein hain jo abhi bhi alive hain.`,
    (name, topic) => `${name}, tumhara dil tod gaya hai, aur main yeh bolne mein kurur nahi kehta ki yeh chhota masla hai—yeh bada sa hai.`,
    (name) => `${name}, jo hurt tum feel kar rahe ho woh bilkul original hai. Aur main yeh bhi dekh raha hoon ki healing shuru hone lagi hai.`,
  ],
  stuck: [
    (name) => `${name}, tumhe lag raha hai ki kuch atak gaya hai—aur woh feeling bilkul valid hai.`,
    (name, topic) => `${name}, ek jaise chal raha hai, ek jaise tham gaya—par woh thamana temporary hai.`,
    (name) => `${name}, main samajh sakta hoon ki frustration ho raha hai jab sab kuch waisa hi circle karta dikhe.`,
  ],
  default: [
    (name, topic) => `${name}, jo tum pooch rahe ho usme ek pattern dikh raha hai jo main detail mein batata hoon.`,
    (name) => `${name}, dekho jo situation tumhare aage hai woh simple nahi hai, lekin complicated bhi nahi hai.`,
    (name) => `${name}, ek baat hai jo clearly dikh rahi hai—tumhe patience ki zaroorat hai aur action ki bhi.`,
  ],
};

const UNIFIED_PATTERNS: Record<string, string[]> = {
  love: [
    "Yeh pattern isiliye hai kyunki emotional investment ke dono taraf balance nahi hai—ek intezaar kar raha hai, doosra soch raha hai.",
    "Connection strong hai—lekin wahan communication mein kuch fault aa gaya hai jahan expectations clash karte hain.",
    "Pyaar mojud hai—lekin commitment ka dar internal level par dono ke andar chhupa hai.",
  ],
  no_contact: [
    "Silence ka karan yeh hai ki woh insaan bhi internally confused hai—unhe baat karni hai, lekin guilt ya fear unhe rok raha hai.",
    "No contact ek choice nahi, ek outcome hai jismein ego hurt hoke shut ho gaya.",
    "Woh insaan tumhe miss kar raha hai—lekin unki ego unhe allow nahi karegi pehle move karne ki.",
  ],
  career: [
    "Professional growth ruka hua hai kyunki internally transition ka time le rahe ho—ek inner shift hone ko hai.",
    "Work environment se related tension hai—par wahan se nikalne ka energy abhi allow nahi kar raha.",
    "Tum apni value show nahi kar paa rahe—isse recognition milna mushkil ho raha hai.",
  ],
  finance: [
    "Financial stability ek concern hai—lekin abundance tumhare aas-paas hai, bas flow block hai.",
    "Money issues emotional issues ki reflection hain—tum externally secure hone ke liye struggle kar rahe ho, lekin internally uncertain ho.",
    "Wealth creation ka rasta dikha raha hai blocked—lekin resources already mojud hain, bas management focus chahiye.",
  ],
  default: [
    "Yeh pattern repeat ho raha hai kyunki tum ek particular lesson seekhne ke phase mein ho—woh lesson complete hone do toh pattern break ho.",
    "Koi cheez baar-baar waisi hi aati hai kyunki tum ek purani wound ignore kar rahe ho jo heal nahi hua.",
    "Universe tumhe same signal bhej raha hai—jab tak act nahi karoge, woh louder hota jayega.",
  ],
};

function getUnifiedGuidance(emotion: string, topic: string, urgency: string): string {
  if (emotion === 'anxious' || emotion === 'confused') {
    return [
      "Thoda sa back le aur socho—jo answer tum dhundh rahe ho woh already tumhare andar kai stage par mojud hai.",
      "Ek chhota sa break lo—jismein sirf observation karna hai, koi decision nahi.",
      "Apni feelings ko ek jagah likh do—clarity wahan se aayegi.",
    ][Math.floor(Math.random() * 3)];
  }
  
  if (emotion === 'heartbroken') {
    return [
      "Apne dard ko feel karne do—suppress mat karo, woh emotion valid hai.",
      "Healing time leti hai—lekin woh time khud lenge toh healing hogi bhi.",
      "Ek chhota sa distance lo jahan sirf self ki care ho.",
    ][Math.floor(Math.random() * 3)];
  }
  
  if (emotion === 'stuck') {
    return [
      "Pattern todne ke liye small shift chahiye—woh shift internally se shuru hoti hai.",
      "Kuch naya try karo—jo bilkul bhi different ho, small bhi ho sakta hai.",
      "Comfort zone se thoda bahar step karo—wahan se hi naya aayega.",
    ][Math.floor(Math.random() * 3)];
  }
  
  if (urgency === 'high' && topic !== 'finance') {
    return [
      "Ab kuch karne ka waqt aa gaya hai—lekin soch samajh ke karo.",
      "Pehla step uthao—bas pehla step, baki apne aap set ho jayega.",
      "Baat karo—kyunki communication hi situation solve kar sakti hai.",
    ][Math.floor(Math.random() * 3)];
  }
  
  return [
    "Rush mat karo—sab kuch apni timing par set hoga.",
    "Abhi jo kar rahe ho woh continue raho—universe tumhare saath hai.",
    "Jeetne ke liye patience chahiye—aur woh tumhare paas hai.",
  ][Math.floor(Math.random() * 3)];
}

function getUnifiedClosing(emotion: string): string {
  const closings: Record<string, string[]> = {
    anxious: [
      "Tum already jo feel kar rahe ho woh sahi hai—bas uspar trust karo.",
      "Jo intuition chal raha hai woh bilkul sahi hai, ignore mat karo.",
      "Tumhe jo dikh raha hai woh bilkul right hai.",
    ],
    hopeful: [
      "Yeh aasha rakhoge toh sab kuch mil jayega—bas continue raho.",
      "Tum strong ho aur universe tumhare saath hai.",
      "Jo achai lag rahi hai woh sahi direction hai.",
    ],
    confused: [
      "Jo dil keh raha hai woh sahi hai—use ignore mat karo.",
      "Clarity time par aayegi, lekin tumhe chahhiye wait karna.",
      "Answer already tumhare paas hai—bas thoda silence chahiye.",
    ],
    heartbroken: [
      "Dard valid hai—aur processing ke liye time lena bhi valid hai.",
      "Tum healing ke raaste par ho—har chhota step important hai.",
      "Jo hoya woh justify hai—lekin aage kaafi kuch hai.",
    ],
    stuck: [
      "Break ke liye ready hona ek achievement hai.",
      "Small step bhi bahut bada change la sakta hai.",
      "Tum soch se aage nikal sakte ho.",
    ],
    default: [
      "Tum jaante ho kya sahi hai—bas usse ignore mat karo.",
      "Jo inner voice keh raha hai woh bilkul sahi hai.",
      "Trust your gut—woh tumhe khaali nahi le jayegi.",
    ],
  };
  
  const pool = closings[emotion] || closings.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getHiddenPattern(emotion: string, topic: string): string {
  const patterns: Record<string, string[]> = {
    love: [
      "Dekho, love wohinsaan ke andar ek vulnerability create karta hai jo baar baar protect mode activate karta hai.",
      "Jo attraction hai woh bohot real hai—lekin expression abhi nahi ho raha kyunki fear hai.",
      "Emotional intimacy ka dar actual closeness se pehle hi shuru ho jata hai.",
    ],
    no_contact: [
      "Yeh gap isiliye bada ho gaya kyunki ego ne communication block kar diya—aur dono side se.",
      "Koi bhi pehle baat nahi karna chah raha kyunki rejection ka dar hai.",
      "Dono internally ready hain, lekin external par koi move nahi kar raha.",
    ],
    career: [
      "Professional insecurity baar-baar same situation create karti hai.",
      "Growth opportunity aati hai, lekin self-doubt unhe redirect kar deta hai.",
      "Ambition hai, par fear hai ki kya hoga agar attempt fail hua.",
    ],
    finance: [
      "Financial mindset se decisions baar-baar waisi hi hoti hain.",
      "Scarcity mindset abunndance ko block kar rahi hai.",
      "Internal worthlessness ki feeling external finances ko affect karti hai.",
    ],
    default: [
      "Ek cycle hai jo repeat ho raha hai—woh cycle detect karna important hai.",
      "Universe same lesson baar-baar repeat kar raha hai.",
      "Ek purani pattern abhi bhi active hai jo current situation ko affect kar rahi hai.",
    ],
  };
  
  const pool = patterns[topic] || patterns.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getDirection(topic: string): string {
  const directions: Record<string, string[]> = {
    love: [
      "Aane wale waqt mein clarity aane wali hai— Communication improve hogi aur situation clear hogi.",
      "Commitment ka signal aa raha hai—lekin patience essential hai.",
      "Emotional connection deeper hone wala hai, lekin ek step change zaroori hai.",
    ],
    no_contact: [
      "Next few weeks mein ek opening aayegi—lekin woh open hongi tabhi jab ego kamzor ho.",
      "Connection restore ho sakta hai, lekin first move important hoga.",
      "Silence tootne wali hai—par woh aapne aap nahi tootegi.",
    ],
    career: [
      "New opportunity approach kar rahi hai—prepare rehna zaroori hai.",
      "Change ka signal aa raha hai—lekin thoda wait important hai.",
      "Tumara hard work result dene wala hai, timing favourable hai.",
    ],
    finance: [
      "Financial situation improve hogi—bas flow establish karne ki zarurat hai.",
      "Abundance ki direction visible hai—lekin action chahiye.",
      "Money situation better hone wali hai—lekin mindset shift chahiye.",
    ],
    default: [
      "Energy shift ho raha hai—next few weeks important hain.",
      "Situation improve hogi—agar tum apni approach change karoge.",
      "Timing favorable ho rahi hai—lekin主动权 tumhare paas hai.",
    ],
  };
  
  const pool = directions[topic] || directions.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getSituationMerge(emotion: string, topic: string): string {
  const situations: Record<string, string[]> = {
    anxious: [
      "Tum ek aise transition phase mein ho jahan uncertainty high hai—lekin control actually tumhare paas bahar hai.",
      "Jo stress feel kar rahe ho woh genuine hai—future ki khoj mein present tension badh raha hai.",
      "Baar-baar wahi soch aati hai—aur yeh calm interfere kar raha hai.",
    ],
    hopeful: [
      "Universe tumhare liye kuch plan kar raha hai—positive vibes strong hain.",
      "Jo ummeed hai woh realistic hai—opportunities create ho rahe hain.",
      "Tum movement ki edge par ho—bas step lene ki jrurat hai.",
    ],
    confused: [
      "Tum do options ke beech phas gaye ho—aur donon valid hain.",
      "Clarity isiliye nahi hai kyunki tum ek choice nahi kar paa rahe.",
      "Mind aur heart disagree kar rahe hain—aur yeh tension create kar raha hai.",
    ],
    heartbroken: [
      "Tum emotional damage ke baad apni value define karne ki koshish kar rahe ho.",
      "Connection toota, lekin emotional cord abhi bhi alive hai.",
      "Dard ke baad trust rebuild karna mushkil hai—aur time chahiye.",
    ],
    stuck: [
      "Tum ek repetitive loop mein ho jo bahar se same dikh raha hai.",
      "Growth ruka hua hai kyunki tum internally ready nahi ho.",
      "Pattern break hone ko hai, lekin first push chahiye.",
    ],
    default: [
      "Life ek transition point par hai—jo decision important hai.",
      "Jo situaton hai woh temporary hai—lekin choices permanent hain.",
      "Ek shift hone wali hai—aur woh shifts defining honge.",
    ],
  };
  
  const pool = situations[emotion] || situations.default;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function createUnifiedReading(
  name: string,
  question: string,
  selectedCards: SelectedCard[]
): UnifiedReading {
  const context = analyzeQuestion(question) as ReadingContext;
  context.name = name;
  
  const openingPool = UNIFIED_OPENINGS[context.emotion] || UNIFIED_OPENINGS.default;
  const opening = openingPool[Math.floor(Math.random() * openingPool.length)](name, context.topic);
  
  const situation = getSituationMerge(context.emotion, context.topic);
  
  const pattern = getHiddenPattern(context.emotion, context.topic);
  
  const direction = getDirection(context.topic);
  
  const guidance = getUnifiedGuidance(context.emotion, context.topic, context.urgency);
  
  const closing = getUnifiedClosing(context.emotion);
  
  const fullNarrative = `${opening} ${situation} ${pattern} ${direction} ${guidance} ${closing}`;
  
  return { fullNarrative };
}

export function createFullReadingOutput(
  name: string,
  question: string,
  selectedCards: SelectedCard[]
): string {
  const reading = createUnifiedReading(name, question, selectedCards);
  return reading.fullNarrative;
}

// ========== LEGACY COMPATIBILITY FUNCTIONS ==========

export interface HumanizedReading {
  opening: string;
  presentEnergy: string;
  underlyingPattern: string;
  direction: string;
  guidance: string;
  closing: string;
  cardInterpretations: string[];
}

export function createContextFromAnalysis(
  analysis: DomainAnalysis,
  question: string,
  name: string
): ReadingContext {
  const urgencyMap: Record<string, 'low' | 'medium' | 'high'> = {
    anxious: 'high',
    hopeful: 'low',
    confused: 'high',
    heartbroken: 'high',
    stuck: 'medium',
    determined: 'low',
    neutral: 'medium',
  };

  let hiddenInsight = '';
  if (analysis.primaryDomain === 'conflict' || analysis.primaryDomain === 'no_contact') {
    hiddenInsight = "woh insaan bhi internally confuse hai—unhe tumse baat karni hai, lekin koi element unhe rok raha hai.";
  } else if (analysis.primaryDomain === 'love') {
    hiddenInsight = "Dekho, ek emotional vulnerability hai jo surface par naam nahi ho raha.";
  } else if (analysis.emotionalTone === 'anxious') {
    hiddenInsight = "Tumhara tension actually control ki khoj se aata hai—par asli answer surrender mein hai.";
  } else if (analysis.emotionalTone === 'confused') {
    hiddenInsight = "Tum already jaante ho answer, bas action lene ki permission ka intezar kar rahe ho.";
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

function getCardInterpretation(card: SelectedCard): string {
  const { card: cardData, isReversed } = card;
  const meaning = isReversed ? cardData.reversed : cardData.upright;
  return meaning;
}

export function generateHumanizedReading(
  context: ReadingContext,
  selectedCards: SelectedCard[]
): HumanizedReading {
  const openingPool = UNIFIED_OPENINGS[context.emotion] || UNIFIED_OPENINGS.default;
  const opening = openingPool[Math.floor(Math.random() * openingPool.length)](context.name, context.topic);
  
  const situation = getSituationMerge(context.emotion, context.topic);
  const pattern = getHiddenPattern(context.emotion, context.topic);
  const direction = getDirection(context.topic);
  const guidance = getUnifiedGuidance(context.emotion, context.topic, context.urgency);
  const closing = getUnifiedClosing(context.emotion);
  
  const cardInterpretations = selectedCards.map(card => getCardInterpretation(card));
  
  return {
    opening,
    presentEnergy: situation,
    underlyingPattern: pattern,
    direction,
    guidance,
    closing,
    cardInterpretations,
  };
}