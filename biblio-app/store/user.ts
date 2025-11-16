import { create } from 'zustand';
import { router } from 'expo-router';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Book } from './book';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Profile {
  name: string;
  surname: string;
  email: string;
  booksId: string[];
  schoolsId: string[];
}

export interface TUserState {
  library: Book[];

  profile: Profile | null;

  uid: string | null;
}

export interface TUserMutations {
  addBookToLibrary: (book: Book) => void;
  setProfile: (profile: Profile) => void;
  setUid: (uid: string) => void;
}

export interface TUserAction {
  login: () => void;
}

export type TUserStore = TUserState & TUserMutations & TUserAction;

const profileState = <TUserState>{
  library: [],

  profile: null,

  uid: null,
};

const profileMutations = <TUserMutations>{
  setProfile: (profile: Profile) => useUserStore.setState({ profile }),
};

const profileAction = <TUserAction>{
  login: () => {
    // fetch profile from db
    router.replace('/(tabs)');
  },

  // addBook: (newBookId: string) => set((state) => ({ booksId: [...state.booksId, newBookId] })),
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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
