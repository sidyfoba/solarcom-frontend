import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en/translation.json";
import frTranslations from "./locales/fr/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    fr: { translation: frTranslations },
  },
  lng: localStorage.getItem("language") || "en", // Load language from localStorage
  fallbackLng: "en", // Fallback language if translation is missing
  interpolation: {
    escapeValue: false, // React already safes from xss
  },
});
// Save language choice to localStorage when changed
i18n.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18n;
