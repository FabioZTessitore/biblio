import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import i18n, { t } from 'i18next';

export interface TSettingsState {
  language: string;
  hapticsEnabled: boolean;
}

export interface TSettingsMutations {
  setLanguage: (lang: string) => void;
  setHapticsEnabled: (isEnabled: boolean) => void;
}

export interface TSettingsAction {
  initLanguage: () => void;
  toggleHaptics: () => void;
}

export type TLanguageStore = TSettingsState & TSettingsMutations & TSettingsAction;

const languageState = <TSettingsState>{
  language: '',
  hapticsEnabled: false,
};

const languageMutations = <TSettingsMutations>{
  setLanguage: (newLanguage) => {
    useSettingsStore.setState({ language: newLanguage });
    i18n.changeLanguage(newLanguage);
  },

  setHapticsEnabled: (isEnabled) => {
    useSettingsStore.setState({ hapticsEnabled: isEnabled });
  },
};

const languageAction = <TSettingsAction>{
  initLanguage: () => {
    const { language } = useSettingsStore.getState();

    if (language) {
      useSettingsStore.setState({ language: language });
    } else {
      const supportedLanguages = ['it-IT'];
      type SupportedLanguage = (typeof supportedLanguages)[number];

      const initialLang = getLocales()[0].languageTag as SupportedLanguage;

      if (supportedLanguages.includes(initialLang)) {
        useSettingsStore.setState({ language: initialLang });
      } else {
        useSettingsStore.setState({ language: 'it-IT' });
      }
    }
  },

  toggleHaptics: () => {
    const { hapticsEnabled, setHapticsEnabled } = useSettingsStore.getState();

    setHapticsEnabled(!hapticsEnabled);
  },
};

export const useSettingsStore = create<TLanguageStore>()(
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
