import { create } from 'zustand';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '~/lib/firebase';
import { useUserStore } from './user';
import { useAuthStore } from './auth';
import { useLibraryStore } from './library';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  schoolId: string;
  startDate: Timestamp;
  dueDate: Timestamp;
  returnedAt: Timestamp | null;
}

export interface Request {
  id: string;
  userId: string;
  bookId: string;
  schoolId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp | null;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  schoolId: string;
  available: number;

  // Solo se:
  //  - ISBN non esiste su OpenLibrary
  //  - Scuola ci manda la copertina scansionata
  // Allora aggiungiamo questo:
  //  customImageUrl?: string; //  carichiamo su Firebase Storage
}

export interface TBiblioState {
  books: Book[];
  loans: Loan[];
  requests: Request[];

  bookModal: boolean;
  bookEditModal: boolean;

  isLoading: boolean;
}

export interface TBiblioMutations {
  setBooks: (books: Book[]) => void;
  setLoans: (books: Loan[]) => void;
  setRequests: (books: Request[]) => void;

  setBookModal: (isOpen: boolean) => void;
  setBookEditModal: (isOpen: boolean) => void;

  setIsLoading: (isLoading: boolean) => void;
}

export interface TBiblioAction {
  // General
  fetchBooks: () => Promise<void>;
  fetchLoans: (schoolId: string) => Promise<void>;
  fetchRequests: () => Promise<void>;

  // User
  requestLoan: (bookId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;

  // Staff
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  addBook: (data: Partial<Book>) => Promise<void>;
  updateBook: (bookId: string, data: Partial<Book>) => Promise<void>;
  markReturned: (loanId: string) => Promise<void>;
  createLoanFromRequest: (requestId: string) => Promise<void>;
}

export type TBiblioStore = TBiblioState & TBiblioMutations & TBiblioAction;

const biblioState = {
  books: [],
  loans: [],
  requests: [],

  bookModal: false,
  bookEditModal: false,

  isLoading: false,
} satisfies TBiblioState;

const biblioMutations = {
  setBooks: (books) => useBiblioStore.setState({ books }),
  setLoans: (loans) => useBiblioStore.setState({ loans }),
  setRequests: (requests) => useBiblioStore.setState({ requests }),

  setBookModal: (isOpen: boolean) => useBiblioStore.setState({ bookModal: isOpen }),
  setBookEditModal: (isOpen: boolean) => useBiblioStore.setState({ bookEditModal: isOpen }),

  setIsLoading: (isLoading) => useAuthStore.setState({ isLoading }),
} satisfies TBiblioMutations;

const biblioAction = {
  // General
  fetchBooks: async () => {
    const { setBooks } = useBiblioStore.getState();
    const { membership } = useUserStore.getState();

    // if (!membership?.schoolId) return setBooks([]);

    const q = query(collection(db, 'books'), where('schoolId', '==', membership.schoolId));

    const snap = await getDocs(q);
    const books: Book[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Book, 'id'>),
    }));

    setBooks(books);
  },
  fetchLoans: async (schoolId) => {},
  fetchRequests: async () => {
    const { setRequests } = useBiblioStore.getState();
    const { membership, user } = useUserStore.getState();

    // if (!membership?.schoolId) return setBooks([]);

    const q = query(
      collection(db, 'requests'),
      where('schoolId', '==', membership.schoolId),
      where('userId', '==', user.uid)
    );

    const snap = await getDocs(q);
    const requests: Request[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Request, 'id'>),
    }));

    console.log('Richieste caricate', requests);
    setRequests(requests);
  },

  // User
  requestLoan: async (bookId) => {
    const { membership, user } = useUserStore.getState();
    const { setIsLoading, fetchRequests } = useBiblioStore.getState();
    const { removeFromLibrary } = useLibraryStore.getState();

    setIsLoading(true);
    try {
      if (!membership.schoolId) throw new Error('No school selected');

      await addDoc(collection(db, 'requests'), {
        userId: user.uid,
        bookId,
        schoolId: membership.schoolId,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      await fetchRequests();

      removeFromLibrary(bookId);
    } catch {
      console.log('Errore durante la richiesta di prestito');
    } finally {
      setIsLoading(false);
    }
  },
  cancelRequest: async (requestId) => {
    const { membership, user } = useUserStore.getState();
    const { setIsLoading, fetchRequests } = useBiblioStore.getState();

    setIsLoading(true);
    try {
      if (!membership.schoolId) throw new Error('No school selected');

      await deleteDoc(doc(db, 'requests', requestId));

      await fetchRequests();
      console.log('Eliminata');
    } catch {
      console.log('Errore durante la richiesta di prestito');
    } finally {
      setIsLoading(false);
    }
  },

  // Staff
  approveRequest: async (requestId) => {},
  rejectRequest: async (requestId) => {},

  addBook: async (data) => {
    const { membership } = useUserStore.getState();
    const { fetchBooks } = useBiblioStore.getState();

    if (membership.role !== 'staff') throw new Error('Not allowed');

    await addDoc(collection(db, 'books'), <Book>{
      ...data,
      schoolId: membership.schoolId,
    });

    await fetchBooks();
  },
  updateBook: async (bookId, data) => {
    const { membership } = useUserStore.getState();
    const { fetchBooks } = useBiblioStore.getState();

    if (membership.role !== 'staff') throw new Error('Not allowed');

    await updateDoc(doc(db, 'books', bookId), {
      id: bookId,
      ...data,
    });

    await fetchBooks();
  },

  markReturned: async (loanId) => {
    // Lo staff segna un prestito come restituito
    const { membership } = useUserStore.getState();
    if (membership.role !== 'staff') throw new Error('Not allowed');

    const loanRef = doc(db, 'loans', loanId);
    const snap = await getDoc(loanRef);
    const data = snap.data();
    if (!data) throw new Error('Loan not found');

    // Aggiorna la data del prestito
    await updateDoc(loanRef, {
      returnedAt: serverTimestamp(),
    });

    // Aumenta available
    await updateDoc(doc(db, 'books', data.bookId), {
      available: increment(1),
    });
  },
  createLoanFromRequest: async (requestId) => {},
} satisfies TBiblioAction;

export const useBiblioStore = create<TBiblioStore>()(
  persist(
    () =>
      <TBiblioStore>{
        ...biblioState,
        ...biblioMutations,
        ...biblioAction,
      },
    {
      name: 'biblioStore',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        requests: state.requests,
        books: state.books,
      }),
    }
  )
);
