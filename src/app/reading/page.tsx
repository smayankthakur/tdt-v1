'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import tarotData from '@/data/tarot-data.json';

export default function ReadingPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');
  const [step, setStep] = useState<'input' | 'shuffle' | 'selection' | 'reading' | 'result'>('input');

  const [availableCards, setAvailableCards] = useState<typeof tarotData.cards>([]);
  const [selectedCards, setSelectedCards] = useState<Array<typeof tarotData.cards[number] & { index: number }>>([]);
  const [cardStates, setCardStates] = useState<Record<number, 'face-down' | 'selected'>>({});
  const [reading, setReading] = useState<Array<typeof tarotData.cards[number] & {
    position: { title: string; desc: string };
    isReversed: boolean;
    meaning: string;
    yesNo: string;
  }>>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);
  const [shuffleCount, setShuffleCount] = useState(0);
  const shuffleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const cards = [...tarotData.cards].sort(() => Math.random() - 0.5);
    setAvailableCards(cards);
    const states: Record<number, 'face-down' | 'selected'> = {};
    cards.forEach((_, i) => {
      states[i] = 'face-down';
    });
    setCardStates(states);
    return () => {
      if (shuffleIntervalRef.current) clearInterval(shuffleIntervalRef.current);
    };
  }, []);

  const handleShuffle = () => {
    if (!name.trim() || !question.trim()) return;
    setStep('shuffle');
    setShuffleCount(0);
    setSelectedCards([]);
    setReading([]);
    setCurrentRevealIndex(0);

    const newCards = [...tarotData.cards].sort(() => Math.random() - 0.5);
    setAvailableCards(newCards);
    const states: Record<number, 'face-down' | 'selected'> = {};
    newCards.forEach((_, i) => {
      states[i] = 'face-down';
    });
    setCardStates(states);

    shuffleIntervalRef.current = setInterval(() => {
      setShuffleCount((c) => c + 1);
    }, 100);

    setTimeout(() => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current);
        shuffleIntervalRef.current = null;
      }
      setStep('selection');
    }, 3000);
  };

  const handleCardClick = (card: typeof tarotData.cards[number], index: number) => {
    if (step !== 'selection') return;
    if (cardStates[index] === 'selected') return;
    if (selectedCards.length >= 3) return;

    setCardStates((prev) => ({ ...prev, [index]: 'selected' }));
    setSelectedCards((prev) => [...prev, { ...card, index }]);
  };

  const handleBeginReading = () => {
    if (selectedCards.length !== 3) return;
    setStep('reading');

    const positions = [
      { title: 'Past', desc: 'What has led you here.' },
      { title: 'Present', desc: 'Where you are now.' },
      { title: 'Future', desc: 'The direction ahead.' },
    ];

    const cards = selectedCards.map((card, position) => {
      const isReversed = Math.random() > 0.5;
      return {
        ...card,
        position: positions[position],
        isReversed,
        meaning: isReversed ? card.reversed : card.upright,
        yesNo: card.yes_no,
      };
    });

    setReading(cards);
    setCurrentRevealIndex(0);

    const interval = setInterval(() => {
      setCurrentRevealIndex((i) => {
        if (i >= 2) {
          clearInterval(interval);
          setStep('result');
          return i;
        }
        return i + 1;
      });
    }, 2000);
  };

  const genSummary = () => {
    const yesCount = reading.filter((c) => c.yesNo === 'Yes').length;
    const noCount = reading.filter((c) => c.yesNo === 'No').length;
    const maybeCount = reading.filter((c) => c.yesNo === 'Maybe').length;
    const hasReversed = reading.some((c) => c.isReversed);

    let summary = `${name}, the cards reveal insights about your question: "${question}". `;

    if (yesCount >= 2) {
      summary += 'The energy is strongly affirmative — favorable conditions support your path forward. ';
    } else if (noCount >= 2) {
      summary += 'The wisdom here suggests restraint — now is not the time to force this direction. ';
    } else if (maybeCount >= 2) {
      summary += 'The picture is nuanced and complex — clarity will emerge through patience and reflection. ';
    } else {
      summary += 'A mixed pattern emerges — multiple currents flow through your situation. ';
    }

    if (hasReversed) {
      summary += 'Reversed cards indicate inner obstacles or the need to approach from a different angle.';
    }

    return summary;
  };

  const resetReading = () => {
    setStep('input');
    setName('');
    setQuestion('');
    setSelectedCards([]);
    setReading([]);
    setCurrentRevealIndex(0);
    const cards = [...tarotData.cards].sort(() => Math.random() - 0.5);
    setAvailableCards(cards);
    const states: Record<number, 'face-down' | 'selected'> = {};
    cards.forEach((_, i) => {
      states[i] = 'face-down';
    });
    setCardStates(states);
  };

  // Input Screen
  if (step === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex rounded-full p-4 bg-[#C9A962]/10 mb-6">
              <Star className="h-8 w-8 text-[#C9A962]" />
            </div>
            <h1 className="text-4xl font-serif text-[#E8E4DC] mb-4">Sacred Tarot Reading</h1>
            <p className="text-[#8E8E93]">Ask your question. The cards will reveal their wisdom.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div>
              <label className="block text-[#C9A962] text-sm mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#1A1A24] border border-[#2A2A3A] rounded-xl px-4 py-3 text-[#E8E4DC] focus:outline-none focus:border-[#C9A962] placeholder-[#4A4A5A]"
              />
            </div>
            <div>
              <label className="block text-[#C9A962] text-sm mb-2">Your Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What do you seek guidance on?"
                rows={4}
                className="w-full bg-[#1A1A24] border border-[#2A2A3A] rounded-xl px-4 py-3 text-[#E8E4DC] focus:outline-none focus:border-[#C9A962] placeholder-[#4A4A5A] resize-none"
              />
            </div>
            <motion.button
              onClick={handleShuffle}
              disabled={!name.trim() || !question.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#C9A962] to-[#D4AF37] text-[#0B0B0F] font-serif text-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Star className="h-5 w-5" />
              Begin Reading
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Shuffle Screen
  if (step === 'shuffle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 * shuffleCount }}
            transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-8"
          >
            <div className="w-24 h-24 rounded-full border-4 border-[#C9A962] border-t-transparent"></div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-serif text-[#E8E4DC] mb-4"
          >
            Shuffling the Deck
          </motion.h2>
          <p className="text-[#8E8E93]">Infusing with your intention...</p>
        </div>
      </div>
    );
  }

  // Selection Screen
  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={() => setStep('input')}
            className="flex items-center gap-2 text-[#C9A962] mb-8 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-serif text-[#E8E4DC] mb-2">Choose Three Cards</h2>
            <p className="text-[#8E8E93]">Select the cards that call to you</p>
          </div>

          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A962]/10">
              <span className="text-[#C9A962] font-semibold">{selectedCards.length}/3 selected</span>
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
            <AnimatePresence>
              {availableCards.map((card, index) => {
                const state = cardStates[index];
                if (state === undefined || state !== 'face-down' && state !== 'selected') {
                  // Hidden cards are filtered out
                  if (state !== 'selected' && state !== 'face-down') return null;
                }
                return (
                  <motion.div
                    key={card.id + '_' + index}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      onClick={() => handleCardClick(card, index)}
                      whileHover={{ scale: state !== 'selected' ? 1.05 : 1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative aspect-[2/3] rounded-xl cursor-pointer transition-all duration-300 overflow-hidden ${
                        state === 'selected'
                          ? 'ring-2 ring-[#C9A962] shadow-lg shadow-[#C9A962]/30 brightness-110'
                          : 'ring-1 ring-[#2A2A3A] hover:ring-[#C9A962]/50'
                      }`}
                    >
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-contain bg-[#1A1A24]"
                        loading="lazy"
                      />
                      {state === 'selected' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 bg-[#C9A962]/20 flex items-center justify-center"
                        >
                          <Check className="h-6 w-6 text-[#C9A962] stroke-[3]" />
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="flex justify-center">
            <motion.button
              onClick={handleBeginReading}
              disabled={selectedCards.length !== 3}
              whileHover={{ scale: selectedCards.length === 3 ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              className="py-4 px-8 rounded-xl bg-gradient-to-r from-[#C9A962] to-[#D4AF37] text-[#0B0B0F] font-serif text-lg font-semibold flex items-center gap-2 shadow-lg shadow-[#C9A962]/20 disabled:opacity-50"
            >
              <Star className="h-5 w-5" />
              Begin Reading
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // Reading Reveal Screen
  if (step === 'reading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-[#E8E4DC] mb-4">Your Reading</h2>
            <p className="text-[#8E8E93]">The cards reveal their messages...</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
          {selectedCards.map((card, i) => (
            <motion.div
              key={card.index}
              initial={{ opacity: 0, y: 20 }}
              animate={currentRevealIndex >= i ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: i * 0.3 }}
              className={`bg-[#1A1A24] rounded-xl p-6 border ${
                currentRevealIndex >= i ? 'border-[#C9A962]/30' : 'border-[#2A2A3A]'
              }`}
            >
              <div className="text-center mb-4">
                <span className="text-[#C9A962] text-sm font-medium bg-[#C9A962]/10 px-3 py-1 rounded-full">
                  {["Past", "Present", "Future"][i]}
                </span>
              </div>
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#0B0B0F] mb-4">
                <img src={card.image} alt={card.name} className="w-full h-full object-contain" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif text-[#E8E4DC] mb-2">{card.name}</h3>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-[#C9A962] mb-8 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex rounded-full p-4 bg-[#C9A962]/10 mb-6">
            <Star className="h-8 w-8 text-[#C9A962]" />
          </div>
          <h1 className="text-4xl font-serif text-[#E8E4DC] mb-4">Reading Complete</h1>
          <p className="text-[#8E8E93]">{name}, the cards reveal your path</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {reading.map((card, i) => (
            <div key={i} className="bg-[#1A1A24] rounded-xl p-6 border border-[#2A2A3A]">
              <div className="text-center mb-4">
                <span className="text-[#C9A962] text-sm font-medium bg-[#C9A962]/10 px-3 py-1 rounded-full">
                  {card.position.title}
                </span>
              </div>
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#0B0B0F] mb-4">
                <img src={card.image} alt={card.name} className="w-full h-full object-contain" />
              </div>
              <h3 className="text-lg font-serif text-[#E8E4DC] mb-2 text-center">{card.name}</h3>
              <p className="text-[#8E8E93] text-sm text-center mb-3">
                <span className={card.isReversed ? 'text-[#D4AF37]' : 'text-[#C9A962]' }>
                  [{card.isReversed ? 'Reversed' : 'Upright'}]
                </span>
              </p>
              <p className="text-[#C9B098] text-sm leading-relaxed text-center">{card.meaning}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1A1A24] rounded-xl p-8 border border-[#2A2A3A] mb-8"
        >
          <h2 className="text-2xl font-serif text-[#E8E4DC] mb-6 text-center">Interpretation</h2>
          <div className="text-[#C9B098] leading-relaxed space-y-4 max-w-3xl mx-auto">
            <p className="text-[#C9B098] leading-relaxed text-lg text-center mb-6 italic text-[#8E8E93]">{`"${question}"`}</p>
            <p className="text-[#E8E4DC] text-base leading-relaxed">{genSummary()}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C9A962]/10">
            <Star className="h-5 w-5 text-[#C9A962]" />
            <span className="text-[#C9A962] font-medium">
              {reading.map((c) => c.yesNo).join(', ')}
            </span>
          </div>
        </motion.div>

        <div className="flex justify-center gap-4 mt-12">
          <motion.button
            onClick={resetReading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-xl bg-[#1A1A24] border border-[#2A2A3A] text-[#E8E4DC] font-serif text-lg hover:border-[#C9A962]/50 transition-colors"
          >
            New Reading
          </motion.button>
        </div>
      </div>
    </div>
  );
}