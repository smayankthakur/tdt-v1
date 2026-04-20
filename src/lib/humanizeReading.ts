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

const GREETINGS: Record<string, string[]> = {
  anxious: ["{name}, ek baat clearly dikh rahi hai…", "{name}, suno…", "{name}, thoda deep focus kar raha hoon…", "Hey {name}…"],
  hopeful: ["{name}, kuch interesting aa raha hai…", "{name}, suno jo dikh raha hai…", "Hey {name}, positive energy strong hai…"],
  confused: ["{name}, ek pattern dikh raha hai…", "{name}, suno…", "Hey {name}, thoda complicated hai par samajh jaoge…"],
  heartbroken: ["{name}, pehle yeh suno…", "{name}, kuch important bata raha hoon…", "Hey {name}…"],
  stuck: ["{name}, dekho jo dikh raha hai…", "{name}, samajh jaoge…", "Hey {name}, ek baat hai…"],
  default: ["{name}, suno jo dikh raha hai…", "{name}, ek important baat…", "Hey {name}…"],
};

const SITUATION_MERGE: Record<string, Record<string, string[]>> = {
  anxious: {
    love: [
      "Tum ek aise moment par ho jahan dil baar-baar wahi sochata hai—aur woh soch bilkul real hai. Jo tension feel kar rahe ho woh isliye hai kyunki tumhe actually matter karta hai, lekin kuch uncertainty hai jo mind ko ghumati hai.",
      "Is situation mein tumhara dil aur dimaag dono alag baatein keh rahe hain, aur woh conflict thoda tiring ho sakta hai. Lekin suno—yeh confusion actually tumhe guide kar rahi hai.",
    ],
    no_contact: [
      "Jo baar-baar wapas aata hai woh sirf soch nahi hai—woh ek zaroorat hai jo tumhare andar se hoti hai. Silence ko interpret karne ki koshish mat karo, woh sirf silence hai.",
      "Tension hai kyunki tumhe lagta hai kuch baat honi chahiye thi, lekin nahi hui. Aur woh perfectly valid hai.",
    ],
    career: [
      "Tumhara mind baar-baar same cheez par aa raha hai aur woh thoda exhausting ho sakta hai. Lekin woh pressure actually tumhe kuch important batana chahta hai.",
      "Career mein jo uncertainty feel ho rahi hai woh genuine hai—kyunki tum actually kuch better chahte ho, aur woh ambition galat nahi hai.",
    ],
    finance: [
      "Financial tension jo feel ho rahi hai woh sirf numbers ka nahi, emoshan ka matter hai. Tum secure feel karna chahte ho aur woh bilkul sahi hai.",
      "Paise ki chinta tumhe baar-baar dikhti hai, par woh actually tumhari priorities ke baare mein kuch keh rahi hai.",
    ],
    default: [
      "Jo baar-baar baat aa rahi hai woh sirf random nahi hai—tumhara inner voice hai jo direction maang raha hai.",
      "Thoda complicated feel ho sakta hai, par dekho, jo dikh raha hai woh ultimately tumhare best ke liye hai.",
    ],
  },
  heartbroken: {
    love: [
      "Dard hai, aur main bolne mein nahi kurur ki woh chhota hai—woh bilkul bada hai. Lekin suno, dard ke saath kuch cheezein bhi hain jo abhi alive hain aur unhe ignore mat karo.",
      "Tumhara dil tootne ke baad bhi kuch feel kar raha hai, aur woh kuch galat nahi hai. Woh feeling valid hai.",
    ],
    no_contact: [
      "Jo silence hai woh sirf communication ka nahi, emotions ka bhi gap hai. Tumhe miss karna, woh normal hai.",
      "Tumhe lag sakta hai ki sab khatam ho gaya, lekin emotions kabhi khatam nahi hote—woh bas transform hote hain.",
    ],
    default: [
      "Jo hurt hai woh bilkul original hai—aur healing ke saath woh kam hoga, lekin uske liye time chahiye.",
      "Dard ko feel karne do, suppress mat karo. Woh tumhe weak nahi, strong banayega.",
    ],
  },
  confused: {
    love: [
      "Tum do Tarafon beech fas gaye ho aur donon ka perspective valid hai. Mind keh raha hai ek aur dil keh raha hai doosra—aur yeh tension samajhna mushkil hai.",
      "Clarity isiliye nahi aa rahi kyunki actually donon options mein kuch na kuch hai jo tumhe attract kar raha hai.",
    ],
    career: [
      "Do paths dikh rahe hain aur dono promising hain—lekin choice karna mushkil ho raha hai. Yeh samajhna normal hai.",
      "Koi wrong answer nahi hai yahan, bas different priorities hain aur woh decide karna hai ki abhi kya zyada matter karta hai.",
    ],
    default: [
      "Mind mein ek tola baat ghum rahi hai jo clearly jagah nahi kar paa rahi—aur woh perfectly normal hai.",
      "Tumhe lag sakta hai ki kuch important missing hai, par woh missing actually ek space hai jahan se clarity aayegi.",
    ],
  },
  stuck: {
    love: [
      "Lagega ki sab kuch same repea ho raha hai—ek jaise loop mein ho. Aur yeh frustrating hai, main samajh sakta hoon.",
      "Har baar wahi situation, wahi feelings, wahi soch—lekin suno, is pattern ka karan hai, aur woh samajhna important hai.",
    ],
    career: [
      "Growth ruka hua feel ho raha hai—kaam ho raha hai lekin kuch missing hai. Aur woh missing tumhe bhi pata hai.",
      "Same cycle mein ho—jahan se dekho wahi wall dikh rahi hai. Par wall aagay jaane ka rasta bhi dikha rahi hai.",
    ],
    default: [
      "Ek jaise hi chal raha hai aur tum thak gaye ho ismein—lekin yeh temporary hai, shift aane wali hai.",
      "Same pattern baar-baar wapas aata hai, aur tumhe samajh aa gaya hai ki kuch change chahiye.",
    ],
  },
  hopeful: {
    love: [
      "Kuch strong aa raha hai jo tumhe feel karaya jaa raha hai—aur woh bilkul sahi hai. Positive energy kaafi powerful hoti hai.",
      "Universe kuch plan kar raha hai, aur tumhara dil thoda confident hai uske baare mein.",
    ],
    career: [
      "Naya opportunity dikh rahi hai aur tum ready ho feel kar rahe ho—yeh perfect hai.",
      "Abhi jo growth feel ho rahi hai woh real hai aur woh aage aur bhi strong hogi.",
    ],
    default: [
      "Positive energy strong hai aur kuch achai hone wali hai—bas uske liye ready raho.",
      "Jo aasha hai woh realistic hai, aur tumhara instinct sahi hai.",
    ],
  },
  default: {
    love: [
      "Jo situation hai woh samajhna zaroori hai kyunki emotions involved hain—lekin overall picture positive dikh raha hai.",
      "Tumhara emotional investment clearly dikh raha hai aur woh tumhe guide kar raha hai.",
    ],
    no_contact: [
      "Silence ka matlab abhi kuch nahi, lekin future mein clarity aayegi—bas patience rakhna hai.",
      "Dono taraf se confusion hai, par ultimately communication sab solve karegi.",
    ],
    default: [
      "Jo dikh raha hai woh clearly woh nahi jo tum soch rahe the—lekin better hai.",
      "Ek shift hone wali hai, aur woh tumhare liye beneficial hai.",
    ],
  },
};

