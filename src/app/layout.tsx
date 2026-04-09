import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GinniChat from "@/components/GinniChat";

export const metadata: Metadata = {
  title: "Divine Tarot | Premium AI-Powered Tarot Readings",
  description: "Get answers from the universe in seconds. Experience mystical, emotionally intelligent tarot readings.",
  keywords: "tarot, tarot reading, spiritual guidance, fortune telling, psychic reading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <GinniChat autoOpenDelay={15000} showNotification={false} />
      </body>
    </html>
  );
}