import type { Language } from './config'
import { langMap } from './config'
import { TRANSLATIONS } from './translations'
import { translations as flatTranslations } from '@/translations'

// In-memory cache for API-fetched translations
let translationCache: {
  data: Record<string, Record<string, string>>
  lastFetched: number
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Get translation from nested structure (existing system)
 */
function getNestedTranslation(key: string, lang: Language): string {
  const mappedLang = langMap[lang] || lang
  const keys = key.split('.')
  let value: unknown = TRANSLATIONS[mappedLang]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return key
    }
  }

  return typeof value === 'string' ? value : key
}

/**
 * Get translation from flat store (auto-generated keys)
 */
function getFlatTranslation(key: string, lang: Language): string | undefined {
  const mappedLang = langMap[lang] || lang
  // Use explicit typing to satisfy TypeScript
  const flatDicts: Record<string, Record<string, string>> = flatTranslations
  const langDict = flatDicts[mappedLang as keyof typeof flatDicts]
  return langDict?.[key]
}

/**
 * Sync translation getter (main export for useLanguage)
 * Merges nested and flat translation sources
 */
export function getTranslationSync(key: string, lang: Language): string {
  // 1. Try nested structure first (existing translations)
  const nested = getNestedTranslation(key, lang)
  if (nested !== key) return nested

  // 2. Try flat store (CMS-managed)
  const flat = getFlatTranslation(key, lang)
  if (flat) return flat

  // 3. Return key as fallback
  return key
}

/**
 * Load translations from API with caching
 */
export async function loadTranslations(lang: Language = 'en'): Promise<Record<string, string>> {
  // Check cache first
  if (translationCache && (Date.now() - translationCache.lastFetched) < CACHE_DURATION) {
    const cacheLang = lang as keyof typeof translationCache.data
    return translationCache.data[cacheLang] || {}
  }

  try {
    // Fetch from API (for dynamic CMS updates)
    const res = await fetch('/api/translations', {
      cache: 'no-store'
    })

    if (res.ok) {
      const data = await res.json()
      translationCache = {
        data,
        lastFetched: Date.now()
      }
      return data[lang] || data.english || {}
    }
  } catch (error) {
    console.warn('[i18n] Failed to fetch translations from API, using fallback:', error)
  }

  // Fallback: merge static sources (nested + flat)
  const result: Record<string, string> = {}
  
  // From nested (flatten all keys)
  const flattenNested = (obj: unknown, prefix = ''): void => {
    if (obj && typeof obj === 'object') {
      Object.entries(obj as Record<string, unknown>).forEach(([k, v]) => {
        const newPrefix = prefix ? `${prefix}.${k}` : k
        if (typeof v === 'string') {
          result[newPrefix] = v
        } else {
          flattenNested(v, newPrefix)
        }
      })
    }
  }
  flattenNested(TRANSLATIONS[lang] || {})
  
  // From flat store
  const flatDicts: Record<string, Record<string, string>> = flatTranslations
  const flatLangKey = lang as keyof typeof flatDicts
  Object.assign(result, flatDicts[flatLangKey] || {})
  
  return result
}

/**
 * Clear translation cache (call after CMS updates)
 */
export function clearTranslationCache(): void {
  translationCache = null
}

/**
 * Refresh translations (clear cache; next fetch will be fresh)
 */
export function refreshTranslations(): void {
  clearTranslationCache()
}
