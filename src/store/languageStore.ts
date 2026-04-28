import { create } from "zustand"
import { getDefaultLanguage } from "@/lib/i18n/getDefaultLanguage"

export type Language = "en" | "hi" | "hinglish"

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: getDefaultLanguage(),

  setLanguage: (lang: Language) => {
    localStorage.setItem("lang", lang)
    set({ language: lang })
  },
}))