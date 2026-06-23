import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources.js';

const STORAGE_KEY = 'smart-study-language';

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem(STORAGE_KEY);

  if (savedLanguage === 'bg' || savedLanguage === 'en') {
    return savedLanguage;
  }

  return 'bg';
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'bg',
  interpolation: {
    escapeValue: false
  }
});

i18n.on('languageChanged', (language) => {
  localStorage.setItem(STORAGE_KEY, language);
  document.documentElement.lang = language;
});

document.documentElement.lang = i18n.language;

export default i18n;