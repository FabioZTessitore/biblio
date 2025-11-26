import { create } from 'zustand';
import { router } from 'expo-router';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Book } from './book';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '~/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

interface Profile {
  name: string;
  surname: string;
  email: string;
  booksId: string[];
  schoolsId: string[];
}

export interface TUserState {
  library: Book[];
  profile: Profile;
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
  addBook: (book: Book) => void;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  loadProfile: () => Promise<void>;
  logout: () => void;
}

export type TUserStore = TUserState & TUserMutations & TUserAction;

const profileState = {
  library: [],

  profile: {
    name: '',
    surname: '',
    email: '',
    booksId: [],
    schoolsId: [],
  },

  uid: null,

  isAuthenticated: false, // aggiunto perché un uid potrebbe averlo anche uno studente
} satisfies TUserState;

const profileMutations = {
  setProfile: (profile): void => useUserStore.setState({ profile }),

  setLibrary: (library): void => useUserStore.setState({ library }),

  addBookToLibrary: (book: Book): void =>
    useUserStore.setState((state: TUserState) => ({ library: [...state.library, book] })),

  setUid: (uid: string) => {
    useUserStore.setState({ uid });
  },

  removeBookFromLibrary: (book: Book): void =>
    useUserStore.setState((state) => ({
      library: state.library.filter((b) => b.id !== book.id),
    })),

  setIsAuthenticated: (value) => useUserStore.setState({ isAuthenticated: value }),
} satisfies TUserMutations;

const profileAction = {
  login: async (email, password, remember) => {
    const { setIsAuthenticated, setUid } = useUserStore.getState();

    // fetch profile from db
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      const userId = user.user.uid;
      const token = await user.user.getIdToken();
      if (remember) {
        SecureStore.setItemAsync('token', token);
        SecureStore.setItemAsync('uid', userId);
      }
      setIsAuthenticated(true);
      setUid(userId);

      router.replace('/(drawer)/(tabs)');
    } catch (error) {
      console.log('Login error: ', error);
      setIsAuthenticated(false);
      Toast.show({
        type: 'error',
        text1: 'Authentication failed!',
        text2: 'Could not log you in. Please check your credentials or try again later!',
      });
    }
  },

  loadProfile: async () => {
    const { setProfile, uid } = useUserStore.getState();

    console.log('uid', uid);
    if (!uid) return;

    try {
      const docRef = doc(db, 'users', uid);
      // info sullo user
      const docSnap = await getDoc(docRef);
      const newProfile = docSnap.data() as Profile;
      console.log('dati utente: ', docSnap.data());

      // set stato utente
      setProfile(newProfile);
    } catch (error) {
      console.log('loginHelper error: ', error);
    }
  },

  logout: async () => {
    const { setIsAuthenticated, setUid, setProfile, setLibrary } = useUserStore.getState();
    try {
      await signOut(auth);
      // await SecureStore.deleteItemAsync('token');
      // await SecureStore.deleteItemAsync('uid');
      setIsAuthenticated(false);
      setProfile(profileState.profile);
      setLibrary([]);
      router.replace('/(drawer)/(tabs)');
    } catch (error) {
      console.log('Logout error: ', error);
    }
  },

  // addBookToLibrary: async (book: Book) => {
  //   const { uid } = useUserStore.getState();

  //   try {
  //     const newBookRef = await addDoc(collection(db, 'books'), {
  //       title: book.title,
  //       author: book.author,
  //       available: book.available,
  //       schoolId: book.schoolId,
  //       bibliotecarioId: uid,
  //     });
  //     book.id = newBookRef.id;

  //     const docRef = doc(db, 'users', uid!);
  //     await updateDoc(docRef, {
  //       library: arrayUnion(book.id),
  //     });
  //     useBookStore.setState((state) => ({ books: [...state.books, book] }));
  //     Toast.show({
  //       type: 'success',
  //       text1: 'Libro aggiunto con successo!',
  //       // text2: 'Could not log you in. Please check your credentials or try again later!',
  //     });

  //     console.log('libro aggiunto: ', book.title);
  //   } catch (error) {
  //     console.log('Add book to library error: ', error);
  //   }
  // },

  addBook: async (book: Book) => {
    // const { uid } = useUserStore.getState();
    // try {
    //   const newBookRef = await addDoc(collection(db, 'books'), {
    //     title: book.title,
    //     author: book.author,
    //     available: book.available,
    //     schoolId: book.schoolId,
    //     bibliotecarioId: uid,
    //   });
    //   book.id = newBookRef.id;
    //   const docRef = doc(db, 'users', uid!);
    //   await updateDoc(docRef, {
    //     library: arrayUnion(book.id),
    //   });
    //   useUserStore.setState((state) => ({ library: [...state.library, book] }));
    //   Toast.show({
    //     type: 'success',
    //     text1: 'Libro aggiunto con successo!',
    //     // text2: 'Could not log you in. Please check your credentials or try again later!',
    //   });
    //   console.log('libro aggiunto: ', book.title);
    // } catch (error) {
    //   console.log('Add book to library error: ', error);
    // }
  },
} satisfies TUserAction;

export const useUserStore = create<TUserStore>()(
  persist<TUserStore>(
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
