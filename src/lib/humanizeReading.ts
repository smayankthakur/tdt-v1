import { SelectedCard } from './tarot/logic';
import { DomainAnalysis } from './cardEngine';
import type { Language } from './i18n/config';

export interface ReadingContext {
  emotion: string;
  topic: string;
  urgency: 'low' | 'medium' | 'high';
  hiddenInsight: string;
  question: string;
  name: string;
}

export interface UnifiedReading {
  name: string;
  opening: string;
  presentEnergy: string;
  underlyingPattern: string;
  direction: string;
  guidance: string;
  closing: string;
  cardInterpretations: string[];
}

export interface TransformableReading {
  greeting: string;
  situation: string;
  pattern: string;
  direction: string;
  guidance: string;
  closing: string;
}

const ENGLISH_GREETINGS: Record<string, string[]> = {
  anxious: ["{name}, something clearly stands out…", "{name}, listen…", "{name}, I'm sensing something important…", "Hey {name}…"],
  hopeful: ["{name}, something interesting is coming through…", "{name}, hear what I'm seeing…", "Hey {name}, the energy is strong and positive…"],
  confused: ["{name}, a pattern is emerging…", "{name}, listen…", "Hey {name}, it might feel complicated but you'll understand…"],
  heartbroken: ["{name}, first hear this…", "{name}, something important to share…", "Hey {name}…"],
  stuck: ["{name}, look at what's showing…", "{name}, you'll understand…", "Hey {name}, there's something…"],
  determined: ["{name}, your determination is showing…", "{name}, I see strength in you…"],
  default: ["{name}, listen to what's emerging…", "{name}, something important…", "Hey {name}…"],
};

const ENGLISH_SITUATIONS: Record<string, Record<string, string[]>> = {
  anxious: {
    love: [
      "You're at a moment where your heart keeps going back to the same thoughts—and those thoughts are completely valid. The tension you're feeling exists because this actually matters to you, but there's an uncertainty clouding your mind.",
      "In this situation, your heart and mind are saying different things, and that conflict can be exhausting. But listen—the confusion is actually guiding you somewhere important.",
    ],
    no_contact: [
      "What's repeatedly coming back isn't just a thought—it's a need coming from within you. Don't try to interpret the silence, it's just silence.",
      "The tension exists because you feel like something should have happened, but it didn't. And that's perfectly valid.",
    ],
    career: [
      "Your mind keeps returning to the same thing and it can feel exhausting. But that pressure is actually trying to tell you something important.",
      "The uncertainty in your career is real—because you actually want something better, and that ambition isn't wrong.",
    ],
    finance: [
      "The financial tension you're feeling isn't just about numbers, it's emotional. You want to feel secure and that's completely right.",
      "Money concerns keep appearing to you, but they're actually telling you something about your priorities.",
    ],
    default: [
      "What's repeatedly coming up isn't random—it's your inner voice asking for direction.",
      "It might feel complicated, but what's showing is ultimately for your best.",
    ],
  },
  heartbroken: {
    love: [
      "There's pain, and I won't tell you it's small—it's significant. But listen, alongside the pain there are things that are still alive, don't ignore them.",
      "Your heart is still feeling something after breaking, and that's not wrong. Those feelings are valid.",
    ],
    no_contact: [
      "The silence isn't just about communication, it's an emotional gap. Missing them is normal.",
      "You might feel like it's all over, but emotions never end—they just transform.",
    ],
    default: [
      "What's hurting is completely genuine—and with healing it will lessen, but it needs time.",
      "Let yourself feel the pain, don't suppress it. It's not making you weak, it's making you strong.",
    ],
  },
  confused: {
    love: [
      "You're caught between two perspectives and both are valid. Your mind says one thing and your heart says another—and this tension is difficult to understand.",
      "Clarity isn't coming because actually there's something in both options that's attracting you.",
    ],
    career: [
      "Two paths are showing and both look promising—but making a choice is becoming difficult. This is normal to feel.",
      "There's no wrong answer here, just different priorities, and you need to decide what matters more right now.",
    ],
    default: [
      "There's something circling in your mind that can't quite find its place—and that's completely normal.",
      "You might feel like something important is missing, but that missing space is actually where clarity will come from.",
    ],
  },
  stuck: {
    love: [
      "It might feel like everything's repeating—the same situation, the same feelings, the same thoughts. And this is frustrating, I understand.",
      "Every time the same situation, but listen, there's a reason for this pattern, and understanding it is important.",
    ],
    career: [
      "Growth feels paused—work is happening but something's missing. And you know what that something is.",
      "Same cycle—just walls showing from every direction. But walls also show the path forward.",
    ],
    default: [
      "Everything feels the same and you've grown tired of it—but this is temporary, a shift is coming.",
      "The same pattern keeps returning, and you've realized something needs to change.",
    ],
  },
  hopeful: {
    love: [
      "Something strong is coming through that you're feeling—and that's completely right. Positive energy is quite powerful.",
      "The universe is planning something, and your heart feels somewhat confident about it.",
    ],
    career: [
      "A new opportunity is showing and you're feeling ready—this is perfect.",
      "The growth you're feeling now is real and it will become even stronger ahead.",
    ],
    default: [
      "The positive energy is strong and something good is coming—just stay ready for it.",
      "What you're hoping for is realistic, and your instinct is right.",
    ],
  },
  default: {
    love: [
      "Understanding the situation is important because emotions are involved—but overall the picture looks positive.",
      "Your emotional investment is clearly showing and it's guiding you.",
    ],
    no_contact: [
      "The silence doesn't mean anything right now, but clarity will come in the future—just have patience.",
      "There's confusion on both sides, but ultimately communication will solve it all.",
    ],
    default: [
      "What's showing isn't what you were thinking—but it's better.",
      "A shift is about to happen, and it's beneficial for you.",
    ],
  },
};

