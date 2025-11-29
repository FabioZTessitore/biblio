import { create } from 'zustand';
import { router } from 'expo-router';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Book } from './biblio';
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

interface User {
  uid: string;
  name: string;
  surname: string;
  email: string;
  role: 'user' | 'staff';
}

interface Membership {
  schoolId: string;
  role: 'user' | 'staff';
}

export interface TUserState {
  user: User;
  membership: Membership;
}

export interface TUserMutations {
  setUser: (user: User) => void;
  setMembership: (membership: Membership) => void;
}

export interface TUserAction {
  fetchUser: (uid: string) => Promise<void>;
  selectSchool: (schoolId: string) => Promise<void>;
  fetchMembership: (uid: string, schoolId: string) => Promise<void>;
}

// Immaginiamo un flow per ogni utente: 'user' e 'staff'

// user: welcome page --> login --> ha una membership come user in una scuola --> pagina home
// user: welcome page --> login --> ha una membership come user in più scuole --> scelta scuola --> pagina home
// user: welcome page --> login --> non ha una membership come user --> che succede?? perché quando ha creato una'account non ha avuto una scuola?
// user: welcome page --> registrazione --> che scuola deve mettere? e come la mette? e se si potesse scegliere la scuola liberamente o con un codice fornito dalla scuola, il rischio che un utente faccia richieste ad altre scuole per sabotare è alto.  Come un utente nuovo (ruolo 'user') si associa ad una scuola?

// staff: welcome page --> login (solo login perché le credenziali vengono date da noi admin) -> selezione scuola se sono più di una --> pagina iniziale

export type TUserStore = TUserState & TUserMutations & TUserAction;

const userState = {
  user: {
    uid: '',
    name: '',
    surname: '',
    email: '',
    role: 'user',
  },

  membership: {
    schoolId: '',
    role: 'user',
  },
} satisfies TUserState;

const userMutations = {
  setUser: (user) => useUserStore.setState({ user }),
  setMembership: (membership) => useUserStore.setState({ membership }),
} satisfies TUserMutations;

const userAction = {
  fetchMembership: async (uid, schoolId) => {},
  fetchUser: async (uid) => {},
  selectSchool: async (schoolId) => {},
} satisfies TUserAction;

export const useUserStore = create<TUserStore>()(
  persist<TUserStore>(
    () => ({
      ...userState,
      ...userMutations,
      ...userAction,
    }),
    {
      name: 'userStore',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
