'use client';

import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import SecureWatermark from "@/components/watermark/SecureWatermark";
import ContentGuard from "@/components/ContentGuard";
import { usePathname } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isReadingPage = pathname === '/reading';

  return (
    <div className="antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))] min-h-screen" suppressHydrationWarning>
      {/* Unified Dynamic Watermark System - 3 Layer Protection */}
      <SecureWatermark showReadingLayer={isReadingPage} />

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
        </ClientProviders>
      </ContentGuard>
    </div>
  );
}