const ENGLISH_PATTERNS: Record<string, string[]> = {
  love: [
    "Look deeper—your heart is in protect mode because you've been hurt before, making it difficult to trust right now.",
    "Accepting emotional vulnerability is actually the first step toward real intimacy.",
    "The same pattern keeps attracting you because unconsciously it's your comfort zone—but real growth comes from stepping outside.",
  ],
  no_contact: [
    "The silence exists because ego has blocked communication out of fear—and on both sides.",
    "Both are internally ready but neither wants to speak first—there's fear of rejection.",
    "A communication break doesn't mean attachment break—it was just a break in emotional expression.",
  ],
  career: [
    "Professional insecurity creates a cycle that keeps bringing the same situation.",
    "Self-doubt redirects growth opportunities, even when the capability is there.",
    "Fear of failure keeps you safe, but staying safe won't build your future.",
  ],
  finance: [
    "Scarcity mindset blocks abundance—but the real issue is internal worthiness.",
    "Money decisions are actually reflections of emotional decisions.",
    "Financial tension is actually redirecting you to focus somewhere else.",
  ],
  default: [
    "A cycle keeps repeating because you're learning something important—complete that lesson.",
    "The universe keeps sending the same signal—it will only get louder until you act.",
    "There's an old wound that hasn't healed—it needs to be addressed.",
  ],
};

const ENGLISH_DIRECTIONS: Record<string, string[]> = {
  love: [
    "In the coming time, some clarity is going to come—if communication improves, the situation will get better.",
    "Emotional depth is going to increase—but you'll need to take one small step.",
    "The timing isn't perfect right now, but the next few weeks are important.",
  ],
  no_contact: [
    "The silence is going to break—but first one person's ego needs to soften.",
    "An opening will come, but it will only work when there's genuine intent.",
    "Readiness will increase on both sides—just timing matters.",
  ],
  career: [
    "A new opportunity is approaching—staying prepared is essential.",
    "A growth signal is coming, but you might need to wait a bit.",
    "Hard work is going to show results—timing is becoming favorable.",
  ],
  finance: [
    "Financial flow is about to establish—just needs a mindset shift.",
    "The direction toward abundance is visible—but consistent effort is necessary.",
    "Situation will improve, just need to be patient temporarily.",
  ],
  default: [
    "Energy is shifting—the next few weeks are going to be important.",
    "Situation will improve—if you change your approach.",
    "Timing is becoming favorable—just take initiative.",
  ],
};

const ENGLISH_GUIDANCE: Record<string, string[]> = {
  anxious: [
    "Take a small step back and observe—don't make any decisions right now, just feel.",
    "Take a small break where it's just you—that means taking care of yourself.",
    "What's repeatedly coming up is important, note it down and then think.",
  ],
  heartbroken: [
    "Let yourself feel the pain—don't suppress it, it's a valid emotion.",
    "Take a small distance where there's just self-care—healing will come on its own.",
    "Get support—talk to someone close, share what you're feeling.",
  ],
  confused: [
    "Write to bring your mind and heart to one place—clarity comes from writing.",
    "Write pros and cons of both options—but set aside one day for the decision.",
    "Trust your intuition—what you feel first is often right.",
  ],
  stuck: [
    "Start with a small shift—something completely different, even if small.",
    "Step slightly outside your comfort zone—that's where growth starts.",
    "Try something new that you've never done—novelty can break patterns.",
  ],
  hopeful: [
    "Hold onto what you're feeling positively—just work on it constructively.",
    "An opportunity is coming, stay ready and confident.",
    "Continue what you're doing—results are going to come.",
  ],
  determined: [
    "Your strength is your asset—use it wisely.",
    "The path is clear—keep moving forward with confidence.",
    "Your determination will lead you—trust the process.",
  ],
  default: [
    "Take the first step—just the first step, the rest will set itself.",
    "Talk—communication can improve many things.",
    "Don't rush—everything will set in its own time.",
  ],
};

