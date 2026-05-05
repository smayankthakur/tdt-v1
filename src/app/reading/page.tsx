"use client";

import { useState } from "react";
import Head from "next/head";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ReadingPage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0F]">
      <Head>
        <link rel="preconnect" href="https://ginni-ki-baatein-buddy.lovable.app" />
      </Head>
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
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

          {/* Iframe */}
          <iframe
            src="https://ginni-ki-baatein-buddy.lovable.app"
            className={`w-full h-full border-none transition-all duration-500 ${
              loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            onLoad={() => setLoaded(true)}
            allow="clipboard-write; microphone; camera"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </section>
      </main>
      <Footer />
    </div>
  );
}