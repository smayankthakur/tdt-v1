'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { trackEvent, type TrackingEvent } from '@/lib/utils/tracking';
import { useLanguage } from '@/hooks/useLanguage';

const IFRAME_URL = 'https://ginnitdt.lovable.app/';
const IFRAME_ORIGIN = 'https://ginnitdt.lovable.app';

export default function ReadingPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Fetch user and subscription/trial status on mount
  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          // No authenticated user → treat as guest with no access
          setUser(null);
          setHasAccess(false);
          setIsLoading(false);
          return;
        }

        setUser({ id: authUser.id });

        if (!isSupabaseConfigured()) {
          // In dev without DB, allow access
          setHasAccess(true);
          setIsLoading(false);
          return;
        }

        // Fetch user record for subscription/trial info
        const { data: userData, error } = await supabase
          .from('users')
          .select('trial_start_date, subscription_status, subscription_end_date')
          .eq('id', authUser.id)
          .single();

        if (error) {
          console.error('[Reading] Error fetching user data:', error);
          setHasAccess(false);
          setIsLoading(false);
          return;
        }

        // Initialize trial if missing (first-time user)
        let trialStart = userData.trial_start_date ? new Date(userData.trial_start_date) : null;
        if (!userData.trial_start_date) {
          const now = new Date();
          const { error: updateError } = await supabase
            .from('users')
            .update({ trial_start_date: now.toISOString() })
            .eq('id', authUser.id);
          if (!updateError) {
            trialStart = now;
          } else {
            console.error('[Reading] Failed to initialize trial:', updateError);
          }
        }

        const now = new Date();
        const subscriptionEnd = userData.subscription_end_date ? new Date(userData.subscription_end_date) : null;

        const isTrialValid = trialStart ? now <= new Date(trialStart.getTime() + 3 * 24 * 60 * 60 * 1000) : false;
        const isSubscribed = userData.subscription_status === 'active' && (!subscriptionEnd || subscriptionEnd > now);

        setHasAccess(isTrialValid || isSubscribed);
      } catch (err) {
        console.error('[Reading] Access check failed:', err);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [retryCount]);

  // PostMessage bridge handler
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== IFRAME_ORIGIN) return;

      const { type, payload } = event.data;

      switch (type) {
        case 'reading_started': {
          trackEvent({
            userId: user?.id,
            eventName: 'reading_started',
            metadata: payload,
          } as TrackingEvent);
          break;
        }
        case 'reading_completed': {
          trackEvent({
            userId: user?.id,
            eventName: 'reading_completed',
            metadata: payload,
          } as TrackingEvent);
          break;
        }
        case 'payment_trigger': {
          // Block iframe and show paywall
          setHasAccess(false);
          break;
        }
        case 'session_request': {
          // Respond with session token if available
          if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
              {
                type: 'session_response',
                payload: {
                  token: sessionToken,
                  userId: user?.id,
                  subscriptionStatus: hasAccess ? 'active' : 'inactive',
                },
              },
              IFRAME_ORIGIN
            );
          }
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [user, router, hasAccess, sessionToken]);

  // Send INIT message to iframe after load
  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true);
    setIframeError(false);

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'INIT',
          payload: {
            userId: user?.id || null,
            subscriptionStatus: hasAccess ? 'active' : 'inactive',
            language: language,
            sessionToken: sessionToken,
          },
        },
        IFRAME_ORIGIN
      );
    }
  }, [user, hasAccess, language, sessionToken]);

  const handleRetry = () => {
    setIframeError(false);
    setIframeLoaded(false);
    setRetryCount((c) => c + 1);
  };

  const goBack = () => {
    router.push('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[rgb(var(--background))]">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 text-gold animate-pulse mx-auto" />
          <p className="text-foreground-secondary">Loading your reading…</p>
        </div>
      </div>
    );
  }

  // Paywall state (no access)
  if (!hasAccess) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[rgb(var(--background))] p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="inline-flex rounded-full p-4 bg-gold/10">
            <Sparkles className="h-8 w-8 text-gold" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-heading text-foreground">Your access has paused…</h1>
            <p className="text-foreground-secondary">
              Continue your journey with full clarity
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-4xl font-bold text-foreground">₹199<span className="text-lg font-normal text-foreground-secondary">/month</span></div>

            <button
              onClick={() => router.push('/premium')}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-gold/90 to-amber-600 text-black font-semibold text-lg shadow-lg hover:scale-[1.02] transition-transform"
            >
              Unlock Now
            </button>
          </div>

          <button onClick={goBack} className="text-foreground-muted text-sm hover:text-foreground transition-colors">
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Full-screen iframe immersion
  return (
    <>
      {/* Floating back button */}
      <button
        onClick={goBack}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 hover:border-gold/30 transition-all group"
        aria-label="Back to home"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline text-sm">Back</span>
      </button>

      {/* Loader overlay before iframe */}
      {!iframeLoaded && !iframeError && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgb(var(--background))] z-40">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 text-gold animate-spin mx-auto" />
            <p className="text-foreground-secondary">Connecting to the cosmos…</p>
          </div>
        </div>
      )}

      {/* Error fallback */}
      {iframeError && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgb(var(--background))] z-30">
          <div className="text-center space-y-6 max-w-sm px-6">
            <div className="text-foreground-muted">
              <RefreshCw className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <h2 className="text-xl font-heading text-foreground mb-2">Unable to load reading</h2>
              <p className="text-sm">Something went wrong. Please check your connection and try again.</p>
            </div>

            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-gold/30 text-foreground hover:bg-surface-elevated transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>

            <button onClick={goBack} className="text-foreground-muted text-sm hover:text-foreground">
              ← Back to Home
            </button>
          </div>
        </div>
      )}

      {/* Main iframe */}
      <iframe
        key={retryCount}
        ref={iframeRef}
        src={IFRAME_URL}
        className="w-full h-screen border-none"
        allow="clipboard-write; microphone; camera"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        onLoad={handleIframeLoad}
        onError={() => {
          setIframeError(true);
          setIframeLoaded(false);
        }}
        title="Ginni Reading"
        style={{
          // Prevent layout shift and ensure fullscreen
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
        }}
      />
    </>
  );
}
