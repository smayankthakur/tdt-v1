import type { Language } from './config';
import { langMap } from './config';

export interface TranslationSet {
  [key: string]: string | TranslationSet | string[];
}

export const TRANSLATIONS: Record<string, TranslationSet> = {
  english: {
    common: {
      loading: 'Loading...',
      error: 'Something went wrong',
      retry: 'Try Again',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      close: 'Close',
      continue: 'Continue',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      skip: 'Skip',
      language: 'Language',
      poweredBy: 'Powered by Sitelytc Digital Media',
      under60seconds: 'Under 60 seconds',
      connectingToGinni: 'Connecting to Ginni...',
      ginniIsThinking: 'Ginni is thinking...',
      yourSpiritualGuide: 'Your spiritual guide',
      ginni: 'Ginni',
      ginniTitle: 'Ginni ✨',
      yourPersonalTarotGuide: 'Your personal tarot guide',
      secureGuarantee: 'Secure payment • 30-day guarantee',
      instantDelivery: 'Instant delivery',
      unlimitedReadings: 'Unlimited readings',
      readingYourEnergy: 'Reading your energy...',
      recommendedForYou: 'Recommended for you',
      fromPreviousReading: 'From your previous reading',
      premiumAccessActive: 'Premium Access Active',
      enjoyUnlimited: 'Enjoy unlimited readings',
    },
    nav: {
      home: 'Home',
      about: 'About',
      reading: 'Reading',
      subscription: 'Subscription',
      premium: 'Premium',
      bookReading: 'Book Reading',
      booking: 'Booking',
      blog: 'Blog',
      contact: 'Contact',
      talkToGinni: 'Talk to Ginni',
      yesno: 'Yes/No',
    },
    booking: {
      selectDate: 'Select a Date',
      availableTimes: 'Available Times for',
      chooseSessionLength: 'Choose Session Length',
      bookingSummary: 'Booking Summary',
      topic: 'Topic',
      date: 'Date',
      duration: 'Duration',
      name: 'Name',
      total: 'Total',
      readingBooked: 'Your Reading is Booked',
      bookingId: 'Booking ID',
    },
    hero: {
      headline: {
        default: "Confused about what's happening in your life?",
        love: "Something about your relationship needs clarity...",
        career: "You've been thinking about your next move...",
        confusion: "You're feeling lost, but answers are closer than you think...",
      },
      subheadline: {
        default: "Get answers from the universe in seconds. Experience mystical readings that feel made just for you.",
        love: "The cards see what your heart has been wondering about.",
        career: "Let the universe guide your path forward.",
       confusion: "The tarot sees the way forward.",
     },
     about: {
       title: "About the Reader",
       paragraph1: "Your intuition already knows the truth. This space helps you hear it more clearly.",
       paragraph2: "Each reading is designed to feel personal, calm, and deeply connected to your situation.",
       feature1: "AI-powered insights",
       feature2: "Spiritual guidance",
       feature3: "Personalized clarity",
     },
     cta: {
       startReading: "Continue",
      continueJourney: "Aage badhte hain",
      unlockClarity: "Dekhte hain kya aa raha hai",
      continueReading: "Continue",
      talkToGinni: "Talk to Ginni",
      getDeeperInsights: "Get Deeper Insights",
      exploreMore: "Explore More",
    },
    reading: {
      title: 'Your Tarot Reading',
      selectTopic: 'What area calls to you?',
      love: 'Love & Relationships',
      career: 'Career & Work',
      confusion: 'Finding Clarity',
      general: 'General Guidance',
      selectQuestion: 'What do you want to know?',
      askOwn: 'Ask your own question...',
      reveal: 'Reveal Your Answer',
      loading: 'Reading your energy...',
      yourCards: 'Your Cards',
      interpretation: 'Interpretation',
      past: 'The Past',
      present: 'The Present',
      guidance: 'The Guidance',
    },
readingHub: {
      title: 'Aaj kya explore karna chahte ho?',
      subtitle: 'Clarity ke liye apna path choose karo',
      remaining: 'readings free aaj',
      noRemaining: 'No free readings bache hain',
    },
    readingForm: {
      title: 'Thoda aur batao…',
      subtitle: 'Taaki clear dekh sakein',
      name: 'Tumhara naam',
      namePlaceholder: 'Tumhara naam…',
      nameError: 'Naam bhi batao… thoda personal connect banta hai',
      question: 'Tumhara sawal',
      questionPlaceholder: 'Kya jaan na chahte ho?',
      questionError: 'Sawal clear hoga tabhi answer bhi clear aayega',
      processing: 'Reading generate ho raha hai…',
      patience: 'Thoda patience rakhho…',
      guidance: 'Guidance',
      tryAgain: 'Naya reading',
      unlockFull: 'Full access lo',
    },
    yesno: {
      title: 'Yes or No?',
      subtitle: 'A simple question, a clear answer',
      questionPlaceholder: 'Think of your question… What yes/no answer do you seek?',
      decode: 'Decode My Answer',
      result: {
        yes: 'YES',
        no: 'NO',
        maybe: 'THINK AGAIN',
      },
      share: 'This result seems meant for others too?',
      newReading: 'Try another',
    },
    paywall: {
      title: {
        curious: "The cards are revealing something powerful...",
        urgent: "Your clarity is waiting...",
        soft: "A deeper perspective awaits",
      },
      description: {
        curious: "There's more depth to what you're seeing. Would you like to go deeper?",
        urgent: "This insight could change everything. Don't leave your path uncertain.",
        soft: "The universe has more to show you. Continue when you're ready.",
      },
      cta: {
        curious: "Continue Reading",
        urgent: "Unlock Now",
        soft: "Continue Journey",
      },
      timeLimited: 'Limited time offer',
      savings: 'Save 40% with bundle',
      securePayment: 'Secure payment • 30-day guarantee',
    },
    chat: {
      button: 'Talk to Ginni',
      tooltip: 'Need guidance? Chat with Ginni',
      welcome: 'Namaste! I\'m Ginni, your spiritual guide',
      afterReading: 'There\'s more to this… talk to me',
      placeholder: 'Type your message...',
      send: 'Send',
    },
    ritualHub: {
      topicSelect: {
        title: "What area do you need clarity in?",
        subtitle: "Choose the topic that resonates with your heart...",
      },
      question: {
        title: "What's been on your mind...",
        subtitle: "Write it. From your heart.",
        label: "Your question",
        placeholder: "What do you want to know?",
        submit: "Continue",
        hint: "Clear question leads to clear direction",
        back: "← Back",
      },
      intentionLock: {
        message: "Focus is shifting to what matters",
        topicLabel: "Topic",
      },
      cardReveal: {
        progress: "Card {current} of {total} — almost there...",
      },
      intent: {
        love: "What's in your heart keeps coming back… that energy is here.",
        career: "Your professional life question is on your mind. What you feel reflects your career energy.",
        finance: "You want financial clarity. The cards are picking up signals about your money matters.",
        conflict: "Tension or conflict you feel… the energy is showing in the cards.",
        action: "What should you do? Your internal signal is in every card.",
        spiritual: "You seek spiritual clarity. The cards you pull are bringing universe messages.",
        noContact: "That person is on your mind. The energy between you shows.",
        general: "Your question's energy is with you. The cards you choose are meaningful signals.",
       },
       suspenseMsgs: {
         love: "What you chose… are signals about your love. Now seeing what they say.",
        career: "Your career energy has been chosen. A bit more wait… clarity is coming.",
        finance: "Financial signals are captured in the cards. Now signal is clearing…",
        conflict: "Conflict energy is captured. Now seeing what nature has to say.",
        action: "Your next step is hidden in the cards… just a bit more wait.",
        spiritual: "Universe messages are in your cards. Now decoding them…",
        general: "What you chose… is meaningful for your question. Now seeing what's being shared.",
      },
      fallbackClosing: "You already know what's right… just don't ignore it now.",
      loadingMessage: "Just a moment… signals coming through",
      preStreamText: "Look carefully… what's coming is important.",
      readingFallback: "Your question brings clarity… direction is forming.",
      guidanceIntro: "Your cards are saying:",
      closingQuote: "The next step… you already feel it.",
      startOver: "Start over",
      unlockAccess: "Full Access",
      shuffle: [
        "Just a moment...",
        "Aligning energy...",
        "What's meant to come...",
        "The cards are speaking...",
        "Catching signals...",
      ],
      cardSelect: {
        title: "Choose the cards that call to you...",
        selectionMessage: "{count} selected — choose {remaining} more",
        complete: "Perfect! Your selection is complete...",
       },
       suspenseMsgs: {
         love: "Tumhare dil ke baare mein jo baar baar soch rahe ho… woh energy inme hai.",
        career: "Tumhare professional life ka sawal tumhare mann mein chal raha hai.",
        finance: "Tum financial clarity chahte ho. Cards tumhare money ke signals lae rahe hain.",
        conflict: "Tension ya conflict jo tum feel kar rahe ho… uski energy cards mein dikh rahi hai.",
        action: "Kya karna chahiye? Tumhara internal signal har card mein hai.",
        spiritual: "Tum spiritual clarity dhundh rahe ho. Jo cards pull kar rahe hain universe ke messages lae rahe hain.",
        noContact: "Woh person tumhare mann mein hai. Tumhare beech ki energy dikh rahi hai.",
        general: "Tumhare question ki energy tumhare saath hai. Jo cards chuno woh meaningful signals hain.",
       },
       suspenseMsgs: {
         love: "Jo tumne select kiye… woh tumhare pyaar ke signals hain. Ab dekhte hain kya keh rahe hain.",
        career: "Tumhare career ki energy select hui hai. Thoda or wait karo… clarity aa rahi hai.",
        finance: "Financial signals card mein capture huye hain. Ab signal clear ho raha hai…",
        conflict: "Conflict ki energy capture hui hai. Dekhte hain kya nature ke paas kehna hai.",
        action: "Tumhara next step card mein chhupa hai… bas thoda or wait karo.",
        spiritual: "Universe ke messages tumhare cards mein hai. Ab unhe decode kar rahe hain…",
        general: "Jo tumne choose kiya… woh tumhare question ke liye meaningful hai.",
      },
      fallbackClosing: "Tum already jaante ho kya sahi hai… bas ab usse ignore mat karo.",

      startOver: "Phir se shuru karein",
      unlockAccess: "Full Access 🔓",
    },
    chat: {
      button: 'Ginni se baat karo',
      tooltip: 'Guidance chahiye? Ginni se chat karo',
      welcome: 'Namaste! Main Ginni hoon, tumhari spiritual guide',
      afterReading: 'Isme aur hai... mujhse baat karo',
      placeholder: 'Message likho...',
      send: 'Send',
    },
    testimonials: {
      title: 'Seekers kya kehte hain',
      seeMore: 'Aur reviews dekho',
    },
    whySection: {
      title: 'Kyun The Devine Tarot?',
      description: 'Hum ancient tarot wisdom ko AI tech ke saath mix karte hain - readings jo personal, profound aur bilkul tumhare liye perfect hain.',
      readings: '10,000+ readings',
      rating: '4.9 rating',
      speed: '60 seconds se kam',
      features: {
        personalized: 'Tumhari energy ke according personalized readings',
        ai: 'AI-powered insights with human touch',
        privacy: '100% private aur secure',
        instant: 'Instant answers, kabhi bhi',
      },
    },
    footer: {
      tagline: 'Clarity begins within',
      copyright: `© Sitelytc Digital Media. All rights reserved.`,
      madeWith: 'Cosmic energy se bana',
      privacy: 'Privacy',
    },
    premium: {
      badge: 'Premium Member',
      active: 'Premium Access Active',
      enjoy: 'Unlimited readings enjoy karo',
    },
    urgency: {
      timeSensitive: 'Time-sensitive',
      limitedSpots: 'Sirf 2 spots bache hain',
      endsTonight: 'Aaj raat end hoga',
      lastChance: 'Last chance',
    },
    home: {
      hero: {
        sloganLine1: "This sirf tarot nahi hai...",
        sloganLine2: "Yeh woh clarity hai jab life confusing ho jaati hai...",
        quote: "Jo aap poochhna chahte hain... uska jawaab aap pehle se feel kar rahe hain",
        ctaButton: "Apna bhavishya jaanein",
        ctaSubtext: "Shayad yehi jawaab hai jiska aap intezaar kar rahe the..."
      },
    },
    about: {
      hero: {
        title: 'About The Journey',
        subtitle: 'Yeh platform sirf readings ke liye nahi bana… Yeh clarity dene ke liye bana hai jab life confusing lagti hai.',
      },
      founder: {
        role: 'Founder & Lead Tarot Reader',
        bio: "Over 10 years of experience guiding seekers through life's most confusing moments. What started as a personal journey into tarot evolved into a mission — making spiritual guidance accessible to everyone, anytime.",
        philosophy: "This platform isn't about predictions. It's about helping you see what you already feel deep inside. The cards don't tell you what to do — they help you understand what you already know.",
      },
      stats: {
        readings: '10,000+ Readings',
        since: 'Since 2014',
      },
      philosophy: {
        title: 'The Philosophy',
        clarity: {
          title: 'Clarity Over Prediction',
          desc: "We don't tell your future. We help you see your present more clearly.",
        },
        personal: {
          title: 'Personal Over Generic',
          desc: 'Every reading is unique. No templates, no copy-paste responses.',
        },
        guidance: {
          title: 'Guidance Over Advice',
          desc: 'We guide you to your own answers. The power was always within you.',
        },
      },
      why: {
        title: 'Why This Platform?',
        p1: "Traditional tarot readings require appointments, waiting, and often come with a premium price tag. But clarity shouldn't wait — and it shouldn't cost a fortune.",
        p2: 'This platform combines ancient tarot wisdom with modern AI technology to create something truly unique: readings that feel personal, that understand your emotional context, and that give you insight when you need it most.',
        p3: "Whether you're at 2 AM with a racing mind or need a quick perspective before a big decision — the answers are here, waiting for you.",
      },
      cta: {
        text: 'Ready to find your clarity?',
      },
    },
  },
  ar: {
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ ما',
      retry: 'حاول مرة أخرى',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      close: 'إغلاق',
      continue: 'متابعة',
      back: 'رجوع',
      next: 'التالي',
      submit: 'إرسال',
      skip: 'تخطي',
    },
    nav: {
      home: 'الرئيسية',
      about: 'حول',
      reading: 'القراءة',
      subscription: 'الاشتراك',
      booking: 'الحجز',
      blog: 'المدونة',
      contact: 'اتصل بنا',
      talkToGinni: 'تحدث مع جيني',
    },
    hero: {
      headline: {
        default: 'ما الذي يحدث في حياتك، هل أنت مرتبك؟',
        love: 'تريد وضوحا في علاقتك...',
        career: 'تفكر في خطوتك التالية...',
        confusion: 'تشعر بالضياع، لكن الإجابات موجودة...',
        decision: 'لديك قرار مهم untuk dibuat...',
        money: 'قلق بشأن أموالك...',
        family: 'مسألة عائلية تزعجك...',
      },
      subheadline: {
        default: 'احصل على إجابات واضحة من Tarot',
        love: 'اكتشف ما يخفيه قلب شريكك',
        career: 'حدد مسارك المهني',
        confusion: 'ابحث عن الوضوح في فوضى حياتك',
        decision: ' اتخذ قرارك التالي بثقة',
        money: 'خطط لمستقبلك المالي',
        family: 'ابحث عن حل لوضع عائلتي',
      },
    },
    reading: {
      title: '✨ Your Divine Tarot Reading',
      subtitle: 'اسحب بطاقة untuk melihat masa depan Anda',
      drawCards: 'اسحب tarot Anda',
      gettingReady: 'Getting your reading ready...',
      flipCard: 'انقر للقلب',
      seeInterpretation: 'عرض التفسير',
      shareResult: 'مشاركة النتيجة',
      newReading: 'قراءة جديدة',
      interpretation: 'التفسير',
      question: 'سؤالك',
      cards: 'البطاقات المختارة',
    },
    cta: {
      talkToGinni: 'تحدث مع جيني',
      getReading: 'احصل على قراءة',
      learnMore: 'اعرف المزيد',
      startJourney: 'ابدأ رحلتك',
      bookSession: 'احجز جلسة',
    },
    features: {
      instant: 'إجابات فورية، في أي وقت',
    },
    footer: {
      tagline: 'الوضوح يبدأ من الداخل',
      copyright: '© Sitelytc Digital Media. جميع الحقوق محفوظة.',
      madeWith: 'مصنوع بطاقة نجمية',
      privacy: 'الخصوصية',
    },
    premium: {
      badge: 'عضو مميز',
      active: 'الوصول المميز مفعل',
      enjoy: 'استمتع بقراءات غير محدودة',
    },
    urgency: {
      timeSensitive: 'مرتبط بالوقت',
      limitedSpots: 'بقية مكانان فقط',
      endsTonight: 'ينتهي الليلة',
      lastChance: 'الفرصة الأخيرة',
    },
    home: {
      hero: {
        sloganLine1: 'هذا ليس مجرد التاروت…',
        sloganLine2: 'هذا هو الوضوح الذي تشعر به بالفعل…',
        quote: 'الإجابة التي تبحث عنها… أنت تشعر بها بالفعل.',
        ctaButton: 'اعرف مستقبلك',
        ctaSubtext: 'ربما هذه هي الإجابة التي كنت تنتظرها…',
      },
    },
    about: {
      hero: {
        title: 'عن الرحلة',
        subtitle: 'هذه المنصة ليست فقط للقراءات... صُنعت لتقدم الوضوح عندما تبدو الحياة مربكة.',
      },
      founder: {
        role: 'المؤسسة وقائدة قراءة Tarot',
        bio: 'أكثر من 10 سنوات من الخبرة في إرشاد الباحثين خلال أكثر لحظات الحياة إرباكًا. ما بدأ كرحالة شخصية في Tarot تطور إلى مهمة — جعل التوجيه الروحي متاحًا للجميع، في أي وقت.',
        philosophy: 'هذه المنصة ليست عن التنبؤات. إنها عن مساعدتك على رؤية ما تشعر به بالفعل في أعماقك. البطاقات لا تخبرك ماذا تفعل — بل تساعدك على فهم ما تعرفه بالفعل.',
      },
      stats: {
        readings: '10,000+ قراءة',
        since: 'منذ 2014',
      },
      philosophy: {
        title: 'الفلسفة',
        clarity: {
          title: 'الوضوح قبل التنبؤ',
          desc: 'نحن لا نخبرك مستقبلك. نساعدك على رؤية حاضرك بوضوح أكبر.',
        },
        personal: {
          title: 'شخصي قبل عام',
          desc: 'كل قراءة فريدة. لا قوالب، لا نسخ ولصق.',
        },
        guidance: {
          title: 'توجيه قبل نصيحة',
          desc: 'نوجهك إلى إجاباتك الخاصة. القوة كانت دائمًا في داخلك.',
        },
      },
      why: {
        title: 'لماذا هذه المنصة؟',
        p1: 'قراءات Tarot التقليدية تتطلب مواعيد وانتظار وغالبًا ما تأتي بسعر متميز. لكن الوضوح لا يجب أن ينتظر — ولا يجب أن يكلف ثروة.',
        p2: 'تجمع هذه المنصة بين حكمة Tarot القديمة وتقنية الذكاء الاصطناعي الحديثة لإنشاء شيء فريد حقًا: قراءات شخصية، تفهم سياقك العاطفي، وتعطيك نظرة ثاقبة عندما تحتاجها أكثر.',
        p3: 'سواء كنت في الساعة 2 صباحًا بعقل متسارع أو تحتاج إلى منظور سريع قبل قرار كبير — الإجابات هنا، في انتظارك.',
      },
      cta: {
        text: 'هل أنت مستعد لإيجاد وضوحك؟',
      },
    },
  },
  he: {
    common: {
      loading: 'טוען...',
      error: 'משהו השתבש',
      retry: 'נסה שוב',
      cancel: 'ביטול',
      confirm: 'אישור',
      save: 'שמירה',
      close: 'סגירה',
      continue: 'המשך',
      back: 'חזרה',
      next: 'הבא',
      submit: 'שלח',
      skip: 'דלג',
    },
    nav: {
      home: 'בית',
      about: 'על אודות',
      reading: 'קריאה',
      subscription: 'מנוי',
      booking: 'הזמנה',
      blog: 'בלוג',
      contact: 'צור קשר',
      talkToGinni: 'דבר עם ג\'יני',
    },
    hero: {
      headline: {
        default: 'מה קורה בחייך, אתה מבולבל?',
        love: 'אתה רוצה בהירות במערכת היחסים שלך...',
        career: 'אתה חושב על הצעד הבא שלך...',
        confusion: 'אתה מרגיש אבוד, אבל התשובות קיימות...',
        decision: 'יש לך החלטה חשובה לקבל...',
        money: 'אתה דואג לגבי הכסף...',
        family: 'עניין משפחתי מפריע לך...',
      },
      subheadline: {
        default: 'קבל תשובות ברורות מטארוט',
        love: 'גלה מה לב בן הזוג מסתיר',
        career: 'תכנן את המסלול המקצועי שלך',
        confusion: 'חפש בהירות בכאוס של החיים',
        decision: 'קבל את ההחלטה הבאה שלך בביטחון',
        money: 'תכנן את העתיד הפיננסי שלך',
        family: 'חפש פתרון למצב המשפחתי',
      },
    },
    reading: {
      title: '✨ הקריאה האלוהית שלך',
      subtitle: 'משוך כדי לראות את העתיד',
      drawCards: 'משוך את הטארוט שלך',
      gettingReady: 'מכין את הקריאה שלך...',
      flipCard: 'לחץ להפעלה',
      seeInterpretation: 'צפה בפרשנות',
      shareResult: 'שתף תוצאה',
      newReading: 'קריאה חדשה',
      interpretation: 'הפרשנות',
      question: 'השאלה',
      cards: 'הקלפים שנבחרו',
    },
    cta: {
      talkToGinni: 'דבר עם ג\'יני',
      getReading: 'קבל קריאה',
      learnMore: 'למד עוד',
      startJourney: 'התחל את המסע שלך',
      bookSession: 'קבע פגישה',
    },
    features: {
      instant: 'תשובות מיידיות, בכל זמן',
    },
    footer: {
      tagline: 'הבהירות מתחילה מבפנים',
      copyright: '© Sitelytc Digital Media. כל הזכויות שמורות.',
      madeWith: 'נעשה עם אנרגיה קוסמית',
      privacy: 'פרטיות',
    },
    premium: {
      badge: 'חבר פרימיום',
      active: 'גישה פרימיום פעילה',
      enjoy: 'תהנה מקריאות ללא הגבלה',
    },
    urgency: {
      timeSensitive: 'רגיש לזמן',
      limitedSpots: 'נותרו רק 2 מקומות',
      endsTonight: 'מסתיים הלילה',
      lastChance: 'ההזדמנות האחרונה',
    },
    home: {
      hero: {
        sloganLine1: 'זה לא רק טארוט…',
        sloganLine2: 'זה הבהירות שאתה כבר מרגיש בתוכך…',
        quote: 'התשובה שאתה מחפש… אתה כבר מרגיש אותה.',
        ctaButton: 'דע את העתיד שלך',
        ctaSubtext: 'אולי זו התשובה שחיכית לה…',
      },
    },
    about: {
      hero: {
        title: 'על המסע',
        subtitle: 'הפלטפורמה הזו לא נוצרה רק לקריאות... היא נוצרה לתת בהירות כשהחיים נראים מבלבלים.',
      },
      founder: {
        role: 'מייסדת ומנהלת קריאות טארוט',
        bio: 'יותר מ-10 שנות ניסיון בהנחיית מחפשים דרך הרגעים המבלבלים ביותר בחיים. מה שהתחיל כמסע אישי לטארום התפתח למשימה — להנגיש הכוונה רוחנית לכל אחד, בכל עת.',
        philosophy: 'הפלטפורמה הזו לא עוסקת בנבואות. היא עוסקת בלעזור לך לראות את מה שאתה כבר מרגיש עמוק בפנים. הקלפים לא אומרים לך מה לעשות — הם עוזרים לך להבין את מה שאתה כבר יודע.',
      },
      stats: {
        readings: '10,000+ קריאות',
        since: 'מאז 2014',
       },
     philosophy: {
        title: 'הפילוסופיה',
        clarity: {
          title: 'בהירות לפני נבואה',
          desc: 'אנחנו לא אומרים לך את העתיד שלך. אנחנו עוזרים לך לראות את ההווה שלך בבהירות רבה יותר.',
        },
        personal: {
          title: 'אישי לפני כללי',
          desc: 'כל קריאה ייחודית. אין תבניות, אין העתקה-הדבקה.',
        },
        guidance: {
          title: 'הכוונה לפני עצה',
          desc: 'אנחנו מכוונים אותך לתשובות שלך. הכוח תמיד היה בתוכך.',
        },
      },
      why: {
        title: 'למה הפלטפורמה הזו?',
        p1: 'קריאות טארוט מסורתיות דורשות תורים, המתנה, ולעתים קרובות מגיעות עם תג מחיר יקר. אבל בהירות לא צריכה לחכות — והיא לא צריכה לעלות הון.',
        p2: 'הפלטפורמה הזו משלבת חוכמת טארוט עתיקה עם טכנולוגיית בינה מלאכותית מודרנית ליצור משהו באמת ייחודי: קריאות אישיות, שמבינות את ההקשר הרגשי שלך, ונותנות לך תובנה כשאתה הכי צריך.',
        p3: 'בין אם אתה ב-2 בלילה עם מחשבות מתרוצצות או צריך נקודת מבט מהירה לפני החלטה גדולה — התשובות כאן, מחכות לך.',
      },
      cta: {
        text: 'מוכן למצוא את הבהירות שלך?',
      },
    },
  }
};

export function getTranslation(key: string, lang: Language): string {
  const mappedLang = langMap[lang] || lang;
  const keys = key.split('.');
  let value: unknown = TRANSLATIONS[mappedLang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export function getNestedTranslation(key: string, lang: Language, subKey: string): string {
  const fullKey = `${key}.${subKey}`;
  return getTranslation(fullKey, lang);
}