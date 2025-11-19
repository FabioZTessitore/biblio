import { create } from 'zustand';
import { router } from 'expo-router';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Book } from './book';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/lib/firebase';

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
  isAuthenticated: boolean;
}

export interface TUserMutations {
  addBookToLibrary: (book: Book) => void;
  removeBookFromLibrary: (book: Book) => void;
  setProfile: (profile: Profile) => void;
  setLibrary: (library: Book[]) => void;
  setUid: (uid: string) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export interface TUserAction {
  login: () => void;
}

export type TUserStore = TUserState & TUserMutations & TUserAction;

const profileState = <TUserState>{
  library: [],

  profile: null,

  uid: null,

  isAuthenticated: false, // aggiunto perché un uid potrebbe averlo anche uno studente
};

const profileMutations = <TUserMutations>{
  setProfile: (profile: Profile) => useUserStore.setState({ profile }),

  setLibrary: (library) => useUserStore.setState({ library }),

  addBookToLibrary: (book: Book) =>
    useUserStore.setState((state) => ({ library: [...state.library, book] })),

  removeBookFromLibrary: (book: Book) =>
    useUserStore.setState((state) => ({
      library: state.library.filter((b) => b.id !== book.id),
    })),

  setIsAuthenticated: (value) => useUserStore.setState({ isAuthenticated: value }),
};

const profileAction = <TUserAction>{
  login: async () => {
    const { setIsAuthenticated } = useUserStore.getState();

    // fetch profile from db

    setIsAuthenticated(true);

    // router.replace('/(tabs)');
  },

  loadProfile: async () => {
    const { setProfile, uid } = useUserStore.getState();

    if (!uid) return;

    try {
      const docRef = doc(db, 'users', uid);
      // info sullo user
      const docSnap = await getDoc(docRef);

      const newProfile = docSnap.data() as Profile;

      // set stato utente
      setProfile(newProfile);
    } catch (error) {
      console.log('loginHelper error: ', error);
    }
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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
