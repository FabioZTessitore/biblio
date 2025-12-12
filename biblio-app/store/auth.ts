import { create } from 'zustand';
import { auth, db } from '~/lib/firebase';
import { Membership, User, useUserStore } from './user';
import { collection, doc, getDoc, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { signInAnonymously, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { SCHOOL_ID as schoolId } from '~/lib/utils';

export interface TAuthState {
  uid: string;
  email: string;
  isLoading: boolean;
  error: string;
}

export interface TAuthMutations {
  setUid: (uid: string) => void;
  setEmail: (email: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
}

export interface TAuthAction {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAnonymously: (name: string, surname: string) => Promise<void>;
}

export type TAuthStore = TAuthState & TAuthMutations & TAuthAction;

// Contiene solo quello che Firebase dà subito.
// questi dati devono essere utilizzati solo nell'ambito del login
const authState = {
  uid: '',
  email: '',
  isLoading: false,
  error: '',
} satisfies TAuthState;

const authMutations = {
  setUid: (uid) => useAuthStore.setState({ uid }),
  setEmail: (email: string) => useAuthStore.setState({ email }),
  setIsLoading: (isLoading) => useAuthStore.setState({ isLoading }),
  setError: (error) => useAuthStore.setState({ error }),
} satisfies TAuthMutations;

const authAction = {
  login: async (email, password) => {
    const { setMembership, fetchMembership, fetchUser, setUser } = useUserStore.getState();
    const { setIsLoading, setError } = useAuthStore.getState();

    setIsLoading(true);
    setError('');

    try {
      const {
        user: { uid },
      } = await signInWithEmailAndPassword(auth, email, password);

      const user: Omit<User, 'uid'> | null = await fetchUser(uid);

      if (!user) {
        console.log('Errore: membership non trovata', user);
        throw Error;
      }

      const membership = await fetchMembership(uid, schoolId);

      if (!membership) {
        console.log('Errore: membership non trovata', membership);
        throw Error;
      }

      console.log('Membership Trovata:', membership);

      setUser({
        ...user,
        uid,
      });
      setMembership(membership);
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        setError("Inserisci un'email valida");
      } else if (error.code === 'auth/invalid-credential') {
        setError('Email o password non corretti');
      } else {
        setError(error.code || 'Si è verificato un errore durante il login.');
      }
    } finally {
      setIsLoading(false);
    }
  },

  logout: async () => {
    const { setError } = useAuthStore.getState();
    const { setMembership } = useUserStore.getState();

    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message || 'Si è verificato un errore durante il logout.');
    }

    setMembership({
      role: 'user',
      schoolId: '',
      createdAt: null,
    });
  },

  loginAnonymously: async (name, surname) => {
    const { setUser, setMembership, createMembership, createUser } = useUserStore.getState();
    const { setIsLoading, setError } = useAuthStore.getState();

    try {
      setIsLoading(true);

      const { user: authUser } = await signInAnonymously(auth);
      const uid = authUser.uid;

      const userData = {
        uid,
        name,
        surname,
        email: '',
        role: 'user',
        createdAt: Timestamp.now(),
      } satisfies User;

      const membershipData = {
        role: 'user',
        schoolId,
        createdAt: Timestamp.now(),
      } satisfies Membership;

      // DB
      await createUser(uid, userData);
      await createMembership(uid, schoolId, 'user');

      // Store
      setUser(userData);
      setMembership(membershipData);
    } catch (error: any) {
      setError(error.message || 'Si è verificato un errore durante il login.');
    } finally {
      setIsLoading(false);
    }
  },
} satisfies TAuthAction;

export const useAuthStore = create<TAuthStore>(() => ({
  ...authState,
  ...authMutations,
  ...authAction,
}));
