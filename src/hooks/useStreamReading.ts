'use client';

import { useState, useCallback, useRef } from 'react';
import { SelectedCard } from '@/lib/tarot/logic';

interface StreamReadingOptions {
  question: string;
  topic?: string;
  userId?: string;
  language?: string;
  selectedCards?: SelectedCard[];
  onCardsReceived?: (cards: SelectedCard[]) => void;
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: string) => void;
}

interface StreamState {
  isLoading: boolean;
  isStreaming: boolean;
  cards: SelectedCard[] | null;
  content: string;
  error: string | null;
}

const initialState: StreamState = {
  isLoading: false,
  isStreaming: false,
  cards: null,
  content: '',
  error: null,
};

export function useStreamReading() {
  const [state, setState] = useState<StreamState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  const startReading = useCallback(async (options: StreamReadingOptions) => {
    const { 
      question, 
      topic, 
      userId, 
      language = 'en',
      selectedCards,
      onCardsReceived,
      onChunk,
      onComplete,
      onError 
    } = options;

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset state
    setState({
      isLoading: true,
      isStreaming: false,
      cards: null,
      content: '',
      error: null,
    });

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/reading/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          topic,
          userId,
          language,
          selectedCards,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start reading');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream available');
      }

      setState(prev => ({ ...prev, isLoading: false, isStreaming: true }));

      let fullContent = '';
      let cards: SelectedCard[] | null = null;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          
          try {
            const data = JSON.parse(line.slice(6));
            
            if (data.type === 'cards') {
              cards = data.cards;
              setState(prev => ({ ...prev, cards }));
              onCardsReceived?.(data.cards);
            } 
            else if (data.type === 'content') {
              fullContent += data.content;
              setState(prev => ({ ...prev, content: fullContent }));
              onChunk?.(data.content);
            } 
            else if (data.type === 'done') {
              setState(prev => ({ ...prev, isStreaming: false }));
              onComplete?.(fullContent);
            } 
            else if (data.type === 'error') {
              throw new Error(data.error);
            }
          } catch (parseError) {
            console.error('[Stream Parse Error]', parseError);
          }
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        return; // Cancelled, don't update state
      }
      
      const errorMessage = error.message || 'Something went wrong. Please try again.';
      setState(prev => ({
        ...prev,
        isLoading: false,
        isStreaming: false,
        error: errorMessage,
      }));
      onError?.(errorMessage);
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({
        ...prev,
        isLoading: false,
        isStreaming: false,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    setState(initialState);
  }, [cancel]);

  return {
    ...state,
    startReading,
    cancel,
    reset,
  };
}

export function useTypingEffect(text: string, speed: number = 30) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = useCallback((newText: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setDisplayText('');
    setIsTyping(true);
    
    let index = 0;
    const typeChar = () => {
      if (index < newText.length) {
        setDisplayText(newText.slice(0, index + 1));
        index++;
        timeoutRef.current = setTimeout(typeChar, speed + Math.random() * 20);
      } else {
        setIsTyping(false);
      }
    };
    
    typeChar();
  }, [speed]);

  const clearTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDisplayText('');
    setIsTyping(false);
  }, []);

  return { displayText, isTyping, startTyping, clearTyping };
}
