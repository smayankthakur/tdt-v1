"use client";

import { useEffect } from 'react';
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import GlobalWatermark from "@/components/global-watermark";
import ContentGuard from "@/components/ContentGuard";
import DebugPanel from "@/components/DebugPanel";
import dynamic from 'next/dynamic';

const GinniChatWrapper = dynamic(() => import('@/components/GinniChatWrapper'), {
  ssr: false,
  loading: () => null
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))]" suppressHydrationWarning>
      <DebugPanel />
      <GlobalWatermark />
      <ContentGuard>
        <ClientProviders>
          <AnalyticsProvider />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <GinniChatWrapper />
        </ClientProviders>
      </ContentGuard>
    </div>
  );
}