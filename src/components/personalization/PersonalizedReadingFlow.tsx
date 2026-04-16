'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, Briefcase, HelpCircle, Lightbulb } from 'lucide-react';
import { useReadingFlowContent, usePersonalizationContext } from '@/components/personalization/PersonalizationProvider';

interface PersonalizedReadingFlowProps {
  onComplete?: (question: string) => void;
}

const TOPIC_ICONS = {
  love: Heart,
  career: Briefcase,
  confusion: HelpCircle,
  general: Lightbulb,
};

export default function PersonalizedReadingFlow({ onComplete }: PersonalizedReadingFlowProps) {
  const { profile, isLoading } = usePersonalizationContext();
  const readingContent = useReadingFlowContent(usePersonalizationContext().rules);
  
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (profile?.dominantIntent && profile.dominantIntent !== 'general') {
      setSelectedTopic(profile.dominantIntent);
    }
  }, [profile]);

  const handleQuestionSelect = (question: string) => {
    const finalQuestion = selectedTopic === 'custom' && customQuestion 
      ? customQuestion 
      : question;
    
    onComplete?.(finalQuestion);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-purple-300/60">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <span>Reading your energy...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedTopic ? (
          <motion.div
            key="topic-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="font-heading text-2xl text-purple-200 mb-3">
                What area calls to you?
              </h2>
              <p className="text-purple-300/60">
                {profile 
                  ? `Based on your energy, ${profile.dominantIntent === 'love' ? 'love and relationships' : profile.dominantIntent === 'career' ? 'your career path' : 'finding clarity'} seems important right now.`
                  : 'What would you like the cards to reveal?'
                }
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['love', 'career', 'confusion', 'general'].map((topic) => {
                const Icon = TOPIC_ICONS[topic as keyof typeof TOPIC_ICONS];
                const topicLabel = topic === 'confusion' ? 'Finding Clarity' : 
                  topic.charAt(0).toUpperCase() + topic.slice(1);
                
                return (
                  <motion.button
                    key={topic}
                    onClick={() => {
                      setSelectedTopic(topic);
                      if (topic === 'general') setShowCustom(true);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      profile?.dominantIntent === topic
                        ? 'border-purple-500 bg-purple-900/30'
                        : 'border-purple-800/30 hover:border-purple-600/50 bg-[#1A1A2E]/50'
                    }`}
                  >
                    <Icon className="h-8 w-8 text-purple-400 mb-3" />
                    <span className="font-medium text-purple-200">{topicLabel}</span>
                    {profile?.dominantIntent === topic && (
                      <span className="block text-xs text-purple-400 mt-1">Recommended for you</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : !showCustom ? (
          <motion.div
            key="question-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <button
              onClick={() => setSelectedTopic(null)}
              className="text-sm text-purple-400/60 hover:text-purple-300 flex items-center gap-1"
            >
              ← Change topic
            </button>

            <div className="text-center">
              <h2 className="font-heading text-2xl text-purple-200 mb-3">
                What do you want to know?
              </h2>
              <p className="text-purple-300/60">
                {readingContent.showGuidedQuestions 
                  ? 'Here are questions based on your journey:'
                  : 'Choose a question to begin your reading:'
                }
              </p>
            </div>

            <div className="space-y-3">
              {readingContent.prefillQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuestionSelect(question)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full p-4 rounded-xl bg-[#1A1A2E]/50 border border-purple-800/30 hover:border-purple-600/50 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200">{question}</span>
                    <ArrowRight className="h-5 w-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.button>
              ))}

              {readingContent.showGuidedQuestions && (
                <motion.button
                  onClick={() => setShowCustom(true)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full p-4 rounded-xl border border-dashed border-purple-700/50 text-left text-purple-400/60 hover:border-purple-500 hover:text-purple-300 transition-all"
                >
                  Ask your own question...
                </motion.button>
              )}
            </div>

            {readingContent.showMemory && profile?.memoryContext && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-purple-900/20 border border-purple-700/30"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-purple-300 font-medium">From your previous reading</p>
                    <p className="text-sm text-purple-400/60 mt-1">{profile.memoryContext}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="custom-question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <button
              onClick={() => setShowCustom(false)}
              className="text-sm text-purple-400/60 hover:text-purple-300 flex items-center gap-1"
            >
              ← Back to suggestions
            </button>

            <div className="text-center">
              <h2 className="font-heading text-2xl text-purple-200 mb-3">
                What&apos;s on your mind?
              </h2>
              <p className="text-purple-300/60">
                Type your question and the cards will answer.
              </p>
            </div>

            <textarea
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="What do you want to ask the universe?"
              className="w-full h-32 p-4 rounded-xl border border-purple-800/50 bg-[#1A1A2E] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none text-purple-100 placeholder:text-purple-400/40"
            />

            <motion.button
              onClick={() => handleQuestionSelect(customQuestion)}
              disabled={!customQuestion.trim()}
              whileHover={{ scale: customQuestion.trim() ? 1.02 : 1 }}
              whileTap={{ scale: customQuestion.trim() ? 0.98 : 1 }}
              className={`w-full py-4 rounded-full font-semibold transition-all ${
                customQuestion.trim()
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]'
                  : 'bg-purple-900/30 text-purple-500/50 cursor-not-allowed'
              }`}
            >
              Reveal Your Answer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
