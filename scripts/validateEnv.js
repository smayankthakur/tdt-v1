#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * Runs before build to check configuration.
 * 
 * Philosophy: This project uses lazy initialization + fallbacks everywhere,
 * so NO env var is a hard build-blocker. Missing vars show warnings but
 * don't fail the build (unless using legacy code patterns).
 * 
 * For Vercel deployment: ensure all required vars are set.
 */

const fs = require('fs');
const path = require('path');

const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

console.log(`\n${BOLD}🔍 Validating environment configuration...${RESET}\n`);

// Load .env.local if it exists
const envPath = path.resolve(process.cwd(), '.env.local');
const localEnv = {};

if (fs.existsSync(envPath)) {
  console.log(`${YELLOW}📁 Loading .env.local...${RESET}`);
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        localEnv[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    }
  });
} else {
  console.log(`${YELLOW}⚠️  .env.local not found — only checking Vercel env${RESET}`);
}

// Comprehensive list of all env vars used in codebase
// Tier 1 = core features (should be set for prod)
// Tier 2 = optional features (set if using that feature)
// Tier 3 = feature flags (booleans)
const envConfig = [
  // Tier 1: Core Application (required for production)
  {
    key: 'NEXT_PUBLIC_APP_URL',
    tier: 1,
    purpose: 'Core App',
    note: 'Base URL used in OG meta tags and links',
    example: 'https://thedivinetarot.com',
    warnIfMissing: true
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    tier: 1,
    purpose: 'Database',
    note: 'Supabase project URL (required)',
    example: 'https://xxxx.supabase.co',
    warnIfMissing: true
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    tier: 1,
    purpose: 'Database',
    note: 'Supabase public key (required)',
    example: 'eyJhbGci...',
    warnIfMissing: true
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    tier: 1,
    purpose: 'Database',
    note: 'Server-side admin access (KEEP SECRET)',
    example: 'eyJhbGci...',
    warnIfMissing: true
  },
  {
    key: 'OPENAI_API_KEY',
    tier: 1,
    purpose: 'AI Readings',
    note: 'OpenAI API key (or OPENAI_KEY)',
    example: 'sk-...',
    warnIfMissing: true
  },
  {
    key: 'OPENAI_KEY',
    tier: 1,
    purpose: 'AI Readings',
    note: 'Alternate OpenAI key (fallback if OPENAI_API_KEY unset)',
    example: 'sk-...',
    warnIfMissing: false // optional fallback
  },
  {
    key: 'RESEND_API_KEY',
    tier: 1,
    purpose: 'Email',
    note: 'Resend API key (email service)',
    example: 're_...',
    warnIfMissing: true
  },
  {
    key: 'RESEND_FROM_EMAIL',
    tier: 1,
    purpose: 'Email',
    note: 'Verified sender email (e.g., newsletter@yourdomain.com)',
    example: 'newsletter@thedivinetarot.com',
    warnIfMissing: true
  },

  // Tier 2: Optional Features (set if using these features)
  {
    key: 'RAZORPAY_KEY_ID',
    tier: 2,
    purpose: 'Payments (India)',
    note: 'Set if accepting Razorpay payments',
    example: 'rzp_test_...',
    warnIfMissing: false
  },
  {
    key: 'RAZORPAY_KEY_SECRET',
    tier: 2,
    purpose: 'Payments',
    note: 'Webhook secret verification',
    example: 'your-secret',
    warnIfMissing: false
  },
  {
    key: 'RAZORPAY_WEBHOOK_SECRET',
    tier: 2,
    purpose: 'Payments',
    note: 'Webhook signature verification',
    example: 'whsec_...',
    warnIfMissing: false
  },
  {
    key: 'WORDPRESS_API_URL',
    tier: 2,
    purpose: 'Blog',
    note: 'WordPress REST API base URL (if auto-publishing)',
    example: 'https://blog.thedivinetarot.com/wp-json/wp/v2',
    warnIfMissing: false
  },
  {
    key: 'WORDPRESS_USERNAME',
    tier: 2,
    purpose: 'Blog',
    note: 'WordPress admin username',
    example: 'admin',
    warnIfMissing: false
  },
  {
    key: 'WORDPRESS_APP_PASSWORD',
    tier: 2,
    purpose: 'Blog',
    note: 'WordPress application password',
    example: 'abcd abcd abcd abcd',
    warnIfMissing: false
  },
  {
    key: 'ELEVENLABS_API_KEY',
    tier: 2,
    purpose: 'Video',
    note: 'Set if using ElevenLabs for video generation',
    example: 'your-elevenlabs-key',
    warnIfMissing: false
  },
  {
    key: 'TWILIO_ACCOUNT_SID',
    tier: 2,
    purpose: 'WhatsApp (Twilio)',
    note: 'Set if using Twilio WhatsApp',
    example: 'AC...',
    warnIfMissing: false
  },
  {
    key: 'TWILIO_AUTH_TOKEN',
    tier: 2,
    purpose: 'WhatsApp (Twilio)',
    note: 'Twilio auth token',
    example: 'your-auth-token',
    warnIfMissing: false
  },
  {
    key: 'TWILIO_WHATSAPP_NUMBER',
    tier: 2,
    purpose: 'WhatsApp (Twilio)',
    note: 'Twilio WhatsApp sender number',
    example: '+1234567890',
    warnIfMissing: false
  },
  {
    key: 'TWILIO_STATUS_CALLBACK_URL',
    tier: 2,
    purpose: 'WhatsApp',
    note: 'Webhook URL for status callbacks',
    example: 'https://your-domain.com/api/whatsapp/webhook',
    warnIfMissing: false
  },
  {
    key: 'WHATSAPP_PHONE_NUMBER_ID',
    tier: 2,
    purpose: 'WhatsApp (Meta)',
    note: 'Alternative: Meta WhatsApp Business number ID',
    example: '123456789',
    warnIfMissing: false
  },
  {
    key: 'WHATSAPP_TOKEN',
    tier: 2,
    purpose: 'WhatsApp (Meta)',
    note: 'Meta WhatsApp API token',
    example: 'your-meta-token',
    warnIfMissing: false
  },
  {
    key: 'WHATSAPP_API_URL',
    tier: 2,
    purpose: 'WhatsApp (Meta)',
    note: 'WhatsApp Graph API endpoint',
    example: 'https://graph.facebook.com/v18.0/...',
    warnIfMissing: false
  },

  // Tier 3: Analytics (optional but recommended)
  {
    key: 'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
    tier: 3,
    purpose: 'Analytics',
    note: 'Google Analytics 4 measurement ID',
    example: 'G-XXXXXXXXXX',
    warnIfMissing: false
  },
  {
    key: 'NEXT_PUBLIC_CLARITY_PROJECT_ID',
    tier: 3,
    purpose: 'Analytics',
    note: 'Microsoft Clarity project ID',
    example: 'xxxxx',
    warnIfMissing: false
  },
  {
    key: 'NEXT_PUBLIC_GTM_ID',
    tier: 3,
    purpose: 'Analytics',
    note: 'Google Tag Manager container ID',
    example: 'GTM-XXXXXXX',
    warnIfMissing: false
  },

  // Feature Flags (booleans, all optional with sensible defaults)
  {
    key: 'NEXT_PUBLIC_ENABLE_PAYMENTS',
    tier: 3,
    purpose: 'Feature Flag',
    note: 'Set "true" or "false" (default: true)',
    example: 'true',
    warnIfMissing: false
  },
  {
    key: 'NEXT_PUBLIC_ENABLE_EMAILS',
    tier: 3,
    purpose: 'Feature Flag',
    note: 'Set "true" or "false" (default: true)',
    example: 'true',
    warnIfMissing: false
  },
  {
    key: 'NEXT_PUBLIC_SKIP_CRON',
    tier: 3,
    purpose: 'Dev',
    note: 'Set "true" to disable scheduled jobs locally',
    example: 'false',
    warnIfMissing: false
  },
];