const ENGLISH_CLOSINGS: Record<string, string[]> = {
  anxious: [
    "You already know what's right—just this time trust your intuition.",
    "What you're feeling is completely right, don't ignore it.",
    "What you're seeing is right for you.",
  ],
  heartbroken: [
    "You're on the path of healing—every step matters, even the small ones.",
    "Pain is valid, but many beautiful things await ahead.",
    "You're strong—you will recover.",
  ],
  confused: [
    "What your heart is saying is right—don't ignore it.",
    "Clarity will come, just need to have patience.",
    "The answer is within you—just need a little trust.",
  ],
  stuck: [
    "Taking a break is an achievement—celebrate it.",
    "Even a small step can bring big change.",
    "You can think your way out—you have the potential.",
  ],
  hopeful: [
    "The universe is with you—just continue.",
    "The positive direction you're seeing is right.",
    "You're strong and something good is coming.",
  ],
  determined: [
    "You know what's right—just follow it.",
    "Trust your inner voice—it won't lead you wrong.",
    "What you're feeling is right.",
  ],
  default: [
    "You know what's right—just follow it.",
    "Trust your inner voice—it won't lead you wrong.",
    "What you're feeling is right.",
  ],
};

const HINGLISH_GREETINGS: Record<string, string[]> = {
  anxious: ["{name}, ek baat clearly dikh rahi hai…", "{name}, suno…", "{name}, thoda deep focus kar raha hoon…", "Hey {name}…"],
  hopeful: ["{name}, kuch interesting aa raha hai…", "{name}, suno jo dikh raha hai…", "Hey {name}, positive energy strong hai…"],
  confused: ["{name}, ek pattern dikh raha hai…", "{name}, suno…", "Hey {name}, thoda complicated hai par samajh jaoge…"],
  heartbroken: ["{name}, pehle yeh suno…", "{name}, kuch important bata raha hoon…", "Hey {name}…"],
  stuck: ["{name}, dekho jo dikh raha hai…", "{name}, samajh jaoge…", "Hey {name}, ek baat hai…"],
  determined: ["{name}, tumhari determination dikh rahi hai…", "{name}, tum mein strength dekhta hoon…"],
  default: ["{name}, suno jo dikh raha hai…", "{name}, ek important baat…", "Hey {name}…"],
};

