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
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '~/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import Toast from 'react-native-toast-message';

export interface User {
  uid: string;
  name: string;
  surname: string;
  email: string;
  role: 'user' | 'staff' | 'admin';
  createdAt: Timestamp | null;
}

export interface Membership {
  schoolId: string;
  role: 'user' | 'staff';
  createdAt: Timestamp | null;
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
  fetchMembership: (uid: string, schoolId: string) => Promise<Membership | null>;
  createMembership: (uid: string, schoolId: string, role: Membership['role']) => Promise<void>;
  createUser: (
    uid: string,
    partial_user: { name: string; surname: string; role: string }
  ) => Promise<void>;

  clearUser: () => void;
  // fetchAllMemberships: (uid: string) => Promise<void>;
}

// Immaginiamo un flow per ogni utente: 'user' e 'staff'

// user: welcome page --> loginAnon --> uid --> ha una membership come user in una scuola --> pagina home
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
    createdAt: null,
  },

  membership: {
    schoolId: '',
    role: 'user',
    createdAt: null,
  },
} satisfies TUserState;

const userMutations = {
  setUser: (user) => useUserStore.setState({ user }),
  setMembership: (membership) => useUserStore.setState({ membership }),
} satisfies TUserMutations;

const userAction = {
  createMembership: async (uid, schoolId, role) => {
    const membershipId = `${uid}_${schoolId}`;
    const membershipRef = doc(db, 'memberships', membershipId);
    const snap = await getDoc(membershipRef);

    if (!snap.exists()) {
      await setDoc(membershipRef, {
        uid,
        schoolId,
        role,
        createdAt: serverTimestamp(),
      });
    }
  },

  fetchMembership: async (uid, schoolId) => {
    const ref = doc(db, 'memberships', `${uid}_${schoolId}`);
    const snap = await getDoc(ref);

    const membership = snap.exists() ? (snap.data() as Membership) : null;

    return membership;
  },

  createUser: async (uid, user) => {
    if (!user.name) return;

    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, <User>{
        name: user.name,
        surname: user.surname,
        role: 'user',
        createdAt: serverTimestamp(),
      });
    }
  },

  fetchUser: async (uid) => {},

  // fetchAllMemberships: async (uid: string) => {
  //   Recupera tutte le memberships di tutte le scuole
  // },

  selectSchool: async (schoolId) => {},

  clearUser: () => {
    const { user, setUser } = useUserStore.getInitialState();

    setUser(user);
  },
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