const PSYCHOLOGICAL_PATTERNS: Record<string, string[]> = {
  love: [
    "Aur dekho iske peeche ki kahani—tumhara dil protect mode mein hai kyunki pehle hurt hue ho, isliye abhi trust dena mushkil ho raha hai.",
    "Emotional vulnerability ko accept karna hi asli intimacy ki taraf pehla step hai.",
    "Koi baar baar wahi attracts karta hai kyunki unconsciously woh comfort zone hai—par real growth bahar se aati hai.",
  ],
  no_contact: [
    "Silence isiliye hai kyunki ego ne dara kar communication block kar diya hai—aur dono taraf se.",
    "Dono internally ready hain par koi pehle baat karna nahi chah raha—rejection ka dar hai.",
    "Communication break matlab attachment break nahi—woh bas emotional expression ka break tha.",
  ],
  career: [
    "Professional insecurity ek cycle create karti hai jo same situation ko baar-baar laata hai.",
    "Self-doubt growth opportunities ko redirect kar deta hai, jabki capability hai.",
    "Fear of failure actually tumhe safe rakhta hai, par safe rehna future nahi banayega.",
  ],
  finance: [
    "Scarcity mindset abundance ko block karta hai—lekin real issue internal worthiness hai.",
    "Money decisions actually emotional decisions ki reflection hain.",
    "Financial tension actually tumhe redirect kar raha hai ki kahi aur focus karo.",
  ],
  default: [
    "Ek cycle repeat ho rahi hai kyunki tum kuch important seekh rahe ho—woh lesson complete karo.",
    "Universe same signal baar-baar bhej raha hai—tab tak louder hota jayega jab tak act nahi karoge.",
    "Ek purani wound hai jo heal nahi hui—woh addressed karna zaroori hai.",
  ],
};

