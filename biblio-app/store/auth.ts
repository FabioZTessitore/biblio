import { create } from 'zustand';
import { db } from '~/lib/firebase';
import { useUserStore } from './user';
import { collection, doc, getDoc, query, Timestamp, updateDoc, where } from 'firebase/firestore';

export interface TAuthState {
  uid: string;
  email: string;
  isAuthenticated: boolean;
}

export interface TAuthMutations {
  setUid: (uid: string) => void;
  setEmail: (email: string) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export interface TAuthAction {
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export type TAuthStore = TAuthState & TAuthMutations & TAuthAction;

// Contiene solo quello che Firebase dà subito.
// questi dati devono essere utilizzati solo nell'ambito del login
const loanState = {
  uid: '',
  email: '',
  isAuthenticated: false,
} satisfies TAuthState;

const loanMutations = {
  setUid: (uid) => useAuthStore.setState({ uid }),
  setEmail: (email: string) => useAuthStore.setState({ email }),
  setIsAuthenticated: (value) => useAuthStore.setState({ isAuthenticated: value }),
} satisfies TAuthMutations;

const loanAction = {
  login: async () => {
    // Test, vabbuò ma nun s ver?
    const { setIsAuthenticated } = useAuthStore.getState();
    const { setMembership } = useUserStore.getState();
    setIsAuthenticated(true);

    setMembership({
      role: 'staff',
      schoolId: 'school_01',
    });
  },
  logout: async () => {
    // Test, par na pigliat p cul
    const { setIsAuthenticated } = useAuthStore.getState();
    const { setMembership } = useUserStore.getState();
    setIsAuthenticated(false);

    setMembership({
      role: 'user',
      schoolId: 'school_01',
    });
  },
} satisfies TAuthAction;

export const useAuthStore = create<TAuthStore>(() => ({
  ...loanState,
  ...loanMutations,
  ...loanAction,
}));
