"use client";

import { useState } from "react";
import Head from "next/head";

export default function ReadingPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#0B0B0F]">
      {/* Reading Container */}
      <section className="flex-1 relative bg-gradient-to-b from-[#0B0B0F] to-[#1A1A2E]">
        {/* Loader */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10 text-white">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-4 border-[#C9A962]/30 border-t-[#C9A962] mb-4 animate-spin" />
              <p className="text-[#C9A962] text-sm font-medium">
                Connecting to your reader...
              </p>
            </div>
          </div>
        )}

        {/* Iframe Container - 90% size, centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[90vw] h-[90vh] flex items-center justify-center">
            <iframe
              src="https://ginni-ki-baatein-buddy.lovable.app"
              width="100%"
              height="100%"
              className={`border-none transition-all duration-500 ${
                loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              onLoad={() => setLoaded(true)}
              allow="clipboard-write; microphone; camera"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        </div>
      </section>
    </main>
  );
}