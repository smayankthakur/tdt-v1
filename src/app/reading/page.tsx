'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReadingPage() {
  const router = useRouter();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      {/* Floating Back Button */}
      <div className="fixed top-4 left-4 z-50 pointer-events-none">
        <button
          onClick={() => router.push('/')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/70 hover:border-white/20 transition-all text-white shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Loading Spinner */}
      <AnimatePresence>
        {!iframeLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black"
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="w-16 h-16 rounded-full border-4 border-[#C9A962]/30 border-t-[#C9A962]"
              />
              <p className="text-[#C9A962] text-sm font-medium">
                Loading reading experience...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen Iframe */}
      <motion.iframe
        key="reading-iframe"
        src="https://ginni-ki-baatein-buddy.lovable.app"
        className="w-full h-full border-none"
        allow="clipboard-write; microphone; camera"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        initial={{ opacity: 0 }}
        animate={{ opacity: iframeLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        onLoad={() => {
          setTimeout(() => setIframeLoaded(true), 300);
        }}
      />
    </div>
  );
}
