import type { Metadata, Viewport } from "next";
import ClientLayout from "./client-layout";
import ErrorBoundary from "@/components/system/ErrorBoundary";

export const metadata: Metadata = {
  title: "The Divine Tarot | Premium Tarot Readings",
  description: "Get answers from the universe in seconds. Experience mystical, emotionally intelligent tarot readings.",
  keywords: "tarot, tarot reading, spiritual guidance, fortune telling, psychic reading",
  icons: {
    icon: "/tdt-v3/favicon.ico",
    apple: "/tdt-v3/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Security headers are set via middleware */}
        {/* CSP nonce is generated per request for inline scripts */}
      </head>
      <body
        className="antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))]"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ClientLayout>{children}</ClientLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}

