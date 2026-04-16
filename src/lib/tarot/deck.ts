export interface TarotCard {
  id: string;
  name: string;
  keywords: string[];
  emotions: string[];
  upright: string;
  reversed: string;
  type: 'major' | 'minor';
  suit?: string;
  positionMeanings?: {
    past: string;
    present: string;
    future: string;
  };
}

export const tarotDeck: TarotCard[] = [
  // Major Arcana
  { 
    id: 'fool', 
    name: 'The Fool', 
    keywords: ['new beginnings', 'innocence', 'adventure', 'trust', 'spontaneity'],
    emotions: ['excited', 'uncertain', 'hopeful', 'curious'],
    upright: 'New beginnings, innocence, spontaneity, free spirit. Embrace the unknown with trust in your journey.',
    reversed: 'Recklessness, risk-taking, lack of direction, foolishness. Moving too fast without thinking.',
    type: 'major',
    positionMeanings: {
      past: 'A new chapter is beginning - you may not have realized it yet',
      present: 'An opportunity for something new is calling you',
      future: 'Adventure and new experiences await - stay open to the unexpected'
    }
  },
  { 
    id: 'magician', 
    name: 'The Magician', 
    keywords: ['manifestation', 'power', 'skill', 'resourcefulness', 'willpower'],
    emotions: ['confident', 'ready', 'capable', 'determined'],
    upright: 'Manifestation, power, skill, resourcefulness. You have all the tools you need to create what you want.',
    reversed: 'Manipulation, deception, untapped potential. Not using your gifts to their fullest.',
    type: 'major',
    positionMeanings: {
      past: 'You\'ve developed skills that are ready to be used',
      present: 'You have the power to make things happen - act now',
      future: 'Your abilities will bring about tangible results'
    }
  },
  { 
    id: 'high-priestess', 
    name: 'The High Priestess', 
    keywords: ['intuition', 'mystery', 'hidden', 'subconscious', 'inner voice'],
    emotions: ['curious', 'seeking', 'introspective', 'mysterious'],
    upright: 'Intuition, mystery, hidden knowledge, trust your instincts. What you seek is within you.',
    reversed: 'Hidden agendas, surface-level understanding, ignoring your intuition.',
    type: 'major',
    positionMeanings: {
      past: 'You\'ve been ignoring your inner voice',
      present: 'Trust what you feel rather than what you see',
      future: 'Dive deeper into your subconscious for answers'
    }
  },
  { 
    id: 'empress', 
    name: 'The Empress', 
    keywords: ['love', 'nurturing', 'abundance', 'creativity', 'feminine'],
    emotions: ['hopeful', 'longing', 'creative', 'nurturing'],
    upright: 'Nurturing, abundance, fertility, creativity. You are surrounded by love and growth.',
    reversed: 'Dependency, over-giving, emptiness, creativity blocked.',
    type: 'major',
    positionMeanings: {
      past: 'A period of creative growth or nurturing energy',
      present: 'You are or need to be in a nurturing role',
      future: 'Abundance and creative energy are coming your way'
    }
  },
  { 
    id: 'emperor', 
    name: 'The Emperor', 
    keywords: ['control', 'structure', 'authority', 'stability', 'power'],
    emotions: ['anxious', 'seeking-stability', 'determined', 'controlling'],
    upright: 'Authority, structure, stability, leadership. You need to create order and take control.',
    reversed: 'Tyranny, rigidity, lack of discipline, being controlled.',
    type: 'major',
    positionMeanings: {
      past: 'You\'ve been seeking structure and stability',
      present: 'You need to take charge or establish boundaries',
      future: 'Structure and authority will play a role'
    }
  },
  { 
    id: 'hierophant', 
    name: 'The Hierophant', 
    keywords: ['tradition', 'guidance', 'belief', 'education', 'spiritual'],
    emotions: ['seeking-guidance', 'traditional', 'spiritual', 'learner'],
    upright: 'Tradition, guidance, belief systems, education. Seek wisdom from traditional sources.',
    reversed: 'Rebellion, non-conformity, new approaches, questioning authority.',
    type: 'major',
    positionMeanings: {
      past: 'Traditional values or education shaped you',
      present: 'Seeking guidance or belonging to something larger',
      future: 'A teacher or mentor may appear'
    }
  },
  { 
    id: 'lovers', 
    name: 'The Lovers', 
    keywords: ['love', 'harmony', 'choice', 'partnership', 'union'],
    emotions: ['longing', 'conflicted', 'hopeful', 'loving'],
    upright: 'Love, harmony, relationships, important choices. Follow your heart.',
    reversed: 'Disharmony, imbalance, misalignment, choosing the wrong path.',
    type: 'major',
    positionMeanings: {
      past: 'A significant relationship or important choice',
      present: 'Facing a decision about love or values',
      future: 'Harmony and union are coming - or a major choice looms'
    }
  },
  { 
    id: 'chariot', 
    name: 'The Chariot', 
    keywords: ['victory', 'will', 'determination', 'control', 'success'],
    emotions: ['determined', 'frustrated', 'ready', 'driven'],
    upright: 'Willpower, victory, determination, control. You will overcome through sheer determination.',
    reversed: 'Aggression, lack of direction, stagnation, winning at all costs.',
    type: 'major',
    positionMeanings: {
      past: 'A victory you worked hard for',
      present: 'Determination will carry you through',
      future: 'Success through willpower - stay the course'
    }
  },
  { 
    id: 'strength', 
    name: 'Strength', 
    keywords: ['courage', 'patience', 'inner-power', 'compassion', 'gentle'],
    emotions: ['tired', 'brave', 'persistent', 'gentle'],
    upright: 'Courage, patience, inner strength, compassion. True power comes from within.',
    reversed: 'Weakness, self-doubt, aggression, feeling overwhelmed.',
    type: 'major',
    positionMeanings: {
      past: 'You\'ve shown courage in difficult situations',
      present: 'Patience and inner strength are needed now',
      future: 'Your quiet strength will be rewarded'
    }
  },
  { 
    id: 'hermit', 
    name: 'The Hermit', 
    keywords: ['wisdom', 'solitude', 'guidance', 'introspection', 'inner-search'],
    emotions: ['lost', 'seeking', 'reflective', 'withdrawn'],
    upright: 'Inner guidance, solitude, introspection. Take time to find your answers within.',
    reversed: 'Isolation, loneliness, withdrawal, hiding from the world.',
    type: 'major',
    positionMeanings: {
      past: 'A time of introspection served you well',
      present: 'You need time alone to find clarity',
      future: 'Wisdom will come through quiet contemplation'
    }
  },
  { 
    id: 'wheel', 
    name: 'Wheel of Fortune', 
    keywords: ['change', 'fate', 'opportunity', 'luck', 'cycles'],
    emotions: ['anxious', 'hopeful', 'expectant', 'uncertain'],
    upright: 'Change, cycles, fate, turning point. Life is shifting in your favor.',
    reversed: 'Resistance to change, bad luck, feeling stuck in circumstances.',
    type: 'major',
    positionMeanings: {
      past: 'A significant turn in your life has occurred',
      present: 'The wheel is turning - change is coming',
      future: 'A new cycle is beginning - embrace it'
    }
  },
  { 
    id: 'justice', 
    name: 'Justice', 
    keywords: ['balance', 'truth', 'fairness', 'karma', 'cause-effect'],
    emotions: ['seeking-justice', 'guilty', 'balanced', 'truthful'],
    upright: 'Balance, truth, fairness, karma. What goes around comes around.',
    reversed: 'Unfairness, dishonesty, lack of accountability, avoidance of truth.',
    type: 'major',
    positionMeanings: {
      past: 'Something was balanced or resolved fairly',
      present: 'Seeking truth and fairness in a situation',
      future: 'Karma will bring resolution - trust the process'
    }
  },
  { 
    id: 'hanged-man', 
    name: 'The Hanged Man', 
    keywords: ['surrender', 'pause', 'new-perspective', 'release', 'sacrifice'],
    emotions: ['stuck', 'confused', 'patient', 'surrendering'],
    upright: 'Surrender, release, new perspective. Let go to move forward.',
    reversed: 'Stuck, resistance, holding on, frustration with delay.',
    type: 'major',
    positionMeanings: {
      past: 'You\'ve had to let go of something',
      present: 'Pause and see things from a new angle',
      future: 'Surrendering will lead to breakthrough'
    }
  },
  { 
    id: 'death', 
    name: 'Death', 
    keywords: ['transformation', 'ending', 'rebirth', 'change', 'closure'],
    emotions: ['fearful', 'ready', 'transforming', 'ending'],
    upright: 'Transformation, endings, rebirth. Death is really a new beginning.',
    reversed: 'Resistance to change, stagnation, fear of letting go.',
    type: 'major',
    positionMeanings: {
      past: 'An ending has already occurred',
      present: 'A major transformation is underway',
      future: 'Something must end for something new to begin'
    }
  },
  { 
    id: 'temperance', 
    name: 'Temperance', 
    keywords: ['balance', 'patience', 'moderation', 'harmony', 'healing'],
    emotions: ['restless', 'seeking-balance', 'calm', 'healing'],
    upright: 'Balance, moderation, harmony. Find the middle ground.',
    reversed: 'Imbalance, excess, lack of patience, doing too much.',
    type: 'major',
    positionMeanings: {
      past: 'You\'ve been seeking balance',
      present: 'Find harmony between opposing forces',
      future: 'Balance will be restored through patience'
    }
  },
  { 
    id: 'devil', 
    name: 'The Devil', 
    keywords: ['temptation', 'shadow', 'addiction', 'attachment', 'material'],
    emotions: ['tempted', 'trapped', 'desiring', 'shadow'],
    upright: 'Attachment, temptation, limitation. Breaking free from what binds you.',
    reversed: 'Liberation, release, overcoming addiction, embracing freedom.',
    type: 'major',
    positionMeanings: {
      past: 'You\'ve felt trapped by something',
      present: 'Temptation or attachment is holding you back',
      future: 'Breaking free from limitations'
    }
  },
  { 
    id: 'tower', 
    name: 'The Tower', 
    keywords: ['breakdown', 'revelation', 'chaos', 'sudden-change', 'awakening'],
    emotions: ['shocked', 'fearful', 'relieved', 'awakened'],
    upright: 'Sudden change, disruption, awakening. What was built on false foundations falls.',
    reversed: 'Avoiding disaster, fear of change, resisting the inevitable.',
    type: 'major',
    positionMeanings: {
      past: 'A sudden change or revelation shook you',
      present: 'Something is being dismantled for your growth',
      future: 'Breakthrough comes after breakdown - embrace it'
    }
  },
  { 
    id: 'star', 
    name: 'The Star', 
    keywords: ['hope', 'healing', 'inspiration', 'serenity', 'renewal'],
    emotions: ['hopeful', 'healing', 'peaceful', 'optimistic'],
    upright: 'Hope, healing, inspiration. After darkness, the light returns.',
    reversed: 'Despair, loss of faith, disappointment, feeling alone.',
    type: 'major',
    positionMeanings: {
      past: 'You\'ve been through darkness - hope is returning',
      present: 'Healing and renewal are available to you',
      future: 'Your hopes and dreams will manifest'
    }
  },
  { 
    id: 'moon', 
    name: 'The Moon', 
    keywords: ['intuition', 'illusion', 'dreams', 'subconscious', 'uncertainty'],
    emotions: ['confused', 'dreamy', 'paranoid', 'intuitive'],
    upright: 'Intuition, dreams, the unconscious. Trust what you feel, even if unclear.',
    reversed: 'Release of fear, truth revealed, overcoming illusion.',
    type: 'major',
    positionMeanings: {
      past: 'Something has been hidden or you\'ve been deceived',
      present: 'Trust your intuition over what you see',
      future: 'Truth will emerge from the fog'
    }
  },
  { 
    id: 'sun', 
    name: 'The Sun', 
    keywords: ['success', 'joy', 'vitality', 'clarity', 'positivity'],
    emotions: ['happy', 'successful', 'optimistic', 'joyful'],
    upright: 'Success, clarity, positivity. Life is good right now.',
    reversed: 'Temporary setback, sadness, lack of clarity, feeling down.',
    type: 'major',
    positionMeanings: {
      past: 'A time of joy and success',
      present: 'You are surrounded by positive energy',
      future: 'Continued success and joy await'
    }
  },
  { 
    id: 'judgement', 
    name: 'Judgement', 
    keywords: ['awakening', 'renewal', 'call', 'rebirth', 'assessment'],
    emotions: ['judgmental', 'hopeful', 'ready', 'self-reflective'],
    upright: 'Awakening, realization, call to action. A spiritual rebirth is coming.',
    reversed: 'Self-doubt, ignoring the call, feeling judged, staying asleep.',
    type: 'major',
    positionMeanings: {
      past: 'You\'ve been at a crossroads',
      present: 'A moment of truth and self-assessment',
      future: 'Being called to rise and answer'
    }
  },
  { 
    id: 'world', 
    name: 'The World', 
    keywords: ['completion', 'achievement', 'wholeness', 'travel', 'fulfillment'],
    emotions: ['accomplished', 'complete', 'fulfilled', 'peaceful'],
    upright: 'Completion, fulfillment, closure. You have reached a milestone.',
    reversed: 'Incompletion, delay, emptiness, something missing.',
    type: 'major',
    positionMeanings: {
      past: 'You\'ve completed a major chapter',
      present: 'Standing at the threshold of completion',
      future: 'Full circle - a new journey awaits'
    }
  },
  
  // Cups (Emotions/Love)
  { 
    id: 'ace-cups', 
    name: 'Ace of Cups', 
    keywords: ['new-feeling', 'love', 'emotional-awakening', 'overflowing'],
    emotions: ['hopeful', 'loving', 'emotional', 'open'],
    upright: 'New emotional beginning, love, emotional awakening. Your heart is overflowing.',
    reversed: 'Emotionally blocked, unable to feel, self-love issues.',
    type: 'minor', suit: 'cups',
    positionMeanings: {
      past: 'A new feeling or emotional experience',
      present: 'Your heart is open to giving and receiving love',
      future: 'Deep emotional fulfillment is coming'
    }
  },
  { 
    id: 'two-cups', 
    name: 'Two of Cups', 
    keywords: ['partnership', 'love', 'union', 'attraction', 'commitment'],
    emotions: ['longing', 'loving', 'connected', 'romantic'],
    upright: 'Partnership, love, mutual attraction. A soul connection awaits or exists.',
    reversed: 'Imbalance in relationship, one-sided feelings, broken bond.',
    type: 'minor', suit: 'cups',
    positionMeanings: {
      past: 'A significant romantic connection',
      present: 'Partnership energy is strong',
      future: 'A committed relationship or deepening bond'
    }
  },
  { 
    id: 'three-cups', 
    name: 'Three of Cups', 
    keywords: ['celebration', 'friendship', 'joy', 'community'],
    emotions: ['happy', 'social', 'joyful', 'celebrating'],
    upright: 'Celebration, friendship, joy. Time to enjoy good company.',
    reversed: 'Isolation, overindulgence, too much partying, neglecting responsibilities.',
    type: 'minor', suit: 'cups',
    positionMeanings: {
      past: 'A joyful celebration with friends',
      present: 'Time to celebrate and be social',
      future: 'Good times ahead with your community'
    }
  },
  { 
    id: 'four-cups', 
    name: 'Four of Cups', 
    keywords: ['disappointment', 'apathy', 'contemplation', 'neglect'],
    emotions: ['disappointed', 'bored', 'reflective', 'dissatisfied'],
    upright: 'Disappointment, apathy, contemplation. Something new is being offered.',
    reversed: 'Realizing what you\'ve missed, waking up, new opportunities arise.',
    type: 'minor', suit: 'cups',
    positionMeanings: {
      past: 'You\'ve felt disappointed or overlooked',
      present: 'Something better is being offered - are you paying attention?',
      future: 'New opportunities will emerge from contemplation'
    }
  },
  { 
    id: 'five-cups', 
    name: 'Five of Cups', 
    keywords: ['loss', 'grief', 'moving-on', 'regret', 'sadness'],
    emotions: ['grieving', 'sad', 'lost', 'regretful'],
    upright: 'Loss, grief, moving on. Focus on what remains, not what was lost.',
    reversed: 'Moving forward, acceptance, finding peace, learning from loss.',
    type: 'minor', suit: 'cups',
    positionMeanings: {
      past: 'You\'ve experienced significant loss',
      present: 'Grief is present but healing is beginning',
      future: 'Finding peace after letting go'
    }
  },
  { 
    id: 'six-cups', 
    name: 'Six of Cups', 
    keywords: ['nostalgia', 'memories', 'innocence', 'past-love'],
    emotions: ['nostalgic', 'wistful', 'sweet', 'reminiscing'],
    upright: 'Nostalgia, memories, innocence. Looking back with fondness.',
    reversed: 'Living in the past, unrealistic expectations, moving on from childhood.',
    type: 'minor', suit: 'cups',
    positionMeanings: {
      past: 'Sweet memories are guiding you',
      present: 'Past influences your present feelings',
      future: 'Honor the past while embracing the present'
    }
  },
  { 
    id: 'seven-cups', 
    name: 'Seven of Cups', 
    keywords: ['fantasy', 'choices', 'wishful-thinking', 'illusions'],
    emotions: ['dreaming', 'confused', 'wishful', 'fantasy'],
    upright: 'Fantasy, choices, wishful thinking. Many options, but beware illusion.',
    reversed: 'Clarity comes, making a choice, breaking free from fantasy.',
    type: 'minor', suit: 'cups',
    positionMeanings: {
      past: 'You\'ve been caught in fantasies',
      present: 'Many choices - clarity is needed',
      future: 'Choose wisely between reality and illusion'
    }
  },
  { 
    id: 'eight-cups', 
    name: 'Eight of Cups', 
    keywords: ['walking-away', 'search', 'emotional-journey', 'disappointment'],
    emotions: ['sad', 'seeking', 'moving-on', 'searching'],
    upright: 'Walking away, searching for emotional truth. Leaving something behind.',
    reversed: 'Fear of change, staying too long, finally leaving.',
    type: 'minor', suit: 'cups',
    positionMeanings: {
      past: 'You\'ve left something behind emotionally',
      present: 'It\'s time to walk away from what no longer serves you',
      future: 'The search for emotional truth continues'
    }
  },
  { 
    id: 'nine-cups', 
    name: 'Nine of Cups', 
    keywords: ['satisfaction', 'wishes', 'contentment', 'emotional-fulfillment'],
    emotions: ['happy', 'satisfied', 'fulfilled', 'grateful'],
    upright: 'Satisfaction, wishes fulfilled, emotional contentment.',
    reversed: 'Dissatisfaction, unfulfilled wishes, seeking more.',
    type: 'minor', suit: 'cups',
    positionMeanings: {
      past: 'You\'ve experienced emotional satisfaction',
      present: 'Feeling content with what you have',
      future: 'Your emotional wishes are coming true'
    }
  },
  { 
    id: 'ten-cups', 
    name: 'Ten of Cups', 
    keywords: ['love', 'harmony', 'family-happiness', 'blessing'],
    emotions: ['loving', 'happy', 'fulfilled', 'blessed'],
    upright: 'Love, harmony, family happiness. Perfect emotional life.',
    reversed: 'Broken family, disharmony at home, prioritizing work over family.',
    type: 'minor', suit: 'cups',
    positionMeanings: {
      past: 'Family harmony or disharmony has shaped you',
      present: 'Creating harmony in your closest relationships',
      future: 'A loving, harmonious home life awaits'
    }
  },
  
  // Swords (Thoughts/Decisions)
  { 
    id: 'ace-swords', 
    name: 'Ace of Swords', 
    keywords: ['clarity', 'truth', 'new-idea', 'mental-breakthrough'],
    emotions: ['clear', 'determined', 'truthful', 'sharp'],
    upright: 'Clarity, truth, new idea. A breakthrough in thinking.',
    reversed: 'Confusion, brutality, unfairness, unclear thinking.',
    type: 'minor', suit: 'swords',
    positionMeanings: {
      past: 'A moment of mental clarity',
      present: 'You see the truth clearly',
      future: 'Mental breakthrough is coming'
    }
  },
  { 
    id: 'two-swords', 
    name: 'Two of Swords', 
    keywords: ['indecision', 'blocked', 'choice', 'confusion'],
    emotions: ['confused', 'stuck', 'conflicted', 'paralyzed'],
    upright: 'Indecision, blocked, difficult choice. You must make a decision.',
    reversed: 'Information revealed, decision made, no more avoidance.',
    type: 'minor', suit: 'swords',
    positionMeanings: {
      past: 'You\'ve been avoiding a decision',
      present: 'A difficult choice must be made',
      future: 'Making the decision will free you'
    }
  },
  { 
    id: 'three-swords', 
    name: 'Three of Swords', 
    keywords: ['heartbreak', 'pain', 'grief', 'sorrow', 'betrayal'],
    emotions: ['hurt', 'sad', 'heartbroken', 'crying'],
    upright: 'Heartbreak, pain, grief. The truth hurts, but necessary.',
    reversed: 'Healing, forgiveness, moving through pain.',
    type: 'minor', suit: 'swords',
    positionMeanings: {
      past: 'You\'ve experienced emotional pain',
      present: 'Heartbreak is present but will lead to growth',
      future: 'Healing and forgiveness are possible'
    }
  },
  { 
    id: 'four-swords', 
    name: 'Four of Swords', 
    keywords: ['rest', 'recovery', 'peace', 'contemplation'],
    emotions: ['tired', 'resting', 'peaceful', 'exhausted'],
    upright: 'Rest, recovery, peace. Take time to recuperate.',
    reversed: 'Restlessness, burnout, unable to rest, anxiety.',
    type: 'minor', suit: 'swords',
    positionMeanings: {
      past: 'You needed rest and didn\'t take it',
      present: 'Rest is essential for your recovery',
      future: 'Prioritize rest to heal'
    }
  },
  { 
    id: 'five-swords', 
    name: 'Five of Swords', 
    keywords: ['conflict', 'win-lose', 'aggression', 'confrontation'],
    emotions: ['angry', 'competitive', 'hurt', 'aggressive'],
    upright: 'Conflict, win-lose, aggression. Not all battles are worth fighting.',
    reversed: 'Making peace, forgiveness, letting go of conflict.',
    type: 'minor', suit: 'swords',
    positionMeanings: {
      past: 'You\'ve been in conflict',
      present: 'Conflict surrounds you - choose battles wisely',
      future: 'Peace comes through forgiveness'
    }
  },
  { 
    id: 'six-swords', 
    name: 'Six of Swords', 
    keywords: ['transition', 'journey', 'moving-on', 'passage'],
    emotions: ['hopeful', 'moving', 'transitioning', 'departing'],
    upright: 'Transition, journey, moving on. Crossing to calmer waters.',
    reversed: 'Blocked transition, stuck, refusing to move on.',
    type: 'minor', suit: 'swords',
    positionMeanings: {
      past: 'You\'ve been transitioning',
      present: 'Crossing from difficult to easier times',
      future: 'Journey to calmer waters continues'
    }
  },
  { 
    id: 'seven-swords', 
    name: 'Seven of Swords', 
    keywords: ['strategy', 'deception', 'stealth', 'cleverness'],
    emotions: ['defensive', 'strategic', 'worried', 'guilty'],
    upright: 'Strategy, deception, doing whatever it takes. Temptation to cheat.',
    reversed: 'Confession, guilt revealed, consequences of deception.',
    type: 'minor', suit: 'swords',
    positionMeanings: {
      past: 'Something was taken or deception occurred',
      present: 'Tempted to take shortcuts - consider consequences',
      future: 'Truth will out - be honest'
    }
  },
  { 
    id: 'eight-swords', 
    name: 'Eight of Swords', 
    keywords: ['trapped', 'restricted', 'victim', 'helplessness'],
    emotions: ['trapped', 'stuck', 'helpless', 'victimized'],
    upright: 'Trapped, restricted, self-imposed prison. You have more power than you think.',
    reversed: 'Breaking free, liberation, realizing your strength.',
    type: 'minor', suit: 'swords',
    positionMeanings: {
      past: 'You\'ve felt trapped or restricted',
      present: 'You are creating your own prison - break free',
      future: 'Liberation through self-realization'
    }
  },
  { 
    id: 'nine-swords', 
    name: 'Nine of Swords', 
    keywords: ['anxiety', 'fear', 'nightmare', 'worry', 'guilt'],
    emotions: ['anxious', 'fearful', 'worried', 'guilty'],
    upright: 'Anxiety, fear, nightmares. Your thoughts are your enemy.',
    reversed: 'Seeking help, breaking free from worry, hope returns.',
    type: 'minor', suit: 'swords',
    positionMeanings: {
      past: 'Anxiety and worry have plagued you',
      present: 'Nightmare thinking is taking over - seek support',
      future: 'Relief from anxiety is possible'
    }
  },
  { 
    id: 'ten-swords', 
    name: 'Ten of Swords', 
    keywords: ['betrayal', 'ending', 'pain', 'rock-bottom'],
    emotions: ['betrayed', 'devastated', 'ended', 'destroyed'],
    upright: 'Betrayal, ending, rock bottom. The worst has happened.',
    reversed: 'Recovery, rebirth, healing begins, slowly getting back up.',
    type: 'minor', suit: 'swords',
    positionMeanings: {
      past: 'A devastating betrayal or ending',
      present: 'At rock bottom - the only way is up',
      future: 'Rebirth after destruction'
    }
  },
  
  // Wands (Action/Career)
  { 
    id: 'ace-wands', 
    name: 'Ace of Wands', 
    keywords: ['inspiration', 'new-beginnings', 'action', 'creativity', 'spark'],
    emotions: ['inspired', 'ready', 'energetic', 'excited'],
    upright: 'New action, inspiration, growth. A spark of creative energy.',
    reversed: 'Delays, lack of direction, creative blocks.',
    type: 'minor', suit: 'wands',
    positionMeanings: {
      past: 'A new spark of inspiration',
      present: 'Creative energy is surging - act on it',
      future: 'New beginnings are coming'
    }
  },
  { 
    id: 'two-wands', 
    name: 'Two of Wands', 
    keywords: ['planning', 'future', 'progress', 'vision'],
    emotions: ['planning', 'optimistic', 'ready', 'anticipating'],
    upright: 'Planning, future vision, decisions about next steps.',
    reversed: 'Fear of unknown, poor planning, lack of vision.',
    type: 'minor', suit: 'wands',
    positionMeanings: {
      past: 'You\'ve been planning your next move',
      present: 'Your future is being shaped by choices now',
      future: 'A clear vision of what\'s next'
    }
  },
  { 
    id: 'three-wands', 
    name: 'Three of Wands', 
    keywords: ['progress', 'expansion', 'patience', 'forecasting'],
    emotions: ['growing', 'patient', 'expectant', 'anticipating'],
    upright: 'Expansion, progress, foresight. Your efforts are paying off.',
    reversed: 'Obstacles, delays, frustration, waiting unnecessarily.',
    type: 'minor', suit: 'wands',
    positionMeanings: {
      past: 'Your work is showing progress',
      present: 'Expansion and growth are happening',
      future: 'Patience will be rewarded with progress'
    }
  },
  { 
    id: 'four-wands', 
    name: 'Four of Wands', 
    keywords: ['celebration', 'home', 'harmony', 'arrival'],
    emotions: ['happy', 'celebrating', 'home', 'arriving'],
    upright: 'Celebration, harmony, arriving at a place of rest.',
    reversed: 'Unstable situation, conflict in the home, celebration on hold.',
    type: 'minor', suit: 'wands',
    positionMeanings: {
      past: 'A time of celebration',
      present: 'Creating harmony at home or work',
      future: 'Celebration and rest await'
    }
  },
  { 
    id: 'five-wands', 
    name: 'Five of Wands', 
    keywords: ['conflict', 'competition', 'challenge', 'tension'],
    emotions: ['competitive', 'stressed', 'challenged', 'frustrated'],
    upright: 'Conflict, competition, tension. Everyone competing for the same goal.',
    reversed: 'Avoiding conflict, compromise, end of competition.',
    type: 'minor', suit: 'wands',
    positionMeanings: {
      past: 'You\'ve faced competition',
      present: 'Tension and challenges around you',
      future: 'Conflict will resolve or be avoided'
    }
  },
  { 
    id: 'six-wands', 
    name: 'Six of Wands', 
    keywords: ['victory', 'recognition', 'triumph', 'success'],
    emotions: ['victorious', 'proud', 'celebrated', 'successful'],
    upright: 'Victory, recognition, success. You\'ve won and others know it.',
    reversed: 'Ego, lack of recognition, failure to achieve.',
    type: 'minor', suit: 'wands',
    positionMeanings: {
      past: 'You\'ve achieved victory',
      present: 'Recognition for your efforts',
      future: 'Triumph and celebration are coming'
    }
  },
  { 
    id: 'seven-wands', 
    name: 'Seven of Wands', 
    keywords: ['defense', 'challenge', 'will', 'perseverance'],
    emotions: ['defensive', 'determined', 'challenged', 'stressed'],
    upright: 'Defense, challenge, perseverance. You must hold your ground.',
    reversed: 'Exhaustion, giving up, feeling overwhelmed.',
    type: 'minor', suit: 'wands',
    positionMeanings: {
      past: 'You\'ve been defending your position',
      present: 'A challenge requires your defense',
      future: 'Perseverance will lead to success'
    }
  },
  { 
    id: 'eight-wands', 
    name: 'Eight of Wands', 
    keywords: ['speed', 'movement', 'rapid-change', 'action'],
    emotions: ['fast-paced', 'moving', 'quick', 'anticipating'],
    upright: 'Fast movement, rapid progress. Things are moving quickly.',
    reversed: 'Delays, frustration, waiting, things held up.',
    type: 'minor', suit: 'wands',
    positionMeanings: {
      past: 'Rapid movement or change',
      present: 'Things are moving fast around you',
      future: 'Quick action brings results'
    }
  },
  { 
    id: 'nine-wands', 
    name: 'Nine of Wands', 
    keywords: ['perseverance', 'last-stand', 'tired', 'resilience'],
    emotions: ['tired', 'persevering', 'holding-on', 'drained'],
    upright: 'Resilience, persistence, near completion. Just a bit further.',
    reversed: 'Paranoia, exhaustion, giving up, feeling defeated.',
    type: 'minor', suit: 'wands',
    positionMeanings: {
      past: 'You\'ve been holding on through difficulty',
      present: 'One last push is needed',
      future: 'Persistence will pay off'
    }
  },
  { 
    id: 'ten-wands', 
    name: 'Ten of Wands', 
    keywords: ['burden', 'responsibility', 'weight', 'overwork'],
    emotions: ['burdened', 'heavy', 'stressed', 'overwhelmed'],
    upright: 'Burden, responsibility, heavy load. Carrying too much.',
    reversed: 'Inability to delegate, burnout, finally letting go.',
    type: 'minor', suit: 'wands',
    positionMeanings: {
      past: 'You\'ve been carrying a heavy burden',
      present: 'The weight is becoming too much',
      future: 'Learning to delegate will bring relief'
    }
  },
  
  // Pentacles (Material/Finance)
  { 
    id: 'ace-pentacles', 
    name: 'Ace of Pentacles', 
    keywords: ['opportunity', 'new-beginnings', 'material', 'prosperity'],
    emotions: ['excited', 'opportunistic', 'new', 'hopeful'],
    upright: 'Opportunity, new beginning, prosperity. A concrete gift arrives.',
    reversed: 'Missed opportunity, bad investment, not ready to receive.',
    type: 'minor', suit: 'pentacles',
    positionMeanings: {
      past: 'A material opportunity came your way',
      present: 'A new opportunity is presenting itself',
      future: 'Prosperity and new beginnings align'
    }
  },
  { 
    id: 'two-pentacles', 
    name: 'Two of Pentacles', 
    keywords: ['balance', 'choices', 'flexibility', 'juggling'],
    emotions: ['balancing', 'choosing', 'flexible', 'stressed'],
    upright: 'Balance, choices, flexibility. Juggling priorities.',
    reversed: 'Imbalance, overwhelmed, making poor choices.',
    type: 'minor', suit: 'pentacles',
    positionMeanings: {
      past: 'You\'ve been balancing multiple things',
      present: 'Need to balance competing priorities',
      future: 'Finding equilibrium is key'
    }
  },
  { 
    id: 'three-pentacles', 
    name: 'Three of Pentacles', 
    keywords: ['work', 'collaboration', 'skill', 'craft'],
    emotions: ['working', 'skilled', 'collaborative', 'proud'],
    upright: 'Work, collaboration, skill. Teamwork producing results.',
    reversed: 'Lack of teamwork, poor craftsmanship, working alone.',
    type: 'minor', suit: 'pentacles',
    positionMeanings: {
      past: 'You\'ve built something with others',
      present: 'Collaboration is needed for success',
      future: 'Your skills will be recognized and rewarded'
    }
  },
  { 
    id: 'four-pentacles', 
    name: 'Four of Pentacles', 
    keywords: ['security', 'control', 'holding-on', 'possession'],
    emotions: ['secure', 'controlling', 'guarded', 'fearful'],
    upright: 'Security, control, holding on. Protecting what you have.',
    reversed: 'Generosity, sharing, releasing control.',
    type: 'minor', suit: 'pentacles',
    positionMeanings: {
      past: 'You\'ve been holding tightly to something',
      present: 'Security is your priority',
      future: 'Learning to share will bring freedom'
    }
  },
  { 
    id: 'five-pentacles', 
    name: 'Five of Pentacles', 
    keywords: ['hardship', 'isolation', 'struggle', 'poverty'],
    emotions: ['struggling', 'isolated', 'needy', 'excluded'],
    upright: 'Hardship, isolation, struggle. Feeling left out in the cold.',
    reversed: 'Recovery, healing, help is coming, community support.',
    type: 'minor', suit: 'pentacles',
    positionMeanings: {
      past: 'You\'ve been through financial or material hardship',
      present: 'Feeling isolated in your struggle',
      future: 'Help and community support are on the way'
    }
  },
  { 
    id: 'six-pentacles', 
    name: 'Six of Pentacles', 
    keywords: ['generosity', 'sharing', 'charity', 'balance'],
    emotions: ['generous', 'giving', 'receiving', 'grateful'],
    upright: 'Generosity, sharing, charity. Balance in giving and receiving.',
    reversed: 'Selfishness, debts, one-sided generosity.',
    type: 'minor', suit: 'pentacles',
    positionMeanings: {
      past: 'You\'ve given or received generosity',
      present: 'Finding balance between giving and receiving',
      future: 'Prosperity through sharing'
    }
  },
  { 
    id: 'seven-pentacles', 
    name: 'Seven of Pentacles', 
    keywords: ['patience', 'investment', 'reward', 'wait'],
    emotions: ['patient', 'investing', 'waiting', 'anticipating'],
    upright: 'Patience, investment, waiting for reward. Your work will pay off.',
    reversed: 'Impatience, poor investment, wanting results now.',
    type: 'minor', suit: 'pentacles',
    positionMeanings: {
      past: 'You\'ve been investing in something',
      present: 'Patience is needed while investments grow',
      future: 'Your patience will be rewarded'
    }
  },
  { 
    id: 'eight-pentacles', 
    name: 'Eight of Pentacles', 
    keywords: ['skill', 'learning', 'craft', 'expertise'],
    emotions: ['learning', 'skilled', 'practicing', 'dedicated'],
    upright: 'Skill, learning, craft. Developing mastery through practice.',
    reversed: 'Lack of focus, not using skills, amateurish.',
    type: 'minor', suit: 'pentacles',
    positionMeanings: {
      past: 'You\'ve been developing new skills',
      present: 'Focus on mastering your craft',
      future: 'Expertise through dedication'
    }
  },
  { 
    id: 'nine-pentacles', 
    name: 'Nine of Pentacles', 
    keywords: ['independence', 'luxury', 'accomplishment', 'self-sufficiency'],
    emotions: ['independent', 'accomplished', 'comfortable', 'proud'],
    upright: 'Independence, luxury, accomplishment. You\'ve made it.',
    reversed: 'Dependency, insecurity, financial loss.',
    type: 'minor', suit: 'pentacles',
    positionMeanings: {
      past: 'You\'ve achieved material success',
      present: 'Enjoying the rewards of your work',
      future: 'Continued independence and comfort'
    }
  },
  { 
    id: 'ten-pentacles', 
    name: 'Ten of Pentacles', 
    keywords: ['wealth', 'legacy', 'family', 'inheritance'],
    emotions: ['wealthy', 'fulfilled', 'established', 'blessed'],
    upright: 'Wealth, legacy, family prosperity. A lasting inheritance.',
    reversed: 'Financial loss, family conflict, broken family ties.',
    type: 'minor', suit: 'pentacles',
    positionMeanings: {
      past: 'Family wealth or legacy has played a role',
      present: 'Building wealth for future generations',
      future: 'A prosperous legacy is being created'
    }
  },
];

export function getCardById(id: string): TarotCard | undefined {
  return tarotDeck.find(card => card.id === id);
}

export function getAllCards(): TarotCard[] {
  return tarotDeck;
}

export function getCardsByKeyword(keyword: string): TarotCard[] {
  const lower = keyword.toLowerCase();
  return tarotDeck.filter(card => 
    card.keywords.some(k => k.toLowerCase().includes(lower)) ||
    card.emotions.some(e => e.toLowerCase().includes(lower))
  );
}

export function getCardsByEmotion(emotion: string): TarotCard[] {
  const lower = emotion.toLowerCase();
  return tarotDeck.filter(card => 
    card.emotions.some(e => e.toLowerCase().includes(lower))
  );
}
