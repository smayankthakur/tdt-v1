import { create } from "zustand"

export type Language = "en" | "hi" | "hinglish"

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: typeof window !== "undefined"
    ? (localStorage.getItem("lang") as Language) || "hinglish"
    : "hinglish",

  setLanguage: (lang: Language) => {
    localStorage.setItem("lang", lang)
    set({ language: lang })
  },
}))