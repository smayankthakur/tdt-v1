export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export interface FunnelStep {
  name: string;
  event: string;
  required?: boolean;
}

export const DEFAULT_FUNNEL: FunnelStep[] = [
  { name: 'Homepage Visit', event: 'page_view_homepage' },
  { name: 'Start Reading', event: 'start_reading_click', required: true },
  { name: 'Card Selection', event: 'card_selected', required: true },
  { name: 'Reading Completed', event: 'reading_completed' },
  { name: 'Paywall Viewed', event: 'paywall_view' },
  { name: 'Payment Completed', event: 'payment_completed' },
];

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    clarity: any;
  }
}

export function initGA4() {
  if (typeof window === 'undefined') return;
  
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!GA_MEASUREMENT_ID) {
    console.log('[GA4] Not configured, skipping init');
    return;
  }

  window.gtag = window.gtag || function(...args: any[]) {
    window.dataLayer.push(args);
  };
  window.dataLayer = window.dataLayer || [];

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: document.title,
    debug_mode: process.env.NODE_ENV === 'development',
  });

  console.log('[GA4] Initialized with ID:', GA_MEASUREMENT_ID);
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!GA_MEASUREMENT_ID) {
    console.log('[GA4] Event (mock):', event);
    return;
  }

  window.gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    ...event.metadata,
  });

  console.log('[GA4] Tracked:', event.event);
}

export function trackPageView(pagePath: string, pageTitle?: string) {
  trackEvent({
    event: 'page_view',
    category: 'navigation',
    action: pagePath,
    label: pageTitle || document.title,
    metadata: {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    },
  });
}

export function trackConversionEvent(
  eventName: string,
  metadata?: Record<string, any>
) {
  const conversionEvents: Record<string, AnalyticsEvent> = {
    start_reading_click: {
      event: 'start_reading',
      category: 'engagement',
      action: 'start_reading_click',
      metadata,
    },
    card_selected: {
      event: 'card_interaction',
      category: 'engagement',
      action: 'card_selected',
      value: metadata?.cardIndex,
      metadata,
    },
    reading_completed: {
      event: 'reading_completed',
      category: 'engagement',
      action: 'reading_completed',
      metadata,
    },
    ginni_opened: {
      event: 'ginni_opened',
      category: 'engagement',
      action: 'ginni_opened',
      metadata,
    },
    paywall_view: {
      event: 'paywall_view',
      category: 'monetization',
      action: 'paywall_view',
      metadata,
    },
    subscription_started: {
      event: 'subscription_started',
      category: 'monetization',
      action: 'subscription_started',
      metadata,
    },
    payment_completed: {
      event: 'payment_completed',
      category: 'monetization',
      action: 'payment_completed',
      value: metadata?.amount,
      metadata,
    },
  };

  const event = conversionEvents[eventName];
  if (event) {
    trackEvent({
      ...event,
      metadata: { ...event.metadata, ...metadata },
    });
  }
}

export function trackUserInteraction(
  element: string,
  section: string,
  action: string,
  metadata?: Record<string, any>
) {
  trackEvent({
    event: 'user_interaction',
    category: section,
    action,
    label: element,
    metadata: {
      element,
      section,
      action,
      ...metadata,
    },
  });
}

export function trackScrollDepth(depth: number, page: string) {
  const thresholds = [25, 50, 75, 100];
  
  if (thresholds.includes(depth)) {
    trackEvent({
      event: 'scroll_depth',
      category: 'engagement',
      action: `${depth}%`,
      label: page,
      metadata: { depth, page },
    });
  }
}

export function trackTimeOnPage(seconds: number, page: string) {
  trackEvent({
    event: 'time_on_page',
    category: 'engagement',
    action: `${seconds}s`,
    label: page,
    metadata: { seconds, page },
  });
}

export function getUserProperties(userId?: string) {
  return {
    user_id: userId || 'anonymous',
    timestamp: new Date().toISOString(),
  };
}

export function setUserProperties(properties: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!GA_MEASUREMENT_ID) return;

  window.gtag('set', 'user_properties', properties);
}

export function trackGTMEvent(eventName: string, data: Record<string, any>) {
  if (typeof window === 'undefined') return;
  
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
  if (!GTM_ID) {
    console.log('[GTM] Event (mock):', eventName, data);
    return;
  }

  window.dataLayer.push({
    event: eventName,
    ...data,
  });
}