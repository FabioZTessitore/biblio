import { create } from 'zustand';
import { auth, db } from '~/lib/firebase';
import { Membership, User, useUserStore } from './user';
import { collection, doc, getDoc, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { signInAnonymously, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { SCHOOL_ID as schoolId } from '~/lib/utils';

export interface TAuthState {
  uid: string;
  email: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
}

export interface TAuthMutations {
  setUid: (uid: string) => void;
  setEmail: (email: string) => void;
  setIsAuthenticated: (value: boolean) => void;
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
  isAuthenticated: false,
  isLoading: false,
  error: '',
} satisfies TAuthState;

const authMutations = {
  setUid: (uid) => useAuthStore.setState({ uid }),
  setEmail: (email: string) => useAuthStore.setState({ email }),
  setIsAuthenticated: (value) => useAuthStore.setState({ isAuthenticated: value }),
  setIsLoading: (isLoading) => useAuthStore.setState({ isLoading }),
  setError: (error) => useAuthStore.setState({ error }),
} satisfies TAuthMutations;

const authAction = {
  login: async (email, password) => {
    const { setMembership, fetchMembership } = useUserStore.getState();
    const { setIsLoading, setError, setIsAuthenticated } = useAuthStore.getState();

    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const membership = await fetchMembership(uid, schoolId);

      if (!membership) {
        console.log('Errore: membership non trovata', membership);
        throw Error;
      }

      console.log('Membership Trovata:', membership);

      setMembership(membership);
      setIsAuthenticated(true);
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        setError('Email non corretta');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Password non corretta');
      } else {
        setError(error.code || 'Errore durante il login.');
      }
    } finally {
      setIsLoading(false);
    }
  },

  logout: async () => {
    const { setIsAuthenticated, setError } = useAuthStore.getState();
    const { setMembership } = useUserStore.getState();

    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message || 'Errore durante il logout.');
    }

    setIsAuthenticated(false);
    setMembership({
      role: 'user',
      schoolId: '',
      createdAt: null,
    });
  },

  loginAnonymously: async (name, surname) => {
    const { setUser, setMembership, createMembership, createUser } = useUserStore.getState();
    const { setIsLoading, setError, setIsAuthenticated } = useAuthStore.getState();

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
      setIsAuthenticated(true);
    } catch (error: any) {
      setError(error.message || 'Errore durante il login.');
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