const FUTURE_DIRECTION: Record<string, string[]> = {
  love: [
    "Aane wale waqt mein kuch clarity aane wali hai—agar communication improve kiya, toh situation better hogi.",
    "Emotional depth increase hone wali hai—lekin ek chhota sa step lena hoga tumhe.",
    "Timing abhi perfect nahi hai, lekin next few weeks important hain.",
  ],
  no_contact: [
    "Silence tootne wali hai—lekin pehle ek ko ego kamzor karna padega.",
    "Ek opening aayegi, lekin woh tabhi kaam karegi jab genuine intent ho.",
    "Dono taraf se readiness badhegi—bas timing important hai.",
  ],
  career: [
    "New opportunity approach kar rahi hai—prepared rehna zaroori hai.",
    "Growth ka signal aa raha hai, lekin thoda wait karna pad sakta hai.",
    "Hard work results dene wala hai—timing favorable ho rahi hai.",
  ],
  finance: [
    "Financial flow establish hone wali hai—bas mindset change chahiye.",
    "Abundance ki direction visible hai—lekin consistent effort zaroori hai.",
    "Situation improve hogi, bas temporarily patience rakhna padega.",
  ],
  default: [
    "Energy shifting ho rahi hai—next few weeks important honge.",
    "Situation improve hogi—agar approach change kiya.",
    "Timing favorable ho rahi hai—bas initiative lo.",
  ],
};

const ACTIONABLE_GUIDANCE: Record<string, string[]> = {
  anxious: [
    "Thoda sa back le aur observe karo—koi decision abhi mat karo, bas feel karo.",
    "Ek chhota sa break lo jahan sirf tumho—iska matlab apni care karna hai.",
    "Jo baat baar aa rahi hai woh important hai, note karo aur phir socho.",
  ],
  heartbroken: [
    "Dard ko feel karne do—suppress mat karo, woh valid emotion hai.",
    "Ek chhota sa distance lo jahan sirf self-care ho—healing khud aayegi.",
    "Support lo—kisi close se baat karo, share karo.",
  ],
  confused: [
    "Mind aur heart ko ek jagah laane ke liye likh do—clarity likhne se aati hai.",
    "Dono options ke pros and cons likho—lekin decision ke liye ek din rakh do.",
    "Intuition pe trust karo—jo pehle feel hota hai woh often sahi hota hai.",
  ],
  stuck: [
    "Small shift se shuru karo—jo bilkul different ho, small bhi ho sakta hai.",
    "Comfort zone se thoda bahar step lo—wahi se growth start hoti hai.",
    "Kuch naya try karo jo kabhi nahi kiya—novelty se pattern tod sakte ho.",
  ],
  hopeful: [
    "Jo positive feel ho raha hai woh rakho—bas is par constructively kaam karo.",
    "Opportunity aane wali hai, ready raho aur confident bhi.",
    "Continue karo jo kar rahe ho—results aane wale hain.",
  ],
  default: [
    "Pehla step uthao—bas pehla step, baki apne aap set hoga.",
    "Baat karo—communication hi zyada ka sudhaar sakti hai.",
    "Rush mat karo—sab apni timing par set hoga.",
  ],
};

