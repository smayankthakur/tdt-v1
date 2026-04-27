# Environment Variables Reference

## 📋 Overview

This document lists all environment variables required by The Divine Tarot application.

**Rules:**
- ❌ Never commit `.env.local`
- ✅ Use `.env.example` for sharing variable names
- ✅ All secrets must be stored in Vercel environment variables
- ✅ Server-only variables (no `NEXT_PUBLIC_` prefix) are never exposed to browser

---

## 🔐 Required Variables

### Core Application

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | string | Public | Base URL of the app (e.g., `https://thedivinetarot.com`) |

---

### OpenAI (AI Tarot Readings)

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `OPENAI_API_KEY` | string | **Server-only** | OpenAI API key for generating AI tarot readings |
| `OPENAI_KEY` | string | **Server-only** | Alternative key (used as fallback) |

**Used in:** `src/lib/ai/`, `src/lib/horoscope/`, `src/lib/blog/`, `src/lib/automation/`, `src/lib/social/`

---

### Resend (Email Service)

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `RESEND_API_KEY` | string | **Server-only** | Resend API key for sending emails |
| `RESEND_FROM_EMAIL` | string | **Server-only** | Sender email address (must be verified domain) |

**Used in:** `src/app/api/subscribe/route.ts`, `src/lib/resend.ts`

---

### Supabase (Database + Auth)

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | string | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | string | Public | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | string | **Server-only** | Admin key — NEVER expose to browser |

**Used in:** `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`

---

### Razorpay (Payments - India)

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `RAZORPAY_KEY_ID` | string | **Server-only** | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | string | **Server-only** | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | string | **Server-only** | Webhook signature verification secret |

**Used in:** `src/lib/payments/razorpay.ts`, `src/lib/payments/access-control.ts`

---

### Twilio (WhatsApp - Optional)

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `TWILIO_ACCOUNT_SID` | string | **Server-only** | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | string | **Server-only** | Twilio auth token |
| `TWILIO_WHATSAPP_NUMBER` | string | **Server-only** | Twilio WhatsApp number |
| `TWILIO_STATUS_CALLBACK_URL` | string | **Server-only** | Webhook URL for delivery status |

**Used in:** `src/lib/whatsapp/sendMessage.ts`

---

### WhatsApp Meta API (Alternative to Twilio)

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `WHATSAPP_PHONE_NUMBER_ID` | string | **Server-only** | WhatsApp business phone number ID |
| `WHATSAPP_TOKEN` | string | **Server-only** | Meta WhatsApp API token |
| `WHATSAPP_API_URL` | string | **Server-only** | WhatsApp API endpoint URL |

**Used in:** `src/lib/whatsapp-integration.ts`

---

### WordPress Blog (SEO Content)

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `WORDPRESS_API_URL` | string | **Server-only** | WordPress REST API base URL |
| `WORDPRESS_USERNAME` | string | **Server-only** | WordPress admin username |
| `WORDPRESS_APP_PASSWORD` | string | **Server-only** | WordPress application password |

**Used in:** `src/lib/blog/content-generator.ts`, `scripts/generate-content.js`

---

### ElevenLabs (Video Generation)

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `ELEVENLABS_API_KEY` | string | **Server-only** | ElevenLabs API key for voice/video generation |

**Used in:** `src/lib/social/video-generator.ts`

---

### Analytics & Tracking

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | string | Public | Google Analytics measurement ID (e.g., `G-XXXXXX`) |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | string | Public | Microsoft Clarity project ID |
| `NEXT_PUBLIC_GTM_ID` | string | Public | Google Tag Manager container ID |

**Used in:** `src/app/layout.tsx`, `src/lib/analytics/`

---

### Feature Flags

| Variable | Type | Exposure | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_ENABLE_PAYMENTS` | boolean | Public | Enable/disable payment features (`true`/`false`) |
| `NEXT_PUBLIC_ENABLE_EMAILS` | boolean | Public | Enable/disable email sending (`true`/`false`) |
| `NEXT_PUBLIC_SKIP_CRON` | boolean | Public | Skip cron job execution during development (`true`/`false`) |

---

## 🚀 Vercel Setup

Add all variables in **Vercel Dashboard**:

```
Project → Settings → Environment Variables
```

**Add to:** Production, Preview, Development (separate values per environment if needed)

### Order of Setup (Recommended)

1. **Supabase** — Create project → get URL + anon key + service role key
2. **OpenAI** — Generate API key
3. **Resend** — Add domain → get API key + set `RESEND_FROM_EMAIL`
4. **Analytics** — Add GA4/Clarity/GTM IDs
5. **Razorpay** — (if using payments) Get key + secret + webhook secret
6. **WhatsApp** — (if using) Configure Twilio or Meta API
7. **WordPress** — Create admin user → generate app password
8. **Feature Flags** — Set defaults

---

## 🧪 Testing Locally

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in actual values in `.env.local`

3. Restart dev server:
   ```bash
   npm run dev
   ```

**Note:** `.env.local` is gitignored — never committed.

---

## 🔒 Security Best Practices

| Rule | Reason |
|------|--------|
| `NEXT_PUBLIC_` prefix only for browser-safe vars | Anything with this prefix is exposed to client JavaScript |
| Server-only vars (no prefix) stay in API routes only | Prevents leaking secrets |
| Use `process.env.VAR_NAME` only in server code | Never use server-only vars in React components |
| Validate env vars at startup | Fail fast if missing critical keys |
| Rotate keys regularly | Security hygiene |

---

## 🛡️ Safe Access Pattern

```typescript
// ❌ BAD — crashes at module load if missing
const client = new SomeAPI(process.env.API_KEY);

// ✅ GOOD — lazy initialization inside function
function getClient() {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("API_KEY not configured");
    return null;
  }
  return new SomeAPI(key);
}
```

---

## 📁 File Structure

```
divine-tarot/
├── .env.local              # Your local secrets (gitignored)
├── .env.example            # Template for team/CI (committed)
├── ENV_KEYS.md             # This documentation (committed)
├── .gitignore              # Ensures .env.* is ignored
├── src/
│   ├── lib/
│   │   ├── resend.ts       # Safe Resend wrapper
│   │   ├── supabase/
│   │   └── payments/
│   └── app/api/
│       └── subscribe/
│           └── route.ts   # Uses getResendClient()
└── package.json
```

---

## 🔄 Variable Mapping

| Feature | Env Vars |
|---------|----------|
| AI Readings | `OPENAI_API_KEY`, `OPENAI_KEY` |
| Newsletter Emails | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| Database/Auth | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Payments | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` |
| WhatsApp | `TWILIO_*` or `WHATSAPP_*` |
| Blog Publishing | `WORDPRESS_API_URL`, `WORDPRESS_USERNAME`, `WORDPRESS_APP_PASSWORD` |
| Video Generation | `ELEVENLABS_API_KEY` |
| Analytics | `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`, `NEXT_PUBLIC_GTM_ID` |

---

## ⚠️ Common Pitfalls

1. **Missing variable at build** → Ensure all NEXT_PUBLIC_* vars have defaults or are set in Vercel
2. **Server-only var in browser** → TypeScript/ESLint should catch; look for `NEXT_PUBLIC_` prefix misuse
3. **Trailing spaces in .env** → Can cause "undefined" errors
4. **Forgot to restart dev server** → `.env.local` changes require server restart
5. **Using `process.env` in client components** → Only use NEXT_PUBLIC_* in client

---

## 📞 Support

For questions about environment setup, check:
- Vercel docs: https://vercel.com/docs/concepts/projects/environment-variables
- Next.js env: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
