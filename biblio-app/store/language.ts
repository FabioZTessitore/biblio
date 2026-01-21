import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import i18n from 'i18next';

export interface TLanguageState {
  language: string;
}

export interface TLanguageMutations {
  setLanguage: (lang: string) => void;
}

export interface TLanguageAction {
  initLanguage: () => void;
}

export type TLanguageStore = TLanguageState & TLanguageMutations & TLanguageAction;

const languageState = <TLanguageState>{
  language: '',
};

const languageMutations = <TLanguageMutations>{
  setLanguage: (newLanguage: string) => {
    useLanguageStore.setState({ language: newLanguage });
    i18n.changeLanguage(newLanguage);
  },
};

const languageAction = <TLanguageAction>{
  initLanguage: () => {
    const { language } = useLanguageStore.getState();

    if (language) {
      useLanguageStore.setState({ language: language });
    } else {
      const supportedLanguages = ['it-IT'];
      type SupportedLanguage = (typeof supportedLanguages)[number];

      const initialLang = getLocales()[0].languageTag as SupportedLanguage;

      if (supportedLanguages.includes(initialLang)) {
        useLanguageStore.setState({ language: initialLang });
      } else {
        useLanguageStore.setState({ language: 'it-IT' });
      }
    }
  },
};

export const useLanguageStore = create<TLanguageStore>()(
  persist(
    () => ({
      ...languageState,
      ...languageMutations,
      ...languageAction,
    }),
    {
      name: 'languageStore',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
