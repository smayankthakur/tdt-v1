import { useLanguageStore } from "@/store/languageStore";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex gap-2">
      <button onClick={() => setLanguage("en")}>EN</button>
      <button onClick={() => setLanguage("hi")}>हिंदी</button>
      <button onClick={() => setLanguage("hinglish")}>Hinglish</button>
    </div>
  );
}