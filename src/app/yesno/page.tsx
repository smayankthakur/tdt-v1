'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, MessageCircle, Copy, RefreshCw, Lock } from 'lucide-react';
import { useYesNoStore, YesNoResult } from '@/store/yesno-store';
import { selectYesNoCard, generateYesNoResponse, yesNoSuspenseMessages, yesNoEmptyQuestionMessage, YesNoTarotCard } from '@/lib/yesNoTarot';
import { useLanguage } from '@/hooks/useLanguage';
import { useAutoLanguage } from '@/hooks/useAutoLanguage';

const SHARE_TEXT_TEMPLATES = [
  "Maine apna question pucha aur yeh answer mila… 😳\nTum bhi try karo:",
  "Yeh tarot reading toh boundary maarega… 😱\nTum bhi dekho:",
  "Kya haqiqat mein yeh soch rahe thein? 🤔\nApna result check karo:",
];

const PAYWALL_MESSAGES = [
  "Ab jo aage aa raha hai… woh thoda deeper hai.",
  "Yeh sirf simple yes/no nahi… ismein poori clarity milegi.",
  "Aage jo hai woh bahut important hai… tumhe zaroor pata chahiye.",
];

type YesNoStep = 'question' | 'suspense' | 'reveal';

export default function YesNoPage() {
  const { t } = useLanguage();
  const { handleUserInput } = useAutoLanguage();
  
  const {
    yesNoReadings,
    incrementReading,
    setResult,
    canRead,
    getRemainingReadings,
    shouldShowHint,
    paywallShown,
    setPaywallShown,
    paywallDismissedCount,
    dismissPaywall,
    referralCode,
    setReferredBy,
  } = useYesNoStore();
  
  const [step, setStep] = useState<YesNoStep>('question');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [ynCard, setYnCard] = useState<YesNoTarotCard | null>(null);
  const [ynResponse, setYnResponse] = useState<ReturnType<typeof generateYesNoResponse> | null>(null);
  const [showFlip, setShowFlip] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get('ref');
      if (ref) {
        setReferredBy(ref);
      }
    }
  }, [setReferredBy]);

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    if (value.length > 5) {
      handleUserInput(value);
    }
  };

  const handleSubmit = () => {
    if (question.length < 3) {
      setError(yesNoEmptyQuestionMessage);
      return;
    }
    setError('');
    setStep('suspense');
    
    timeoutRef.current.push(
      setTimeout(() => {
        const selectedCard = selectYesNoCard(question);
        setYnCard(selectedCard);
        const response = generateYesNoResponse(question, selectedCard);
        setYnResponse(response);
        setShowFlip(true);
        setResult(selectedCard.result, selectedCard.name);
        incrementReading();
      }, 1500)
    );
    
    timeoutRef.current.push(
      setTimeout(() => {
        setStep('reveal');
        setTimeout(() => setShowShare(true), 1500);
      }, 1800)
    );
  };

  const handleNewReading = () => {
    setQuestion('');
    setYnCard(null);
    setYnResponse(null);
    setShowFlip(false);
    setShowShare(false);
    setStep('question');
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const handleShare = (platform: 'whatsapp' | 'copy') => {
    if (!ynCard || !ynResponse) return;
    
    const template = SHARE_TEXT_TEMPLATES[Math.floor(Math.random() * SHARE_TEXT_TEMPLATES.length)];
    const shareText = `${template}\n\nQuestion: "${question}"\nResult: ${ynResponse.cardName} - ${ynResponse.resultText}\n\n🔮 thedivinetarot.com`;
    
    if (platform === 'whatsapp') {
      const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(url, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(shareText);
    }
  };

  const handleUnlock = () => {
    window.location.href = '/premium';
  };

  const handleSwitchToDetailed = () => {
    window.location.href = '/reading?type=detailed';
  };

  const remainingReadings = getRemainingReadings();
  const isPaywalled = !canRead() && !paywallShown;
  const showHint = shouldShowHint() && !isPaywalled;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0F] via-[#12121A] to-[#0B0B0F] pt-24 pb-12 md:pt-32 md:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <AnimatePresence mode="wait">
          
          {/* QUESTION STEP */}
          {step === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-flex rounded-full p-4 bg-gold/10 mb-6"
                >
                  <Zap className="h-8 w-8 text-gold" />
                </motion.div>
                <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
                  Yes or No?
                </h1>
                <p className="text-foreground-secondary">
                  ek simple sawaal, ek seedha sawaar
                </p>
              </div>

              {/* Free reading hint */}
              {remainingReadings < 3 && (
                <div className="text-center text-sm text-foreground-muted">
                  {remainingReadings === 2 
                    ? "2 readings free" 
                    : remainingReadings === 1 
                    ? "1 reading free" 
                    : "3 readings free"}
                </div>
              )}

              <div className="space-y-4">
                <textarea
                  value={question}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  placeholder={t('yesno.questionPlaceholder') || "Apna question socho… kya yes ya no jaan na chahte ho?"}
                  className="w-full min-h-[120px] p-5 rounded-2xl border border-gold/20 bg-surface/50 text-foreground placeholder:text-foreground-muted focus:border-gold/50 focus:outline-none resize-none text-lg"
                  maxLength={200}
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-400 text-center"
                  >
                    {error}
                  </motion.p>
                )}
                <p className="text-sm text-gold/40 text-right">
                  {question.length}/200
                </p>
                
                <button
                  onClick={handleSubmit}
                  disabled={question.length < 3}
                  className="w-full py-4 rounded-xl bg-gold-gradient font-semibold text-black hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Decode My Answer
                </button>
              </div>

              {/* Hint after 1st reading */}
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-4 rounded-xl bg-surface/50 border border-gold/10"
                >
                  <p className="text-foreground-secondary italic">
                    Tumhari reading mein kuch interesting chal raha hai… deeper insights ke liye detailed reading try karo.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* SUSPENSE STEP */}
          {step === 'suspense' && (
            <motion.div
              key="suspense"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent pointer-events-none"
              />
              
              <motion.div className="text-center">
                <Sparkles className="h-12 w-12 text-gold mx-auto mb-4 animate-pulse" />
                <p className="font-heading text-xl text-foreground">
                  {yesNoSuspenseMessages[0]}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* REVEAL STEP */}
          {step === 'reveal' && ynCard && ynResponse && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              {/* Card Display */}
              <motion.div
                initial={{ rotateY: -90 }}
                animate={{ rotateY: showFlip ? 0 : -90 }}
                transition={{ duration: 0.6 }}
                className="w-40 h-56 mx-auto rounded-2xl bg-gradient-to-br from-surface to-[#0A0A0A] border-2 border-gold/50 flex flex-col items-center justify-center shadow-2xl shadow-gold/30 mb-8"
              >
                <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-gold/20 to-red-900/20 border border-gold/30 flex items-center justify-center mb-3">
                  <span className="text-gold text-3xl">✦</span>
                </div>
              </motion.div>

              {/* Result after flip */}
              {showFlip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6 w-full"
                >
                  {/* Card Name */}
                  <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="text-center"
                  >
                    <Sparkles className="h-6 w-6 text-gold mx-auto mb-2" />
                    <h3 className="font-heading text-2xl text-foreground">
                      {ynResponse.cardName}
                    </h3>
                  </motion.div>

                  {/* Result Text */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className={`inline-block mx-auto px-8 py-4 rounded-2xl ${
                      ynCard.result === 'YES' 
                        ? 'bg-gradient-to-r from-gold/30 to-amber-500/30 shadow-lg shadow-amber-500/30' 
                        : ynCard.result === 'NO'
                        ? 'bg-gradient-to-r from-red-900/30 to-rose-900/30 shadow-lg shadow-rose-500/30'
                        : 'bg-gradient-to-r from-surface to-surface-elevated shadow-lg'
                    }`}
                  >
                    <span className={`font-heading text-4xl md:text-5xl ${
                      ynCard.result === 'YES'
                        ? 'text-amber-300'
                        : ynCard.result === 'NO'
                        ? 'text-rose-300'
                        : 'text-foreground-secondary'
                    }`}>
                      {ynResponse.resultText}
                    </span>
                  </motion.div>

                  {/* Emotional Opening */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-foreground-secondary/80 italic text-center max-w-md mx-auto"
                  >
                    {ynResponse.emotionalOpening}
                  </motion.p>

                  {/* Guidance */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="p-6 rounded-2xl bg-surface/50 border border-gold/30 max-w-lg mx-auto"
                  >
                    <p className="text-sm text-gold/70 mb-2">{ynResponse.guidanceIntro}</p>
                    <p className="text-foreground">{ynResponse.guidance}</p>
                  </motion.div>

                  {/* Share system */}
                  {showShare && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full"
                    >
                      <div className="p-6 rounded-2xl bg-surface/50 border border-gold/20">
                        <p className="text-center text-foreground-secondary mb-4">
                          Yeh result sirf tumhare liye nahi lag raha…?
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleShare('whatsapp')}
                            className="py-3 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                          </button>
                          <button
                            onClick={() => handleShare('copy')}
                            className="py-3 rounded-full bg-gold/10 text-gold hover:bg-gold/20 transition-all flex items-center justify-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* CTAs - Switch to detailed */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="space-y-4 pt-4 text-center"
                  >
                    <p className="text-sm text-foreground-secondary/50">
                      Want to understand this deeper?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={handleSwitchToDetailed}
                        className="px-6 py-3 rounded-xl bg-gold-gradient font-semibold text-black hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        <Sparkles className="h-5 w-5" />
                        Get Full Reading
                      </button>
                    </div>
                  </motion.div>

                  {/* New reading button */}
                  <button
                    onClick={handleNewReading}
                    className="mt-4 py-3 rounded-full border border-gold/30 text-foreground-secondary hover:text-foreground hover:border-gold/50 transition-all flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Dobara try karo
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Paywall - Emotional soft lock */}
          {isPaywalled && (
            <motion.div
              key="paywall"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-surface to-background border border-gold/30 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex rounded-full p-4 bg-gold/10 mb-6"
                >
                  <Lock className="h-8 w-8 text-gold" />
                </motion.div>
                
                <h2 className="font-heading text-2xl text-foreground mb-4">
                  {PAYWALL_MESSAGES[Math.floor(Math.random() * PAYWALL_MESSAGES.length)]}
                </h2>
                
                <p className="text-foreground-secondary mb-6">
                  Ab jo aage hai woh aur bhi powerful hai…
                  Seedha answer se zyada clarity milegi.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleUnlock}
                    className="w-full py-4 rounded-xl bg-gold-gradient font-semibold text-black hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    Unlock – ₹49 sirf
                  </button>
                  
                  <button
                    onClick={handleUnlock}
                    className="w-full py-4 rounded-xl border border-gold/30 text-foreground-secondary hover:text-foreground transition-all"
                  >
                    Unlimited monthly – ₹199/mo
                  </button>
                </div>

                <button
                  onClick={() => {
                    dismissPaywall();
                    setPaywallShown(true);
                  }}
                  className="mt-4 text-sm text-foreground-muted hover:text-foreground-secondary"
                >
                  Baad mein dekhounga
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Referral code display */}
        {referralCode && (
          <div className="mt-12 text-center">
            <p className="text-xs text-foreground-muted">
              Referral: {referralCode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}