const POWERFUL_CLOSINGS: Record<string, string[]> = {
  anxious: [
    "Tum already jaante ho kya sahi hai—bas is baar apni intuition pe trust karo.",
    "Jo feel kar rahe ho woh bilkul sahi hai, ignore mat karo.",
    "Tumhe dikh raha hai woh right hai.",
  ],
  heartbroken: [
    "Healing ke raaste par ho—har step important hai, har chhota bhi.",
    "Dard valid hai, par aage kai beautiful cheezein hain jo wait karti hain.",
    "Tum strong ho—tum recover kar lenge.",
  ],
  confused: [
    "Jo dil keh raha hai woh sahi hai—use ignore mat karo.",
    "Clarity aayegi, bas patience rakhna padega.",
    "Answer tumhare paas hai—bas thoda trust chahiye.",
  ],
  stuck: [
    "Break lena ek achievement hai—usse celebrate karo.",
    "Small step bhi bahut bada change la sakta hai.",
    "Tum soch se aage nikal sakte ho—tumhara potential hai.",
  ],
  hopeful: [
    "Universe tumhare saath hai—bas continue raho.",
    "Jo positive direction dikh rahi hai woh sahi hai.",
    "Tum strong ho aur kuch achai hone wala hai.",
  ],
  default: [
    "Tum jaante ho kya sahi hai—bas usse follow karo.",
    "Inner voice pe trust karo—woh khaali nahi le jayega.",
    "Jo feel ho raha hai woh sahi hai.",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function createUnifiedReading(
  name: string,
  question: string,
  selectedCards: SelectedCard[]
): UnifiedReading {
  const context = analyzeQuestion(question) as ReadingContext;
  context.name = name;
  
  const emotion = context.emotion || 'default';
  const topic = context.topic || 'default';
  
  const greeting = pickRandom(GREETINGS[emotion] || GREETINGS.default).replace('{name}', name);
  
  const situation = pickRandom(SITUATION_MERGE[emotion]?.[topic] || SITUATION_MERGE[emotion]?.default || SITUATION_MERGE.default.default);
  
  const pattern = pickRandom(PSYCHOLOGICAL_PATTERNS[topic] || PSYCHOLOGICAL_PATTERNS.default);
  
  const direction = pickRandom(FUTURE_DIRECTION[topic] || FUTURE_DIRECTION.default);
  
  const guidance = pickRandom(ACTIONABLE_GUIDANCE[emotion] || ACTIONABLE_GUIDANCE.default);
  
  const closing = pickRandom(POWERFUL_CLOSINGS[emotion] || POWERFUL_CLOSINGS.default);
  
  const fullNarrative = `${greeting} ${situation} Aur dekho—${pattern} ${capitalize(direction)} ${guidance} Aur haan—${closing}`;
  
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
  } else if (analysis.primaryDomain === 'love' || analysis.primaryDomain === 'no_contact') {
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

export function generateHumanizedReading(
  context: ReadingContext,
  selectedCards: SelectedCard[]
): HumanizedReading {
  const emotion = context.emotion || 'default';
  const topic = context.topic || 'default';
  
  const greeting = pickRandom(GREETINGS[emotion] || GREETINGS.default).replace('{name}', context.name);
  
  const situation = pickRandom(SITUATION_MERGE[emotion]?.[topic] || SITUATION_MERGE[emotion]?.default || SITUATION_MERGE.default.default);
  
  const pattern = pickRandom(PSYCHOLOGICAL_PATTERNS[topic] || PSYCHOLOGICAL_PATTERNS.default);
  
  const direction = pickRandom(FUTURE_DIRECTION[topic] || FUTURE_DIRECTION.default);
  
  const guidance = pickRandom(ACTIONABLE_GUIDANCE[emotion] || ACTIONABLE_GUIDANCE.default);
  
  const closing = pickRandom(POWERFUL_CLOSINGS[emotion] || POWERFUL_CLOSINGS.default);
  
  return {
    opening: greeting,
    presentEnergy: situation,
    underlyingPattern: `Aur dekho—${pattern}`,
    direction: capitalize(direction),
    guidance: guidance,
    closing: `Aur haan—${closing}`,
    cardInterpretations: [],
  };
}
