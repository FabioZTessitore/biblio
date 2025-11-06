import { useUserStore } from './user';
import { useBookStore } from './book';
import { useSchoolStore } from './school';

import { createJSONStorage, persist } from 'zustand/middleware';
import { create } from 'zustand';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TRootState {
  loading: boolean;
  error: string | null;
  firstAccess: boolean;
}

export interface TRootMutations {
  reset: () => void;
  setFirstAccess: (value: boolean) => void;
}

export interface TRootAction {
  resetApp: () => void;
}

export type TRootStore = TRootState & TRootMutations & TRootAction;

const rootState = <TRootState>{
  firstAccess: true,
  loading: false,
  error: null,
};

const rootMutations = <TRootMutations>{
  reset: () =>
    useRootStore.setState(() => ({
      ...rootState,
    })),
  setFirstAccess: (value) => useRootStore.setState({ firstAccess: value }),
};

const rootAction = <TRootAction>{
  resetApp: () => {
    useRootStore.getState().reset();
  },
};

export const useRootStore = create<TRootStore>()(
  persist(
    () => ({
      ...rootState,
      ...rootMutations,
      ...rootAction,
    }),
    {
      name: 'rootStore',
      // storage: createJSONStorage(() => (Platform.OS === 'web' ? sessionStorage : AsyncStorage)),
    }
  )
);

export { useUserStore, useBookStore, useSchoolStore };
