declare global {
  interface Window {
    clarity: any;
  }
}

export interface ClarityConfig {
  projectId: string;
  trackClips?: boolean;
  trackHeatmaps?: boolean;
  sampleRate?: number;
}

export function initClarity(config?: ClarityConfig) {
  if (typeof window === 'undefined') return;
  
  const CLARITY_PROJECT_ID = config?.projectId || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  if (!CLARITY_PROJECT_ID) {
    console.log('[Clarity] Not configured, skipping init');
    return;
  }

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://www.clarity.ms/e/${CLARITY_PROJECT_ID}`;
  
  script.onload = () => {
    console.log('[Clarity] Loaded successfully');
    configureClarity(config);
  };
  
  script.onerror = () => {
    console.error('[Clarity] Failed to load');
  };

  document.head.appendChild(script);
}

function configureClarity(config?: ClarityConfig) {
  if (!window.clarity) return;

  window.clarity('set', 'project', config?.projectId || process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID);
  
  if (config?.trackClips !== false) {
    window.clarity('set', 'track', true);
  }

  if (config?.trackHeatmaps !== false) {
    window.clarity('heatmap', 'enable');
  }

  const sampleRate = config?.sampleRate || 100;
  window.clarity('set', 'sample-rate', sampleRate);
}

export function trackClarityEvent(eventName: string, metadata?: Record<string, any>) {
  if (!window.clarity) {
    console.log('[Clarity] Event (mock):', eventName, metadata);
    return;
  }

  window.clarity('event', eventName, metadata);
}

export function setClarityUserTag(tag: string, value: string) {
  if (!window.clarity) return;
  
  window.clarity('set', `tag:${tag}`, value);
}

export function identifyClarityUser(userId: string) {
  if (!window.clarity) return;
  
  window.clarity('identify', userId);
}

export function consentClarity(consent: boolean) {
  if (!window.clarity) return;
  
  if (consent) {
    window.clarity('consent');
  } else {
    window.clarity('optout');
  }
}

export const CLARITY_TRACKED_PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/reading', name: 'Reading Page' },
  { path: '/booking', name: 'Booking Page' },
  { path: '/upgrade', name: 'Paywall' },
  { path: '/contact', name: 'Contact' },
];

export function initClarityForPage(pageName: string) {
  trackClarityEvent('page_view', {
    page: pageName,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
}

export async function getClarityHeatmapData(pageUrl: string) {
  console.log('[Clarity] Would fetch heatmap data for:', pageUrl);
  return null;
}

export async function getClaritySessionRecording(sessionId: string) {
  console.log('[Clarity] Would fetch session:', sessionId);
  return null;
}