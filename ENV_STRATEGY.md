# Environment Configuration Strategy

## 🎯 Philosophy

This project uses **build-flexible, runtime-safe** environment configuration:

| Phase | Behavior |
|-------|----------|
| **Local Development** | Strict — build fails if core env vars missing |
| **Vercel Deployment** | Permissive — warns only, never fails |
| **Runtime** | Lazy initialization with graceful fallbacks |

## 🔧 Why This Design?

1. **Developer Safety** — Local builds catch missing env vars early
2. **CI/CD Flexibility** — Vercel can build even if some vars added later in dashboard
3. **Production Stability** — API clients lazily initialize, preventing crashes
4. **Feature Degradation** — Missing optional vars just disable features

## 📋 Validation Script: `scripts/validateEnv.js`

### Detection Logic

```js
const isVercel = process.env.VERCEL || process.env.NOW || process.env.VERCEL_ENV;
```

### Behavior

- **Local** (`isVercel === false`):
  - Tier 1 (Core) vars missing → `process.exit(1)` ❌
  - Tier 2–3 missing → warnings only ✅

- **Vercel** (`isVercel === true`):
  - ANY missing → warnings only ✅
  - Never fails build ✅

## 🛡️ Runtime Safety Pattern

All API clients follow this pattern:

```typescript
// ✅ Safe — lazy initialization inside function
export function getClient() {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("API_KEY not set — feature disabled");
    return null;
  }
  return new APIClient(key);
}
```

**Never** do this at module level:

```typescript
// ❌ Crash on build if env missing
const client = new APIClient(process.env.API_KEY);
```

## 📊 Tier Classification

### Tier 1: Core (Production Required)
These vars are checked strictly locally. On Vercel they show warnings but don't block.

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` (or `OPENAI_KEY`)
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`

### Tier 2: Optional Features
Never block build. Missing = feature disabled.

- Razorpay vars (payments)
- WordPress vars (blog publishing)
- Twilio/WhatsApp vars (messaging)
- ElevenLabs (video)

### Tier 3: Analytics & Flags
Always optional. Have sensible defaults.

- GA4, Clarity, GTM IDs
- Feature flag booleans

## 🚀 Vercel Deployment Flow

1. **Push code** → Vercel detects `VERCEL=1`
2. **Build runs** → `validate:env` warns but continues
3. **Next.js build** → Completes successfully
4. **Deploy** → App goes live
5. **Add env vars** (if missing) → Vercel Dashboard → Settings → Environment Variables
6. **Redeploy** → Full functionality

**You can add env vars AFTER initial deployment** — build won't crash.

## 🧪 Local Development

```bash
# 1. Copy template
cp .env.example .env.local

# 2. Fill in real values (all Tier 1 required locally)
# 3. Run build
npm run build
# → Fails if Tier 1 missing (prevents "works on my machine")
```

## 📁 Files

| File | Purpose |
|------|---------|
| `.env.local` | Your local secrets (gitignored) |
| `.env.example` | Template for team/CI (committed) |
| `ENV_KEYS.md` | Full documentation of all 26 vars |
| `scripts/validateEnv.js` | Validation logic (Vercel-aware) |
| `src/lib/resend.ts` | Example of safe lazy initialization |

## ⚠️ Common Scenarios

### Scenario 1: First Vercel deploy without all env vars
```
Build: ✅ Passes (warnings only)
Deploy: ✅ Succeeds
App: ⚠️ Some features may be disabled
Fix: Add missing vars in Vercel dashboard, redeploy
```

### Scenario 2: Developer forgets `.env.local`
```
Build: ❌ Fails (local strict mode)
Error: Missing core env vars
Fix: Copy .env.example → .env.local
```

### Scenario 3: Optional feature not configured
```
Build: ✅ Passes
Runtime: ✅ Feature gracefully disabled
Logs: "Feature X not configured — skipping"
```

## 🔒 Security Notes

- Server-only vars (no `NEXT_PUBLIC_`) never exposed to browser
- `NEXT_PUBLIC_*` vars ARE exposed — only put non-secret values
- `isProduction` check: `process.env.NODE_ENV === 'production'`
- Never commit `.env.local` (gitignored)

## 📈 Adding New Environment Variables

1. **Add to schema** (if feature-flagged):
   - Add key to `scripts/validateEnv.js` in correct tier
   - Document in `ENV_KEYS.md`
   
2. **Use safely in code**:
   ```typescript
   const key = process.env.MY_API_KEY;
   if (!key) {
     console.warn("MY_API_KEY not set");
     return fallback;
   }
   // use key
   ```

3. **Add to `.env.example`** (empty value)

4. **Add to `.env.local`** (for local dev)

5. **Add to Vercel** (for production)

---

✅ **Result**: Robust, deployable, developer-friendly env system.
