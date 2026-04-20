'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Heart, Briefcase, HelpCircle, Lightbulb } from 'lucide-react';
import Button from '@/components/ui/button';
import { FloatingTextarea } from '@/components/ui/FloatingInput';
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

export function QuestionInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Jo tumhare mind mein baar baar aa raha hai… usse yahan likho",
  maxLength = 500,
}: QuestionInputProps) {
  const charCount = value.length;
  const isOverLimit = charCount > maxLength;
  const canSubmit = value.trim().length >= 10 && !isOverLimit;

  return (
    <motion.div
      className="space-y-4"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <FloatingTextarea
        label="Tumhara sawal"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={4}
        helperText="Jitna clear sawal… utni clear direction"
        showCount
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={onSubmit}
          disabled={!canSubmit}
        >
          Continue
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

const TOPICS = [
  { id: 'love', label: 'Love', icon: Heart, description: 'Heart matters & relationships' },
  { id: 'career', label: 'Career', icon: Briefcase, description: 'Work & professional path' },
  { id: 'confusion', label: 'Clarity', icon: HelpCircle, description: 'Finding direction' },
  { id: 'general', label: 'General', icon: Lightbulb, description: 'Any question' },
] as const;

export default function TopicSelector({
  selectedTopic,
  onSelectTopic,
  recommendedTopic,
}: TopicSelectorProps) {
  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center" variants={fadeInUp}>
        <h2 className="font-heading text-2xl sm:text-3xl text-purple-200 mb-3">
          What area calls to you?
        </h2>
        <p className="text-purple-300/60">
          {recommendedTopic 
            ? `Based on your energy, ${getTopicLabel(recommendedTopic)} seems important right now.`
            : 'What would you like the cards to reveal?'
          }
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {TOPICS.map((topic) => {
          const Icon = topic.icon;
          const isRecommended = topic.id === recommendedTopic;
          const isSelected = topic.id === selectedTopic;
          
          return (
            <motion.button
              key={topic.id}
              variants={staggerItem}
              onClick={() => onSelectTopic(topic.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'p-4 sm:p-6 rounded-2xl border-2 transition-all text-left',
                'flex flex-col items-center text-center gap-2',
                isSelected || isRecommended
                  ? 'border-purple-500 bg-purple-900/30'
                  : 'border-purple-800/30 bg-[#1A1A2E]/50 hover:border-purple-600/50'
              )}
            >
              <Icon className="h-8 w-8 text-purple-400" />
              <span className="font-medium text-purple-200">{topic.label}</span>
              <span className="text-xs text-purple-400/60 hidden sm:block">{topic.description}</span>
              {isRecommended && (
                <span className="text-xs text-purple-400 font-medium mt-1">
                  Recommended
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

function getTopicLabel(topic: string): string {
  const labels: Record<string, string> = {
    love: 'love and relationships',
    career: 'your career path',
    confusion: 'finding clarity',
    general: 'guidance',
  };
  return labels[topic] || topic;
}

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  maxLength?: number;
}

interface TopicQuestionProps {
  topic: string;
  questions: string[];
  onSelectQuestion: (question: string) => void;
  onGoBack: () => void;
}

export function TopicQuestion({
  topic,
  questions,
  onSelectQuestion,
  onGoBack,
}: TopicQuestionProps) {
  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <button
        onClick={onGoBack}
        className="text-sm text-purple-400/60 hover:text-purple-300 flex items-center gap-1"
      >
        ← Change topic
      </button>

      <div className="text-center">
        <h2 className="font-heading text-2xl sm:text-3xl text-purple-200 mb-3">
          What do you want to know?
        </h2>
        <p className="text-purple-300/60">
          Choose a question to begin your reading:
        </p>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <motion.button
            key={index}
            variants={staggerItem}
            onClick={() => onSelectQuestion(question)}
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
      </div>
    </motion.div>
  );
}
