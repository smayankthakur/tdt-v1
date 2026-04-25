import { useLanguageStore } from "@/store/languageStore"
import { t as i18nT } from "@/i18n/i18n"

export function useTranslation() {
  const { language } = useLanguageStore()

  function t(path: string, variables?: Record<string, string | number>) {
    return i18nT(path, language, variables)
  }

  return { t, language }
}