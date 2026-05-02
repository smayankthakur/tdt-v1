// Security configuration for Divine Tarot
// Comprehensive security settings with granular control

export const isProduction = process.env.NODE_ENV === 'production';

export const securityConfig = {
  // Watermark visibility - enabled in all environments for traceability
  showWatermark: true,
  
  // Content protection features - disabled by default to avoid accessibility issues
  // Can be enabled selectively for production if needed
  blockContextMenu: false,
  blockDevTools: false,
  blockScreenshots: false,
  blockTextSelection: false,
  
  // Security headers
  enableCSP: isProduction,
  enableHSTS: isProduction,
  enableXFrameOptions: true,
  enableXContentTypeOptions: true,
  
  // Rate limiting
  enableRateLimiting: true,
  
  // Input validation
  strictInputValidation: true,
  
  // Session security
  secureCookies: isProduction,
  sameSiteCookies: isProduction ? 'strict' : 'lax' as const,
  
  // CSP nonce (generated per request in middleware)
  cspNonce: '',
};

export type SecurityConfig = typeof securityConfig;

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: {
    anonymous: 100, // requests per window
    authenticated: 500,
  },
  apiWindowMs: 60 * 1000, // 1 minute for API endpoints
  apiMaxRequests: {
    anonymous: 30,
    authenticated: 300,
  },
  readingEndpoints: {
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxPerDay: 100, // Max reading attempts per day per IP
  },
};

// CSP policies
export const cspPolicies = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Needed for inline scripts (will be replaced with nonce)
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://cdn.clarity.ms",
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind and styled components
    "https://fonts.googleapis.com",
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
  ],
  imgSrc: [
    "'self'",
    "data:",
    "https:",
  ],
  connectSrc: [
    "'self'",
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    "https://*.supabase.co",
    "https://api.openai.com",
    "https://api.razorpay.com",
  ],
  frameSrc: ["'self'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
};

export function shouldBlockContextMenu(): boolean {
  return securityConfig.blockContextMenu;
}

export function shouldBlockDevTools(): boolean {
  return securityConfig.blockDevTools;
}

export function shouldBlockScreenshots(): boolean {
  return securityConfig.blockScreenshots;
}

export function shouldBlockTextSelection(): boolean {
  return securityConfig.blockTextSelection;
}

export function shouldShowWatermark(): boolean {
  return securityConfig.showWatermark;
}

export function getCSPHeader(nonce?: string): string {
  const policies = { ...cspPolicies };
  
  if (nonce) {
    // Replace unsafe-inline with nonce for scripts
    policies.scriptSrc = [
      "'self'",
      `'nonce-${nonce}'`,
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://cdn.clarity.ms",
    ];
  }
  
  return Object.entries(policies)
    .map(([key, values]) => {
      if (values.length === 0) return '';
      return `${key} ${values.join(' ')}`;
    })
    .filter(Boolean)
    .join('; ');
}
