'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'ginni';
  content: string;
}

interface ChatWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
}

const defaultWelcome = "Hi! I'm Ginni. Tell me what's on your mind...";

export default function ChatWidget({ position = 'bottom-right' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ginni', content: defaultWelcome }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const positionStyles = {
    'bottom-right': 'right-6 bottom-6',
    'bottom-left': 'left-6 bottom-6',
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate Ginni response (replace with actual API)
    setTimeout(() => {
      const ginniMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ginni',
        content: "I feel something significant in what you just shared. Let me reflect on this...",
      };
      setMessages(prev => [...prev, ginniMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={cn('fixed z-40', positionStyles[position])}>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-4 w-[350px] h-[500px] flex flex-col bg-[#1A1A1A]/90 backdrop-blur-xl rounded-2xl border border-[#F4C542]/20 shadow-[0_0_60px_rgba(244,197,66,0.15)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#F4C542]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F4C542]/20 to-[#C1121F]/20 flex items-center justify-center border border-[#F4C542]/30">
                  <Sparkles className="w-5 h-5 text-[#F4C542]" />
                </div>
                <div>
                  <h3 className="font-serif text-[#EAEAEA]">Ginni</h3>
                  <p className="text-xs text-[#7A7A7A]">Your spiritual guide</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-[#ffffff]/5 transition-colors"
              >
                <X className="w-5 h-5 text-[#7A7A7A]" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'max-w-[85%] px-4 py-3 rounded-2xl text-sm',
                    msg.role === 'user'
                      ? 'ml-auto bg-[#F4C542]/10 border border-[#F4C542]/20 text-[#EAEAEA] rounded-br-sm'
                      : 'mr-auto bg-[#1A0F2E]/50 border border-[#F4C542]/10 text-[#A8A8A8] rounded-bl-sm'
                  )}
                >
                  {msg.content}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-[#7A7A7A] text-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#F4C542] animate-pulse" />
                  <span>Ginni is thinking...</span>
                </motion.div>
              )}
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-[#F4C542]/10">
              <div className="flex items-center gap-2 bg-[#0A0A0A]/50 rounded-full px-4 py-2 border border-[#ffffff]/10 focus-within:border-[#F4C542]/50 focus-within:shadow-[0_0_15px_rgba(244,197,66,0.1)] transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Ginni anything..."
                  className="flex-1 bg-transparent text-[#EAEAEA] placeholder:text-[#7A7A7A] outline-none text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 rounded-full bg-[#F4C542]/20 text-[#F4C542] hover:bg-[#F4C542]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orb Toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center',
          'bg-gradient-to-br from-[#F4C542] to-[#FFD84D]',
          'shadow-[0_0_30px_rgba(244,197,66,0.4)] hover:shadow-[0_0_50px_rgba(244,197,66,0.6)]',
          'transition-shadow duration-300'
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <MessageCircle className="w-7 h-7 text-black" />
        )}
      </motion.button>
    </div>
  );
}