let buildShouldFail = false;
let warnings = 0;

console.log(`${CYAN}📋 Checking environment variables...${RESET}\n`);

// Group by tier
const tierNames = {
  1: { name: 'Core (Production Required)', emoji: `${RED}●${RESET}`, fail: true },
  2: { name: 'Optional Features', emoji: `${YELLOW}○${RESET}`, fail: false },
  3: { name: 'Analytics & Flags', emoji: `${CYAN}○${RESET}`, fail: false },
};

envConfig.forEach(({ key, tier, purpose, note, example }) => {
  const tierInfo = tierNames[tier];
  const value = process.env[key] || localEnv[key];
  const isSet = value && value.trim() !== '';
  
  // Mask secrets
  const isSecret = key.includes('KEY') || key.includes('SECRET') || key.includes('TOKEN') || key.includes('PASSWORD');
  const displayValue = isSet && isSecret ? '***set***' : (isSet ? value : '');
  
  if (isSet) {
    console.log(`  ${GREEN}✓${RESET} ${key}`);
    if (displayValue) console.log(`         ${YELLOW}=>${RESET} ${displayValue}`);
  } else {
    console.log(`  ${tierInfo.emoji} ${key}`);
    console.log(`         ${YELLOW}→${RESET} ${note}`);
    console.log(`         ${CYAN}ℹ${RESET} ${tierInfo.name}${tier === 1 ? ` ${YELLOW}(should be set for prod)${RESET}` : ''}`);
    warnings++;
    
    // Only fail build for Tier 1 if explicitly missing (applies to Vercel)
    if (tier === 1 && tierInfo.fail) {
      // Check if any fallback exists in code
      // For now, toggle based on strictness threshold
      buildShouldFail = true;
    }
  }
});

console.log('');

// Summary
if (buildShouldFail) {
  console.error(`${RED}${BOLD}❌ Missing required environment variables for production${RESET}`);
  console.error(`${YELLOW}💡 Set them in .env.local or Vercel dashboard before deploying${RESET}\n`);
  process.exit(1);
}

if (warnings > 0) {
  console.log(`${YELLOW}⚠️  ${warnings} variable(s) not set — some features may be disabled${RESET}`);
  console.log(`   This is OK for development. For production, review the list above.\n`);
} else {
  console.log(`${GREEN}${BOLD}✅ All core environment variables configured${RESET}\n`);
  console.log(`   Ready to build and deploy.\n`);
}

process.exit(0);
