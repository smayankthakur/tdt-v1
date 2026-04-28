"use client";

import { useEffect } from 'react';
import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import GlobalWatermark from "@/components/global-watermark";
import ContentGuard from "@/components/ContentGuard";
import DebugPanel from "@/components/DebugPanel";
import { LanguageWrapper } from "@/components/LanguageWrapper";
import LanguageMeta from "@/components/LanguageMeta";
import dynamic from 'next/dynamic';
import { useLanguageStore } from "@/store/languageStore";

const GinniChatWrapper = dynamic(() => import('@/components/GinniChatWrapper'), {
  ssr: false,
  loading: () => null
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguageStore();

  // Update html lang attribute on client side when language changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  return (
    <div className="antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))]" suppressHydrationWarning>
      <DebugPanel />
      <LanguageMeta />
      <GlobalWatermark />
      <ContentGuard>
        <ClientProviders>
          <AnalyticsProvider />
          <LanguageWrapper>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </LanguageWrapper>
          <GinniChatWrapper />
        </ClientProviders>
      </ContentGuard>
    </div>
  );
}
