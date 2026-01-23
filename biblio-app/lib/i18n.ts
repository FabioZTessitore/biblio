import { useLanguageStore } from '~/store';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationIt from '~/locales/it-IT/translation.json';
// import translationEn from '~/locales/en-US/translation.json';
// import translationEs from '~/locales/es-ES/translation.json';
// import translationDe from '~/locales/de-DE/translation.json';

const resources = {
  'it-IT': { translation: translationIt },
};

const initI18n = async () => {
  const { initLanguage } = useLanguageStore.getState();

  await new Promise((resolve) => {
    initLanguage();
    setTimeout(resolve, 0);
  });

  console.log('eheheh');
  const { language } = useLanguageStore.getState();

  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4',
    resources,
    lng: language,
    fallbackLng: 'it-IT',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
