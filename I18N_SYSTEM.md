# i18n/Automated Translation System

## 🎯 Overview

This system automatically detects hardcoded text in the codebase and generates translation keys. It provides a centralized CMS for managing translations and enforces that all UI text uses the translation system.

## 📋 Components

### 1. Codebase Scanner (`scripts/i18n-audit.js`)
Scans all `.tsx`, `.ts`, `.jsx`, `.js` files to find hardcoded UI strings.

```bash
node scripts/i18n-audit.js
```

Outputs `i18n-report.json` with:
- File paths
- Line numbers
- Detected text
- Auto-generated translation keys

### 2. Translation Store (`src/translations/index.ts`)
Central store for all translations in three languages:
- `english` (base)
- `hinglish` (Romanized Hindi/English mix)
- `hindi` (Devanagari script)

Auto-populated by the sync script.

### 3. Sync Utility (`scripts/i18n-sync.js`)
Generates translation keys from the audit report and updates `src/translations/index.ts`.

```bash
node scripts/i18n-sync.js
```

This:
- Adds new keys with English text as default value
- Creates `src/translations/migration.ts` with missing translations stats
- Updates the main `index.ts` file

### 4. Runtime Loader (`src/lib/i18n/loader.ts`)
Unified translation loader that merges:
- Nested translations (existing system: `hero.headline.default`)
- Flat keys (auto-generated: `tumhara_naam`)

Exports:
- `getTranslationSync(key, lang)` - for sync usage
- `loadTranslations(lang)` - async fetch from API (for future Supabase)
- `refreshTranslations()` - clear cache

### 5. API Endpoint (`src/app/api/translations/route.ts`)
REST endpoint for translation CRUD operations.
- `GET /api/translations` - returns all translations
- `POST /api/translations` - update/create translations (admin only)

Currently reads from local store; future: integrate Supabase.

### 6. Translation CMS (`src/app/admin/translations/page.tsx`)
Web UI for managing translations at `/admin/translations`:

Features:
- Table with columns: Key | English | Hinglish | Hindi
- Inline editing
- Search & filter (missing/complete)
- Stats dashboard
- Export to CSV
- Save changes via API

Access: Navigate to `/admin/translations` (consider adding auth middleware).

### 7. Integration with Existing `useLanguage` Hook
Updated `src/hooks/useLanguage.ts` to use the unified loader via `@/lib/i18n/loader`.

All existing components using `const { t } = useLanguage()` automatically get translations from both nested and flat sources.

### 8. Verification Script (`scripts/verify-i18n.js`)
Ensures all hardcoded strings have corresponding translation keys.

```bash
node scripts/verify-i18n.js
```

Exits with code 1 if any hardcoded text missing a key.

### 9. Husky Pre-Commit Hook (`.husky/pre-commit`)
Runs before each commit:
1. TypeScript check
2. i18n verification (via `scripts/verify-i18n.js`)
3. ESLint
4. Build

If any hardcoded text is not in the translations store, commit is blocked with instructions to run `node scripts/i18n-sync.js`.

## 🚀 Workflow

### Adding New UI Text

1. Add your JSX with hardcoded text (temporarily)
   ```tsx
   <h1>My New Feature</h1>
   ```

2. Run scanner to detect:
   ```bash
   node scripts/i18n-audit.js
   ```

3. Sync to add keys:
   ```bash
   node scripts/i18n-sync.js
   ```

4. Edit `src/translations/index.ts` (or use CMS) to add Hinglish & Hindi translations:
   ```ts
   my_new_feature: "My New Feature" // English (auto-filled)
   // Add:
   // hinglish: { my_new_feature: "Mera Naya Feature" },
   // hindi: { my_new_feature: "मेरा नया फीचर" }
   ```

5. Replace hardcoded text with `t()`:
   ```tsx
   import { useLanguage } from '@/hooks/useLanguage'
   const { t } = useLanguage()
   <h1>{t('my_new_feature')}</h1>
   ```

6. Run pre-commit checks (or manually run verification):
   ```bash
   node scripts/verify-i18n.js
   ```

7. Commit ✅

### Translating Content (Content Team)

1. Access CMS at `/admin/translations`
2. Fill Hinglish and Hindi columns for each key
3. Click "Save Changes" to persist via API
4. Translations are instantly available on the frontend (cached for 5 min)

### Adding New Languages

1. Add language code to `src/lib/i18n/config.ts` in `Language` type and `LANGUAGES` map
2. Extend `src/translations/index.ts` to include new language object
3. Update `langMap` if needed
4. Run sync to begin populating

## 🔧 Commands

| Command | Description |
|---------|-------------|
| `node scripts/i18n-audit.js` | Scan codebase for hardcoded strings |
| `node scripts/i18n-sync.js` | Generate keys and update translation store |
| `node scripts/verify-i18n.js` | Verify all hardcoded strings have keys |
| `npm run build` | Build with i18n checks |
| `npm run lint` | ESLint includes translation rule (if configured) |

## 📁 File Structure

```
divine-tarot/
├── scripts/
│   ├── i18n-audit.js      # scanner
│   ├── i18n-sync.js       # key generator & store updater
│   └── verify-i18n.js     # pre-commit validator
├── src/
│   ├── translations/
│   │   ├── index.ts       # centralized flat translation store
│   │   └── migration.ts   # helper with missing translations stats
│   ├── lib/
│   │   └── i18n/
│   │       ├── config.ts  # language config
│   │       ├── translations.ts # legacy nested translations
│   │       └── loader.ts  # unified loader
│   ├── hooks/
│   │   └── useLanguage.ts # integrated
│   └── app/
│       ├── admin/
│       │   └── translations/  # CMS UI
│       └── api/
│           └── translations/route.ts
├── .husky/
│   └── pre-commit         # runs verification
└── eslint-plugin-local/   # custom ESLint rule (optional)
    └── rules/
        └── no-hardcoded-text.js
```

## 🛡️ Enforcement Layers

1. **Developer workflow** – Scanner & sync encourage adding keys
2. **Pre-commit hook** – Blocks commits with new hardcoded text
3. **ESLint rule** – (Optional) Real-time editor warnings
4. **CMS dashboard** – Central content management

## 📈 Benefits

- ✅ No more scattered hardcoded strings
- ✅ Single source of truth for all UI text
- ✅ Content editors can update copy without developers
- ✅ Scales to any number of languages
- ✅ Immediate visual feedback in code reviews

## 🚨 Troubleshooting

**Verification fails with "hardcoded text not in translations"**  
Run `node scripts/i18n-sync.js` to add missing keys, then translate them in the CMS.

**Build fails with translation type errors**  
Ensure you're using `t()` hook for all UI text. Import from `@/hooks/useLanguage`.

**CMS page shows empty translations**  
Run `node scripts/i18n-sync.js` to populate `src/translations/index.ts`.

**Pre-commit hook not running**  
Run `npm run prepare` (husky install) or manually: `npx husky install`.
