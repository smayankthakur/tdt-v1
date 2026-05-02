'use client';

import { useEffect } from 'react';
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import DynamicWatermark from "@/components/security/DynamicWatermark";
import { useContentProtection } from "@/lib/utils/protection";
import ContentGuard from "@/components/ContentGuard";
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isReadingPage = pathname === '/reading';

  // Initialize content protection (lightweight version)
  useContentProtection();

  return (
    <div className="antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))] min-h-screen" suppressHydrationWarning>
      {/* Dynamic Watermark System - 3 Layer Protection */}
      <DynamicWatermark />
      
      <ContentGuard>
        <ClientProviders>
          <AnalyticsProvider />
          <div className="flex min-h-screen flex-col">
            {!isReadingPage && <Header />}
            <main className="flex-1 relative">
              {children}
            </main>
            {!isReadingPage && <Footer />}
          </div>
          {/* Mobile Chat Widget - disabled by default for cleaner UI */}
          {/* <GinniChatWrapper /> */}
        </ClientProviders>
      </ContentGuard>
    </div>
  );
}
