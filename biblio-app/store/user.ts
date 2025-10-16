import { router } from 'expo-router';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TUserState {
  username: string;
  isAuthenticated: boolean;
}

export interface TUserMutations {}

export interface TUserAction {
  login: () => void;
}

export type TUserStore = TUserState & TUserMutations & TUserAction;

const profileState = <TUserState>{
  username: '',
  isAuthenticated: false,
};

const profileMutations = <TUserMutations>{};

const profileAction = <TUserAction>{
  login: () => {
    useUserStore.setState({ isAuthenticated: true });
    router.replace('/(tabs)');
  },
};

export const useUserStore = create<TUserStore>()(
  persist(
    () => ({
      ...profileState,
      ...profileMutations,
      ...profileAction,
    }),
    {
      name: 'profileStore',
      // storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
