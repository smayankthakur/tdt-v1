import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GinniChatWrapper from "@/components/GinniChatWrapper";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import Watermark from "@/components/security/Watermark";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "The Devine Tarot | Premium AI-Powered Tarot Readings",
  description: "Get answers from the universe in seconds. Experience mystical, emotionally intelligent tarot readings.",
  keywords: "tarot, tarot reading, spiritual guidance, fortune telling, psychic reading",
  icons: {
    icon: "/tdt-v3/favicon.ico",
    apple: "/tdt-v3/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html lang="en">
      <head>
        {/* Content Protection Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
                document.addEventListener('keydown', function(e) {
                  if (e.key === 'PrintScreen') { e.preventDefault(); return; }
                  if (e.ctrlKey && ['s','u','c'].includes(e.key.toLowerCase())) { e.preventDefault(); return; }
                  if (e.ctrlKey && e.shiftKey && ['i','j'].includes(e.key.toLowerCase())) { e.preventDefault(); return; }
                });
                document.addEventListener('visibilitychange', function() {
                  document.body.style.filter = document.hidden ? 'blur(8px)' : 'none';
                });
              })();
            `,
          }}
        />
        
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_title: document.title,
                    debug_mode: ${process.env.NODE_ENV === 'development'}
                  });
                `,
              }}
            />
          </>
        )}
        
        {/* Microsoft Clarity */}
        {CLARITY_PROJECT_ID && (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/e/'+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window,document,'clarity','${CLARITY_PROJECT_ID}');
              `,
            }}
          />
        )}
      </head>
      <body className="antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))]">
        <Watermark />
        <ClientProviders>
          <AnalyticsProvider />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}