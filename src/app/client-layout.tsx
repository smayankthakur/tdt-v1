'use client';

import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import SecureWatermark from "@/components/watermark/SecureWatermark";
import ContentGuard from "@/components/ContentGuard";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))] min-h-screen" suppressHydrationWarning>
      {/* Unified Dynamic Watermark System - 3 Layer Protection */}
      <SecureWatermark />

      <ContentGuard>
        <ClientProviders>
          <AnalyticsProvider />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 relative min-h-0">
              {children}
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </ContentGuard>
    </div>
  );
}
