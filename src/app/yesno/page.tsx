'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Share2, Copy, Check } from 'lucide-react';
import tarotData from '@/data/tarot-data.json';

interface YesNoCard {
  name: string;
  image: string;
  yes_no: string;
  upright: string;
  reversed: string;
}

export default function YesNoPage() {
  const [step, setStep] = useState<'question' | 'suspense' | 'reveal'>('question');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [selectedCard, setSelectedCard] = useState<YesNoCard | null>(null);
  const [showFlip, setShowFlip] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timeoutRef.current.forEach(clearTimeout);
      timeoutRef.current = [];
    };
  }, []);

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    if (value.trim().length >= 3) {
      setError('');
    }
  };

  const selectCard = (q: string): YesNoCard => {
    // Deterministic selection based on question hash
    let hash = 0;
    for (let i = 0; i < q.length; i++) {
      const char = q.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const index = Math.abs(hash) % tarotData.cards.length;
    return tarotData.cards[index];
  };

  const getYesNoInterpretation = (card: YesNoCard, question: string) => {
    const result = card.yes_no;
    
    const emotionalOpenings = {
      Yes: [
        'The energy says yes — this path aligns with your truth.',
        'A strong affirmative — conditions favor your desire.',
        'The cards confirm: movement toward this goal is supported.',
      ],
      No: [
        'The wisdom here says no — not the right time or way.',
        'A protective energy suggests redirecting this focus.',
        'This answer protects what is fragile; tend to your foundation first.',
      ],
      Maybe: [
        'The situation remains fluid — too many variables to be certain.',
        'Mixed signals suggest waiting for clearer timing.',
        'Neither yes nor no — the answer lies in your choices ahead.',
      ],
    };

    const guidanceTexts = {
      Yes: [
        'Proceed with confidence — but stay attuned to signs along the way.',
        'This affirmation carries responsibility — act with clear intention.',
      ],
      No: [
        'Use this pause to gather resources and refine your approach.',
        'Redirect this energy toward what is possible right now.',
      ],
      Maybe: [
        'Observe without forcing — allow clarity to emerge naturally.',
        'Your next action should be small, reversible, and observant.',
      ],
    };

    const opening = emotionalOpenings[result as keyof typeof emotionalOpenings][
      Math.floor(Math.random() * emotionalOpenings[result as keyof typeof emotionalOpenings].length)
    ];

    const guidance = guidanceTexts[result as keyof typeof guidanceTexts][
      Math.floor(Math.random() * guidanceTexts[result as keyof typeof guidanceTexts].length)
    ];

    return {
      resultText: result,
      emotionalOpening: opening,
      guidance,
    };
  };

  const handleSubmit = () => {
    if (question.trim().length < 3) {
      setError('Your question needs your heart, not just your words. Ask with care.');
      return;
    }
    setError('');
    setStep('suspense');

    timeoutRef.current.push(
      setTimeout(() => {
        const card = selectCard(question);
        const interpretation = getYesNoInterpretation(card, question);
        setSelectedCard(card);
        setShowFlip(true);
        setResult(card, interpretation);
      }, 2000)
    );

    timeoutRef.current.push(
      setTimeout(() => {
        setStep('reveal');
        setShowShare(true);
      }, 3500)
    );
  };

  const setResult = (card: YesNoCard, interpretation: any) => {
    // Store in session storage for persistence
    try {
      const existing = JSON.parse(sessionStorage.getItem('yesno_readings') || '[]');
      existing.push({
        question,
        card: card.name,
        result: interpretation.resultText,
        timestamp: new Date().toISOString(),
      });
      sessionStorage.setItem('yesno_readings', JSON.stringify(existing.slice(-20)));
    } catch (e) {
      // Ignore storage errors
    }
  };

  const handleNewReading = () => {
    setQuestion('');
    setSelectedCard(null);
    setShowFlip(false);
    setShowShare(false);
    setCopied(false);
    setStep('question');
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const handleShare = async (platform: 'copy' | 'whatsapp') => {
    if (!selectedCard || !question) return;

    const texts = [
      'The cards spoke...',
      'Tarot insight...',
      'A message from the cards...',
    ];
    const opener = texts[Math.floor(Math.random() * texts.length)];

    const text = `${opener}\n\n"${question}"\n\n${selectedCard.name} — ${getYesNoInterpretation(selectedCard, question).resultText}\n\n✨ Divine Tarot`;

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Copy failed:', e);
      }
    } else if (platform === 'whatsapp') {
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  // Question Screen
  if (step === 'question') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24 pb-12 md:pt-32">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8"
            >
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-flex rounded-full p-4 bg-[#C9A962]/10 mb-6"
                >
                  <Sparkles className="h-8 w-8 text-[#C9A962]" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-serif text-[#E8E4DC] mb-4">Yes or No?</h1>
                <p className="text-[#8E8E93] text-lg">A clear answer from the cards</p>
              </div>

              <div className="space-y-4 max-w-lg mx-auto">
                <div>
                  <label className="block text-[#C9A962] text-sm mb-2">Your Question</label>
                  <textarea
                    value={question}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                    placeholder="What weighs on your heart?"
                    rows={3}
                    maxLength={200}
                    className={`w-full bg-[#1A1A24] border ${error ? 'border-[#D4AF37]/50' : 'border-[#2A2A3A]'} rounded-xl px-4 py-3 text-[#E8E4DC] focus:outline-none focus:border-[#C9A962] placeholder-[#4A4A5A] resize-none transition-colors`}
                  />
                  {error && <p className="text-[#D4AF37]/80 text-sm mt-2">{error}</p>}
                  <p className="text-[#8E8E93]/60 text-xs mt-2 text-right">{question.length}/200</p>
                </div>

                  <motion.button
                    onClick={handleSubmit}
                    disabled={question.trim().length < 3}
                    whileHover={{ scale: question.trim().length >= 3 ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A962] to-[#D4AF37] text-[#0B0B0F] font-serif text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                  <Sparkles className="h-5 w-5" />
                  Seek Answer
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Suspense Screen
  if (step === 'suspense') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center px-4"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-b from-[#C9A962]/10 to-transparent pointer-events-none"
          />
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex rounded-full p-6 bg-[#C9A962]/10 mb-8"
          >
            <Sparkles className="h-12 w-12 text-[#C9A962] animate-pulse" />
          </motion.div>
          <p className="font-serif text-2xl md:text-3xl text-[#E8E4DC] mb-4">
            The cards are gathering...
          </p>
          <p className="text-[#8E8E93]">Listening to what wants to be known</p>
        </motion.div>
      </div>
    );
  }

  // Reveal Screen
  if (step === 'reveal' && selectedCard) {
    const interpretation = getYesNoInterpretation(selectedCard, question);
    const isYes = interpretation.resultText === 'Yes';
    const isNo = interpretation.resultText === 'No';

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24 pb-12 md:pt-32">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              {/* Card Display with Flip Animation */}
              <motion.div
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: showFlip ? 0 : -90, opacity: showFlip ? 1 : 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-48 h-72 relative rounded-2xl bg-gradient-to-br from-[#1A1A24] to-[#0B0B0F] border-2 border-[#C9A962]/50 flex flex-col items-center justify-center shadow-2xl shadow-[#C9A962]/20 mb-8"
              >
                {showFlip && selectedCard && (
                  <>
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <img
                        src={selectedCard.image}
                        alt={selectedCard.name}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold bg-[#1A1A24]/80 backdrop-blur-sm">
                      {interpretation.resultText}
                    </div>
                  </>
                )}
              </motion.div>

              {/* Result Text */}
              {showFlip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className={`inline-block px-8 py-4 rounded-2xl mb-6 ${
                    isYes
                      ? 'bg-gradient-to-r from-[#C9A962]/30 to-[#D4AF37]/30 shadow-lg shadow-[#C9A962]/30'
                      : isNo
                      ? 'bg-gradient-to-r from-[#D4AF37]/30 to-[#C9A962]/30 shadow-lg shadow-[#D4AF37]/30'
                      : 'bg-[#1A1A24] border border-[#2A2A3A]'
                  }`}
                >
                  <span className={`font-serif text-4xl md:text-5xl ${
                    isYes ? 'text-[#C9A962]' : isNo ? 'text-[#D4AF37]' : 'text-[#8E8E93]'
                  }`}>
                    {interpretation.resultText}
                  </span>
                </motion.div>
              )}

              {/* Emotional Opening */}
              {showFlip && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-[#C9B098] text-lg italic text-center max-w-md mx-auto mb-6 leading-relaxed"
                >
                  {interpretation.emotionalOpening}
                </motion.p>
              )}

              {/* Guidance */}
              {showFlip && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="w-full max-w-md bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A3A] mb-8"
                >
                  <p className="text-[#C9A962] text-sm mb-2">Guidance</p>
                  <p className="text-[#E8E4DC] text-sm leading-relaxed">{interpretation.guidance}</p>
                  <div className="mt-4 pt-4 border-t border-[#2A2A3A]">
                    <p className="text-[#8E8E93] text-xs mb-1">Card</p>
                    <p className="text-[#E8E4DC] font-serif">{selectedCard.name}</p>
                  </div>
                </motion.div>
              )}

              {/* Share */}
              {showShare && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md"
                >
                  <div className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A3A] mb-6">
                    <p className="text-[#8E8E93] text-center mb-4">Share your insight</p>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        onClick={() => handleShare('copy')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2A2A3A] border border-[#2A2A3A] hover:border-[#C9A962]/50 text-[#E8E4DC] transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 text-[#C9A962]" />
                            <span className="text-[#C9A962]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare('whatsapp')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] text-[#0B0B0F] font-semibold"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* New Reading */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-4"
              >
                <motion.button
                  onClick={handleNewReading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2A2A3A] hover:bg-[#3A3A4A] text-[#8E8E93] hover:text-[#C9A962] transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm">Ask Another</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return null;
}