const HINGLISH_SITUATIONS: Record<string, Record<string, string[]>> = {
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

const HINGLISH_PATTERNS: Record<string, string[]> = {
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

const HINGLISH_DIRECTIONS: Record<string, string[]> = {
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

const HINGLISH_GUIDANCE: Record<string, string[]> = {
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
  determined: [
    "Tumhari strength tumhara asset hai—use wisely.",
    "Raasta clear hai—confidence ke saath aage badho.",
    "Tumhari determination tumhe le jaayegi—process pe trust karo.",
  ],
  default: [
    "Pehla step uthao—bas pehla step, baki apne aap set hoga.",
    "Baat karo—communication hi zyada ka sudhaar sakti hai.",
    "Rush mat karo—sab apni timing par set hoga.",
  ],
};

const HINGLISH_CLOSINGS: Record<string, string[]> = {
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
  determined: [
    "Tum jaante ho kya sahi hai—bas usse follow karo.",
    "Inner voice pe trust karo—woh khaali nahi le jayega.",
    "Jo feel ho raha hai woh sahi hai.",
  ],
  default: [
    "Tum jaante ho kya sahi hai—bas usse follow karo.",
    "Inner voice pe trust karo—woh khaali nahi le jayega.",
    "Jo feel ho raha hai woh sahi hai.",
  ],
};

const HINDI_GREETINGS: Record<string, string[]> = {
  anxious: ["{name}, कुछ स्पष्ट दिख रहा है…", "{name}, सुनो…", "{name}, मैं कुछ महत्वपूर्ण महसूस कर रहा हूं…", "अरे {name}…"],
  hopeful: ["{name}, कुछ दिलचस्प आ रहा है…", "{name}, सुनो जो दिख रहा है…", "अरे {name}, ऊर्जा सशक्त और सकारात्मक है…"],
  confused: ["{name}, एक पैटर्न उभर रहा है…", "{name}, सुनो…", "अरे {name}, थोड़ा पेचीदा लग सकता है पर समझ जाओगे…"],
  heartbroken: ["{name}, पहले यह सुनो…", "{name}, कुछ महत्वपूर्ण बताने जा रहा हूं…", "अरे {name}…"],
  stuck: ["{name}, देखो जो दिख रहा है…", "{name}, समझ जाओगे…", "अरे {name}, एक बात है…"],
  determined: ["{name}, तुम्हारा दृढ़ संकल्प दिख रहा है…", "{name}, मैं तुममें ताकत देखता हूं…"],
  default: ["{name}, सुनो जो उभर रहा है…", "{name}, कुछ महत्वपूर्ण…", "अरे {name}…"],
};

const HINDI_SITUATIONS: Record<string, Record<string, string[]>> = {
  anxious: {
    love: [
      "तुम एक ऐसे पल पर हो जहां दिल बार-बार वही सोचता है—और वह सोच बिल्कुल वास्तविक है। जो तनाव महसूस हो रहा है वह इसलिए है क्योंकि तुम्हें असल में इससे मतलब है, पर कुछ अनिश्चितता है जो दिमाग को घुमा रही है।",
      "इस स्थिति में तुम्हारा दिल और दिमाग दो अलग-अलग बातें कह रहे हैं, और वह संघर्ष थोड़ा थकाने वाला हो सकता है। पर सुनो—यह भ्रम तुम्हें कहीं महत्वपूर्ण की तरफ ले जा रहा है।",
    ],
    no_contact: [
      "जो बार-बार वापस आता है वह सिर्फ एक विचार नहीं है—यह तुम्हारे अंदर से आती एक जरूरत है। खामोशी की व्याख्या करने की कोशिश मत करो, यह सिर्फ खामोशी है।",
      "तनाव इसलिए है क्योंकि तुम्हें लगता है कुछ बात होनी चाहिए थी, पर नहीं हुई। और यह पूरी तरह वैध है।",
    ],
    career: [
      "तुम्हारा दिमाग बार-बार एक ही चीज पर आ रहा है और यह थकाने वाला लग सकता है। पर वह दबाव असल में तुम्हें कुछ महत्वपूर्ण बताना चाह रहा है।",
      "करियर में जो अनिश्चितता महसूस हो रही है वह असली है—क्योंकि तुम असल में कुछ बेहतर चाहते हो, और वह महत्वाकांक्षा गलत नहीं है।",
    ],
    finance: [
      "जो वित्तीय तनाव महसूस हो रहा है वह सिर्फ नंबरों का नहीं, भावनात्मक का मामला है। तुम सुरक्षित महसूस करना चाहते हो और यह बिल्कुल सही है।",
      "पैसों की चिंता तुम्हें बार-बार दिखती है, पर यह असल में तुम्हारी प्राथमिकताओं के बारे में कुछ कह रही है।",
    ],
    default: [
      "जो बार-बार बात आ रही है वह सिर्फ रैंडम नहीं है—यह तुम्हारी आंतरिक आवाज है जो दिशा मांग रही है।",
      "थोड़ा पेचीदा लग सकता है, पर देखो, जो दिख रहा है वह अंततः तुम्हारे लिए बेहतर है।",
    ],
  },
  heartbroken: {
    love: [
      "दर्द है, और मैं यह नहीं कहूंगा कि यह छोटा है—यह बड़ा है। पर सुनो, दर्द के साथ कुछ चीजें भी हैं जो अभी जिंदा हैं, उन्हें नजरअंदाज मत करो।",
      "तुम्हारा दिल टूटने के बाद भी कुछ महसूस कर रहा है, और वह कुछ गलत नहीं है। वह भावना वैध है।",
    ],
    no_contact: [
      "जो खामोशी है वह सिर्फ संवाद की नहीं, भावनाओं का भी अंतर है। उन्हें याद करना, यह सामान्य है।",
      "तुम्हें लग सकता है कि सब खत्म हो गया, पर भावनाएं कभी खत्म नहीं होतीं—वे बस बदलती हैं।",
    ],
    default: [
      "जो दर्द है वह पूरी तरह असली है—और ठीक होने के साथ यह कम होगा, पर इसके लिए समय चाहिए।",
      "दर्द को महसूस होने दो, दबाओ मत। यह तुम्हें कमजोर नहीं, मजबूत बनाता है।",
    ],
  },
  confused: {
    love: [
      "तुम दो परिप्रेक्ष्यों के बीच फंसे हो और दोनों वैध हैं। दिमाग एक बात कह रहा है और दिल दूसरी—और यह तनाव समझना मुश्किल है।",
      "स्पष्टता इसलिए नहीं आ रही क्योंकि असल में दोनों विकल्पों में कुछ न कुछ है जो तुम्हें आकर्षित कर रहा है।",
    ],
    career: [
      "दो रास्ते दिख रहे हैं और दोनों आशाजनक हैं—पर चुनना मुश्किल हो रहा है। यह महसूस करना सामान्य है।",
      "यहां कोई गलत जवाब नहीं है, सिर्फ अलग-अलग प्राथमिकताएं हैं, और यह तय करना है कि अभी क्या ज्यादा मायने रखता है।",
    ],
    default: [
      "दिमाग में एक बात घूम रही है जो सही जगह नहीं पा रही—और यह पूरी तरह सामान्य है।",
      "तुम्हें लग सकता है कि कुछ महत्वपूर्ण गायब है, पर वह गायब जगह असल में वह है जहां से स्पष्टता आएगी।",
    ],
  },
  stuck: {
    love: [
      "लगेगा कि सब कुछ दोहरा रहा है—एक जैसा लूप में हो। और यह निराशाजनक है, मैं समझ सकता हूं।",
      "हर बार वही स्थिति, वही भावनाएं, वही सोच—पर सुनो, इस पैटर्न का एक कारण है, और इसे समझना महत्वपूर्ण है।",
    ],
    career: [
      "विकास रुका हुआ लग रहा है—काम हो रहा है पर कुछ गायब है। और वह गायब चीज तुम्हें भी पता है।",
      "एक जैसा चक्र—जहां से देखो वही दीवार दिख रही है। पर दीवार आगे जाने का रास्ता भी दिखा रही है।",
    ],
    default: [
      "सब एक जैसा चल रहा है और तुम इससे थक गए हो—पर यह अस्थायी है, एक बदलाव आने वाला है।",
      "एक जैसा पैटर्न बार-बार वापस आता है, और तुम्हें समझ आ गया है कि कुछ बदलना चाहिए।",
    ],
  },
  hopeful: {
    love: [
      "कुछ मजबूत आ रहा है जो तुम्हें महसूस कराया जा रहा है—और यह बिल्कुल सही है। सकारात्मक ऊर्जा काफी शक्तिशाली होती है।",
      "ब्रह्मांड कुछ योजना बना रहा है, और तुम्हारा दिल इसके बारे में थोड़ा आश्वस्त है।",
    ],
    career: [
      "एक नया अवसर दिख रहा है और तुम तैयार महसूस कर रहे हो—यह परिपूर्ण है।",
      "जो विकास अभी महसूस हो रहा है वह असली है और यह आगे और भी मजबूत होगा।",
    ],
    default: [
      "सकारात्मक ऊर्जा मजबूत है और कुछ अच्छा होने वाला है—बस उसके लिए तैयार रहो।",
      "जो आशा है वह यथार्थवादी है, और तुम्हारी अंतर्ज्ञान सही है।",
    ],
  },
  default: {
    love: [
      "स्थिति को समझना जरूरी है क्योंकि भावनाएं शामिल हैं—पर समग्र तस्वीर सकारात्मक दिख रही है।",
      "तुम्हारा भावनात्मक निवेश स्पष्ट दिख रहा है और यह तुम्हें मार्गदर्शन कर रहा है।",
    ],
    no_contact: [
      "खामोशी का मतलब अभी कुछ नहीं, पर भविष्य में स्पष्टता आएगी—बस धैर्य रखो।",
      "दोनों तरफ से भ्रम है, पर अंततः संवाद सब हल करेगा।",
    ],
    default: [
      "जो दिख रहा है वह वह नहीं है जो तुम सोच रहे थे—पर बेहतर है।",
      "एक बदलाव होने वाला है, और यह तुम्हारे लिए लाभकारी है।",
    ],
  },
};

const HINDI_PATTERNS: Record<string, string[]> = {
  love: [
    "और इसके पीछे की कहानी देखो—तुम्हारा दिल प्रोटेक्ट मोड में है क्योंकि पहले दर्द हुआ है, इसलिए अभी भरोसा देना मुश्किल हो रहा है।",
    "भावनात्मक कमजोरी को स्वीकार करना ही असली निकटता की तरफ पहला कदम है।",
    "कोई बार-बार वही आकर्षित करता है क्योंकि अचेत रूप से यह कम्फर्ट जोन है—पर असली विकास बाहर से आता है।",
  ],
  no_contact: [
    "खामोशी इसलिए है क्योंकि अहंकार ने डरकर संवाद ब्लॉक कर दिया है—और दोनों तरफ से।",
    "दोनों आंतरिक रूप से तैयार हैं पर कोई पहले बात करने को तैयार नहीं—ब rejection का डर है।",
    "संवाद टूटना मतलब लगाव टूटना नहीं—यह सिर्फ भावनात्मक अभिव्यक्ति का ब्रेक था।",
  ],
  career: [
    "पेशेवर असुरक्षा एक चक्र बनाती है जो एक ही स्थिति को बार-बार लाती है।",
    "आत्मसंदेह अवसरों को रीडायरेक्ट कर देता है, भले ही क्षमता है।",
    "असफलता का डर असल में तुम्हें सुरक्षित रखता है, पर सुरक्षित रहना भविष्य नहीं बनाएगा।",
  ],
  finance: [
    "कमी की सोच प्रचुरता को ब्लॉक करती है—पर असली मुद्दा आंतरिक मूल्य है।",
    "पैसों के निर्णय असल में भावनात्मक निर्णयों की प्रतिबिंब हैं।",
    "वित्तीय तनाव असल में तुम्हें रीडायरेक्ट कर रहा है कि कहीं और फोकस करो।",
  ],
  default: [
    "एक चक्र दोहरा रहा है क्योंकि तुम कुछ महत्वपूर्ण सीख रहे हो—वह पाठ पूरा करो।",
    "ब्रह्मांड एक ही सिग्नल बार-बार भेज रहा है—जब तक काम नहीं करोगे तब तक और तेज होता जाएगा।",
    "एक पुराना घाव है जो ठीक नहीं हुआ—इसे संबोधित करना जरूरी है।",
  ],
};

const HINDI_DIRECTIONS: Record<string, string[]> = {
  love: [
    "आने वाले समय में कुछ स्पष्टता आने वाली है—अगर संवाद सुधरे, तो स्थिति बेहतर होगी।",
    "भावनात्मक गहराई बढ़ने वाली है—पर तुम्हें एक छोटा सा कदम उठाना होगा।",
    "टाइमिंग अभी परिपूर्ण नहीं है, पर अगले कुछ हफ्ते महत्वपूर्ण हैं।",
  ],
  no_contact: [
    "खामोशी टूटने वाली है—पर पहले किसी एक को अहंकार कमजोर करना होगा।",
    "एक खुलाव आएगा, पर यह तभी काम करेगा जब असली इरादा हो।",
    "दोनों तरफ से तैयारी बढ़ेगी—बस टाइमिंग महत्वपूर्ण है।",
  ],
  career: [
    "एक नया अवसर आ रहा है—तैयार रहना जरूरी है।",
    "विकास का सिग्नल आ रहा है, पर थोड़ा इंतजार करना पड़ सकता है।",
    "मेहनत के नतीजे आने वाले हैं—टाइमिंग अनुकूल हो रही है।",
  ],
  finance: [
    "वित्तीय प्रवाह स्थापित होने वाला है—बस मानसिकता बदलनी होगी।",
    "प्रचुरता की दिशा दिखाई दे रही है—पर लगातार प्रयास जरूरी है।",
    "स्थिति सुधरेगी, बस अस्थायी रूप से धैर्य रखो।",
  ],
  default: [
    "ऊर्जा बदल रही है—अगले कुछ हफ्ते महत्वपूर्ण होंगे।",
    "स्थिति सुधरेगी—अगर तरीका बदला।",
    "टाइमिंग अनुकूल हो रही है—बस पहल करो।",
  ],
};

const HINDI_GUIDANCE: Record<string, string[]> = {
  anxious: [
    "थोड़ा पीछे हटो और देखो—अभी कोई फैसला मत लो, बस महसूस करो।",
    "एक छोटा सा ब्रेक लो जहां सिर्फ तुम हो—इसका मतलब अपनी देखभाल करना है।",
    "जो बात बार-बार आ रही है वह महत्वपूर्ण है, नोट करो और फिर सोचो।",
  ],
  heartbroken: [
    "दर्द को महसूस होने दो—दबाओ मत, यह वैध भावना है।",
    "एक छोटी सी दूरी लो जहां सिर्फ सेल्फ-केयर हो—हीलिंग खुद आएगी।",
    "सपोर्ट लो—किसी करीबी से बात करो, शेयर करो।",
  ],
  confused: [
    "दिमाग और दिल को एक जगह लाने के लिए लिखो—स्पष्टता लिखने से आती है।",
    "दोनों विकल्पों के पक्ष और विपक्ष लिखो—पर फैसले के लिए एक दिन रखो।",
    "अपनी अंतर्ज्ञान पर भरोसा करो—जो पहले महसूस होता है वह अक्सर सही होता है।",
  ],
  stuck: [
    "एक छोटे बदलाव से शुरू करो—कुछ बिल्कुल अलग, छोटा भी हो सकता है।",
    "कम्फर्ट जोन से थोड़ा बाहर निकलो—वही से विकास शुरू होता है।",
    "कुछ नया करो जो पहले कभी नहीं किया—नवीनता पैटर्न तोड़ सकती है।",
  ],
  hopeful: [
    "जो सकारात्मक महसूस हो रहा है वह रखो—बस इस पर रचनात्मक रूप से काम करो।",
    "अवसर आने वाला है, तैयार रहो और आश्वस्त भी।",
    "जो कर रहे हो वही जारी रखो—नतीजे आने वाले हैं।",
  ],
  determined: [
    "तुम्हारी ताकत तुम्हारा asset है—इसे समझदारी से इस्तेमाल करो।",
    "रास्ता साफ है—आत्मविश्वास के साथ आगे बढ़ो।",
    "तुम्हारा दृढ़ संकल्प तुम्हें ले जाएगा—प्रक्रिया पर भरोसा करो।",
  ],
  default: [
    "पहला कदम उठाओ—बस पहला कदम, बाकी खुद स्थापित हो जाएगा।",
    "बात करो—संवाद कई चीजें सुधार सकता है।",
    "जल्दबाजी मत करो—सब अपने समय पर स्थापित होगा।",
  ],
};

const HINDI_CLOSINGS: Record<string, string[]> = {
  anxious: [
    "तुम पहले से जानते हो क्या सही है—बस इस बार अपनी अंतर्ज्ञान पर भरोसा करो।",
    "जो महसूस कर रहे हो वह बिल्कुल सही है, नजरअंदाज मत करो।",
    "तुम्हें जो दिख रहा है वही तुम्हारे लिए सही है।",
  ],
  heartbroken: [
    "ठीक होने के रास्ते पर हो—हर कदम महत्वपूर्ण है, छोटा भी।",
    "दर्द वैध है, पर आगे कई खूबसूरत चीजें इंतजार कर रही हैं।",
    "तुम मजबूत हो—तुम ठीक हो जाओगे।",
  ],
  confused: [
    "जो दिल कह रहा है वह सही है—इसे नजरअंदाज मत करो।",
    "स्पष्टता आएगी, बस धैर्य रखना होगा।",
    "जवाब तुम्हारे पास है—बस थोड़ा भरोसा चाहिए।",
  ],
  stuck: [
    "ब्रेक लेना एक उपलब्धि है—इसे सेलिब्रेट करो।",
    "छोटा कदम भी बहुत बड़ा बदलाव ला सकता है।",
    "तुम सोच से आगे निकल सकते हो—तुम्हारी क्षमता है।",
  ],
  hopeful: [
    "ब्रह्मांड तुम्हारे साथ है—बस जारी रखो।",
    "जो सकारात्मक दिशा दिख रही है वह सही है।",
    "तुम मजबूत हो और कुछ अच्छा होने वाला है।",
  ],
  determined: [
    "तुम जानते हो क्या सही है—बस उसका पालन करो।",
    "अपनी आंतरिक आवाज पर भरोसा करो—यह खाली नहीं ले जाएगी।",
    "जो महसूस हो रहा है वह सही है।",
  ],
  default: [
    "तुम जानते हो क्या सही है—बस उसका पालन करो।",
    "अपनी आंतरिक आवाज पर भरोसा करो—यह खाली नहीं ले जाएगी।",
    "जो महसूस हो रहा है वह सही है।",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function replaceName(template: string, name: string): string {
  return template.replace(/\{name\}/g, name);
}

interface BaseContent {
  greeting: string;
  situation: string;
  pattern: string;
  direction: string;
  guidance: string;
  closing: string;
}

export function transformReading(
  emotion: string, 
  topic: string, 
  name: string, 
  lang: Language
): BaseContent {
  const emotionKey = emotion || 'default';
  const topicKey = topic || 'default';
  
  switch (lang) {
    case 'en': {
      const greeting = pickRandom(ENGLISH_GREETINGS[emotionKey] || ENGLISH_GREETINGS.default);
      const situations = ENGLISH_SITUATIONS[emotionKey]?.[topicKey] || ENGLISH_SITUATIONS[emotionKey]?.default || ENGLISH_SITUATIONS.default.default;
      return {
        greeting: replaceName(greeting, name),
        situation: pickRandom(situations),
        pattern: pickRandom(ENGLISH_PATTERNS[topicKey] || ENGLISH_PATTERNS.default),
        direction: pickRandom(ENGLISH_DIRECTIONS[topicKey] || ENGLISH_DIRECTIONS.default),
        guidance: pickRandom(ENGLISH_GUIDANCE[emotionKey] || ENGLISH_GUIDANCE.default),
        closing: pickRandom(ENGLISH_CLOSINGS[emotionKey] || ENGLISH_CLOSINGS.default),
      };
    }
    case 'hinglish': {
      const greeting = pickRandom(HINGLISH_GREETINGS[emotionKey] || HINGLISH_GREETINGS.default);
      const situations = HINGLISH_SITUATIONS[emotionKey]?.[topicKey] || HINGLISH_SITUATIONS[emotionKey]?.default || HINGLISH_SITUATIONS.default.default;
      return {
        greeting: replaceName(greeting, name),
        situation: pickRandom(situations),
        pattern: pickRandom(HINGLISH_PATTERNS[topicKey] || HINGLISH_PATTERNS.default),
        direction: pickRandom(HINGLISH_DIRECTIONS[topicKey] || HINGLISH_DIRECTIONS.default),
        guidance: pickRandom(HINGLISH_GUIDANCE[emotionKey] || HINGLISH_GUIDANCE.default),
        closing: pickRandom(HINGLISH_CLOSINGS[emotionKey] || HINGLISH_CLOSINGS.default),
      };
    }
    case 'hi': {
      const greeting = pickRandom(HINDI_GREETINGS[emotionKey] || HINDI_GREETINGS.default);
      const situations = HINDI_SITUATIONS[emotionKey]?.[topicKey] || HINDI_SITUATIONS[emotionKey]?.default || HINDI_SITUATIONS.default.default;
      return {
        greeting: replaceName(greeting, name),
        situation: pickRandom(situations),
        pattern: pickRandom(HINDI_PATTERNS[topicKey] || HINDI_PATTERNS.default),
        direction: pickRandom(HINDI_DIRECTIONS[topicKey] || HINDI_DIRECTIONS.default),
        guidance: pickRandom(HINDI_GUIDANCE[emotionKey] || HINDI_GUIDANCE.default),
        closing: pickRandom(HINDI_CLOSINGS[emotionKey] || HINDI_CLOSINGS.default),
      };
    }
    default: {
      const greeting = pickRandom(ENGLISH_GREETINGS.default);
      const situations = ENGLISH_SITUATIONS.default.default;
      return {
        greeting: replaceName(greeting, name),
        situation: pickRandom(situations),
        pattern: pickRandom(ENGLISH_PATTERNS.default),
        direction: pickRandom(ENGLISH_DIRECTIONS.default),
        guidance: pickRandom(ENGLISH_GUIDANCE.default),
        closing: pickRandom(ENGLISH_CLOSINGS.default),
      };
    }
  }
}

export function createUnifiedReading(
  name: string,
  question: string,
  selectedCards: SelectedCard[],
  language: Language = 'en'
): UnifiedReading {
  const emotion = analyzeEmotion(question);
  const topic = analyzeTopic(question);
  
  const content = transformReading(emotion, topic, name, language);
  
  return {
    name,
    opening: content.greeting,
    presentEnergy: content.situation,
    underlyingPattern: `Aur dekho—${content.pattern}`,
    direction: capitalize(content.direction),
    guidance: content.guidance,
    closing: `Aur haan—${content.closing}`,
    cardInterpretations: [],
  };
}

export function generateHumanizedReading(
  context: ReadingContext,
  selectedCards: SelectedCard[],
  language: Language = 'en'
): UnifiedReading {
  const emotion = context.emotion || 'default';
  const topic = context.topic || 'default';
  
  const content = transformReading(emotion, topic, context.name, language);
  
  return {
    name: context.name,
    opening: content.greeting,
    presentEnergy: content.situation,
    underlyingPattern: `Aur dekho—${content.pattern}`,
    direction: capitalize(content.direction),
    guidance: content.guidance,
    closing: `Aur haan—${content.closing}`,
    cardInterpretations: [],
  };
}

function analyzeEmotion(question: string): string {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.match(/worried|stress|nervous|uncertain|afraid|fear|scared|anxious|darr|ghabrat|tense/)) {
    return 'anxious';
  } else if (lowerQ.match(/hope|wish|positive|good|better|dream|want|ishq|pyar|excited/)) {
    return 'hopeful';
  } else if (lowerQ.match(/confused|lost|direction|don't know|what should|samajh|kya|paresh|unclear/)) {
    return 'confused';
  } else if (lowerQ.match(/hurt|pain|broken|miss|heart|sad|grief|breakup|dard|ache/)) {
    return 'heartbroken';
  } else if (lowerQ.match(/stuck|blocked|can't|repetitive|going in circles|atka|jad|stop/)) {
    return 'stuck';
  } else if (lowerQ.match(/will|determined|must|need to|try|fight|strong|resolve/)) {
    return 'determined';
  }
  
  return 'default';
}

function analyzeTopic(question: string): string {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.match(/love|relationship|partner|boyfriend|girlfriend|ex|heart|romance|marriage|shaadi|pyaar|uska|unka/)) {
    return 'love';
  } else if (lowerQ.match(/career|job|work|boss|colleague|promotion|salary|business|kaam|office/)) {
    return 'career';
  } else if (lowerQ.match(/money|financial|rich|debt|invest|wealth|finance|paise|financial/)) {
    return 'finance';
  } else if (lowerQ.match(/no contact|hasn't reached|not talking|silence|blocked|waiting|block|answer|call|message/)) {
    return 'no_contact';
  }
  
  return 'default';
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
    hiddenInsight = "Woh insaan bhi internally confuse hai—unhe tumse baat karni hai, lekin koi element unhe rok raha hai.";
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

export function createFullReadingOutput(
  name: string,
  question: string,
  selectedCards: SelectedCard[],
  language: Language = 'en'
): string {
  const reading = createUnifiedReading(name, question, selectedCards, language);
  return `${reading.opening} ${reading.presentEnergy} ${reading.underlyingPattern} ${reading.direction} ${reading.guidance} ${reading.closing}`;
}
