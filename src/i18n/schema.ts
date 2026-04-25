// PART 1 — CENTRAL TRANSLATION SCHEMA (SOURCE OF TRUTH)
// This is your contract. ALL languages must match this structure exactly.
// IMPORTANT: Keys are used throughout the codebase via t('path.to.key')

export const schema = {
  // =====================
  // COMMON / UI
  // =====================
  common: {
    loading: "",
    error: "",
    retry: "",
    cancel: "",
    confirm: "",
    save: "",
    close: "",
    continue: "",
    back: "",
    next: "",
    submit: "",
    skip: "",
    language: "",
    poweredBy: "",
    under60seconds: "",
    connectingToGinni: "",
    ginniIsThinking: "",
    yourSpiritualGuide: "",
    ginni: "",
    ginniTitle: "",
    yourPersonalTarotGuide: "",
    secureGuarantee: "",
    instantDelivery: "",
    unlimitedReadings: "",
    readingYourEnergy: "",
    recommendedForYou: "",
    fromPreviousReading: "",
    premiumAccessActive: "",
     enjoyUnlimited: "",
     maybeLater: "",
     noPressure: "",
   },

  // =====================
  // NAVIGATION
  // =====================
  nav: {
    home: "",
    about: "",
    reading: "",
    subscription: "",
    premium: "",
    bookReading: "",
    booking: "",
    blog: "",
    contact: "",
    talkToGinni: "",
    yesno: "",
   },

  countdown: {
    hours: "",
    minutes: "",
    seconds: "",
    untilNext: "",
  },

  watermark: {
    text: "",
  },

   // =====================
   // HOME PAGE
   // =====================
   home: {
    hero: {
      sloganLine1: "",
      sloganLine2: "",
      quote: "",
      ctaButton: "",
      ctaSubtext: "",
    },
    about: {
      title: "",
      description: "",
      bio: "",
      linkText: "",
    },
    finalCta: {
      title: "",
      description: "",
      button: "",
      subtext: "",
    },
  },

  // =====================
  // ABOUT PAGE
  // =====================
  about: {
    hero: {
      title: "",
      subtitle: "",
    },
    founder: {
      role: "",
      bio: "",
      philosophy: "",
    },
    stats: {
      readings: "",
      since: "",
    },
    philosophy: {
      title: "",
      clarity: {
        title: "",
        desc: "",
      },
      personal: {
        title: "",
        desc: "",
      },
      guidance: {
        title: "",
        desc: "",
      },
    },
    why: {
      title: "",
      p1: "",
      p2: "",
      p3: "",
    },
     cta: {
       text: "",
       startReading: "",
     },
  },

  // =====================
  // READING FLOW (RITUAL HUB)
  // =====================
  ritualHub: {
    topicSelect: {
      title: "",
      subtitle: "",
    },
    question: {
      title: "",
      subtitle: "",
      label: "",
      placeholder: "",
      submit: "",
      hint: "",
      back: "",
    },
    intentionLock: {
      message: "",
      topicLabel: "",
    },
    cardSelect: {
      title: "",
      selectionMessage: "",
      complete: "",
    },
    suspense: {
      default: "",
    },
    cardReveal: {
      progress: "",
    },
    // Intent-specific messages (domain-based)
    intent: {
      love: "",
      career: "",
      finance: "",
      conflict: "",
      action: "",
      spiritual: "",
      noContact: "",
      general: "",
    },
    // Suspense messages per domain
    suspenseMsgs: {
      love: "",
      career: "",
      finance: "",
      conflict: "",
      action: "",
      spiritual: "",
      noContact: "",
      general: "",
     },
     // Arrays
     shuffle: [] as string[],
     reveal: [] as string[],
     // Fallback/general messages
      fallbackClosing: "",
      loadingMessage: "",
      preStreamText: "",
      readingFallback: "",
      guidanceIntro: "",
      closingQuote: "",
      startOver: "",
      unlockAccess: "",
      reminder: {
        optIn: "",
        optInActive: "",
      },
      behavioral: {
        dailyHook: "",
        subHook: "",
      },
    },

  // =====================
  // READING PAGE (static labels)
  // =====================
  reading: {
    title: "",
    selectTopic: "",
    love: "",
    career: "",
    confusion: "",
    finance: "",
    marriage: "",
    noContact: "",
    general: "",
    selectQuestion: "",
    askOwn: "",
    reveal: "",
    loading: "",
    yourCards: "",
    interpretation: "",
    past: "",
    present: "",
    guidance: "",
    inputPlaceholder: "",
  },

  // =====================
  // YES/NO READING
  // =====================
  yesno: {
    title: "",
    subtitle: "",
    questionPlaceholder: "",
    decode: "",
    result: {
      yes: "",
      no: "",
      maybe: "",
    },
    share: "",
    newReading: "",
  },

  // =====================
  // LANDING PAGE SECTIONS
  // =====================
  landing: {
    problems: {
      stuck: {
        title: "",
        description: "",
      },
      love: {
        title: "",
        description: "",
      },
      direction: {
        title: "",
        description: "",
      },
    },
    howItWorks: {
      title: "",
      subtitle: "",
      ask: {
        title: "",
        description: "",
      },
      pick: {
        title: "",
        description: "",
      },
      reveal: {
        title: "",
        description: "",
      },
    },
    preview: {
      title: "",
      subtitle: "",
      cardTitle: "",
      pastLabel: "",
      pastText: "",
      presentLabel: "",
      presentText: "",
      guidanceLabel: "",
      guidanceText: "",
      ctaText: "",
      ctaButton: "",
      ctaSubtext: "",
    },
  },

  // =====================
  // WHY SECTION
  // =====================
  whySection: {
    title: "",
    description: "",
    readings: "",
    rating: "",
    speed: "",
    features: {
      personalized: "",
      ai: "",
      privacy: "",
      instant: "",
    },
  },

  // =====================
  // TESTIMONIALS
  // =====================
  testimonials: {
    title: "",
    seeMore: "",
  },

  // =====================
  // FOOTER
  // =====================
  footer: {
    tagline: "",
    copyright: "",
    madeWith: "",
    privacy: "",
    navigation: "",
    support: "",
    connect: "",
    disclaimer: "",
  },

  // =====================
  // CHAT
  // =====================
   chat: {
     button: "",
     tooltip: "",
     welcome: "",
     afterReading: "",
     placeholder: "",
     send: "",
     contextNotice: "",
     footerPowered: "",
   },

  // =====================
  // PAYWALL
  // =====================
  paywall: {
    title: {
      curious: "",
      urgent: "",
      soft: "",
    },
    description: {
      curious: "",
      urgent: "",
      soft: "",
    },
    cta: {
      curious: "",
      urgent: "",
      soft: "",
    },
    timeLimited: "",
    savings: "",
     securePayment: "",
     messages: {
       deep_engagement: {
         title: "",
         desc: "",
       },
       hesitation: {
         title: "",
         desc: "",
       },
       recurring_theme: {
         title: "",
         desc: "",
       },
     },
    },

    premium: {
     badge: "",
     active: "",
     enjoy: "",
     page: {
       title: "",
       subtitle: "",
     },
     mostPopular: "",
     plans: {
       free: {
         name: "",
         features: [] as string[],
       },
       premium: {
         name: "",
         features: [] as string[],
       },
       pro: {
         name: "",
         features: [] as string[],
       },
     },
     buttons: {
       getStartedFree: "",
       subscribe: "",
     },
     guarantee: "",
   },

  // =====================
  // URGENCY BADGES
  // =====================
  urgency: {
    timeSensitive: "",
    limitedSpots: "",
    endsTonight: "",
    lastChance: "",
  },

  // =====================
  // BOOKING PAGE
  // =====================
  booking: {
    selectDate: "",
    availableTimes: "",
    chooseSessionLength: "",
    bookingSummary: "",
    topic: "",
    date: "",
    duration: "",
    name: "",
    total: "",
    readingBooked: "",
    bookingId: "",
  },

  // =====================
  // READING FORM (personalization)
  // =====================
     readingForm: {
       title: "",
       subtitle: "",
       name: "",
       namePlaceholder: "",
       nameError: "",
       question: "",
       questionPlaceholder: "",
       questionError: "",
       processing: "",
       patience: "",
       guidance: "",
       tryAgain: "",
       unlockFull: "",
      },
      metadata: {
        title: "",
        description: "",
      },
   };

 export type TranslationSchema = typeof schema;
 export type TranslationKey = keyof TranslationSchema;
