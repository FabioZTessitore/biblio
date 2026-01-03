import { create } from 'zustand';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  Unsubscribe,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '~/lib/firebase';
import { User, useUserStore } from './user';
import { useLibraryStore } from './library';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { fetchUsersByIds } from '~/lib/utils';

export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  schoolId: string;
  startDate: Timestamp;
  dueDate: Timestamp | null;
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

  requestUsers: Record<string, User>;
  loanUsers: Record<string, User>;

  bookModal: boolean;
  bookEditModal: boolean;

  isLoading: boolean;
}

export interface TBiblioMutations {
  setBooks: (books: Book[]) => void;
  setLoans: (loans: Loan[]) => void;
  setRequests: (requests: Request[]) => void;

  setRequestUsers: (requestUsers: Record<string, User>) => void;
  setLoanUsers: (loanUsers: Record<string, User>) => void;

  setBookModal: (isOpen: boolean) => void;
  setBookEditModal: (isOpen: boolean) => void;

  setIsLoading: (isLoading: boolean) => void;
}

export interface TBiblioAction {
  // General
  subscribeBooks: () => Unsubscribe;
  subscribeLoans: () => Unsubscribe;
  subscribeRequests: () => Unsubscribe;

  fetchRequestUsers: () => Promise<void>;
  fetchLoanUsers: () => Promise<void>;

  // User
  requestLoan: (loanId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;

  // Staff
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  addBook: (data: Partial<Book>) => Promise<void>;
  updateBook: (bookId: string, data: Partial<Book>) => Promise<void>;
  updateLoan: (loanId: string, data: Partial<Loan>) => Promise<void>;
  markReturned: (loanId: string) => Promise<void>;
}

export type TBiblioStore = TBiblioState & TBiblioMutations & TBiblioAction;

const biblioState = {
  books: [],
  loans: [],
  requests: [],

  requestUsers: {},
  loanUsers: {},

  bookModal: false,
  bookEditModal: false,

  isLoading: false,
} satisfies TBiblioState;

const biblioMutations = {
  setBooks: (books) => useBiblioStore.setState({ books }),
  setLoans: (loans) => useBiblioStore.setState({ loans }),
  setRequests: (requests) => useBiblioStore.setState({ requests }),

  setRequestUsers: (requestUsers) => useBiblioStore.setState({ requestUsers }),
  setLoanUsers: (loanUsers) => useBiblioStore.setState({ loanUsers }),

  setBookModal: (isOpen) => useBiblioStore.setState({ bookModal: isOpen }),
  setBookEditModal: (isOpen) => useBiblioStore.setState({ bookEditModal: isOpen }),

  setIsLoading: (isLoading) => useBiblioStore.setState({ isLoading }),
} satisfies TBiblioMutations;

const biblioAction = {
  // General
  subscribeBooks: () => {
    const { setBooks, setIsLoading } = useBiblioStore.getState();
    const { setLibrary } = useLibraryStore.getState();
    const { membership } = useUserStore.getState();

    if (!membership?.schoolId) return () => {};

    setIsLoading(true);

    const q = query(collection(db, 'books'), where('schoolId', '==', membership.schoolId));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const books: Book[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Book, 'id'>),
        }));

        setBooks(books);

        const { library } = useLibraryStore.getState();
        const updatedLibrary = library
          .map((lb) => books.find((b) => b.id === lb.id))
          .filter(Boolean) as Book[];

        setLibrary(updatedLibrary);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        Alert.alert('Errore', 'Errore realtime libri');
      }
    );

    return unsub;
  },
  subscribeLoans: () => {
    const { setLoans, setIsLoading } = useBiblioStore.getState();
    const { membership } = useUserStore.getState();

    if (!membership?.schoolId) return () => {};

    setIsLoading(true);

    const q = query(collection(db, 'loans'), where('schoolId', '==', membership.schoolId));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const loans: Loan[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Loan, 'id'>),
        }));

        setLoans(loans);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        Alert.alert('Errore', 'Errore realtime prestiti');
      }
    );

    return unsub;
  },
  subscribeRequests: () => {
    const { setRequests, setIsLoading } = useBiblioStore.getState();
    const { membership, user } = useUserStore.getState();

    if (!membership?.schoolId) return () => {};

    setIsLoading(true);

    const filters = [where('schoolId', '==', membership.schoolId)];

    if (membership.role === 'user') {
      filters.push(where('userId', '==', user.uid));
    }

    if (membership.role === 'staff') {
      filters.push(where('status', '==', 'pending'));
    }

    const q = query(collection(db, 'requests'), ...filters);

    const unsub = onSnapshot(
      q,
      (snap) => {
        const requests: Request[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Request, 'id'>),
        }));

        setRequests(requests);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
        Alert.alert('Errore', 'Errore realtime richieste');
      }
    );

    return unsub;
  },

  fetchRequestUsers: async () => {
    const { requests, requestUsers, setRequestUsers } = useBiblioStore.getState();

    const ids = [...new Set(requests.map((r) => r.userId))];
    const missing = ids.filter((id) => !requestUsers[id]);

    if (!missing.length) return;

    const users = await fetchUsersByIds(missing);

    const map = { ...requestUsers };
    users.forEach((u) => {
      map[u.uid] = u;
    });

    setRequestUsers(map);
  },

  fetchLoanUsers: async () => {
    const { loans, loanUsers, setLoanUsers } = useBiblioStore.getState();

    const ids = [...new Set(loans.map((l) => l.userId))];
    const missing = ids.filter((id) => !loanUsers[id as any]);

    if (!missing.length) return;

    const users = await fetchUsersByIds(missing);

    const map = { ...loanUsers };
    users.forEach((u) => {
      map[u.uid as any] = u;
    });

    setLoanUsers(map);
  },

  // User
  requestLoan: async (bookId) => {
    const { membership, user } = useUserStore.getState();
    const { setIsLoading, requests, setRequests } = useBiblioStore.getState();
    const { removeFromLibrary } = useLibraryStore.getState();

    setIsLoading(true);
    try {
      if (!membership.schoolId) throw new Error('No school selected');

      const ref = await addDoc(collection(db, 'requests'), {
        userId: user.uid,
        bookId,
        schoolId: membership.schoolId,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // aggiorno store SENZA refetch
      setRequests([
        ...requests,
        {
          id: ref.id,
          userId: user.uid,
          bookId,
          schoolId: membership.schoolId,
          status: 'pending',
          createdAt: Timestamp.now(),
        },
      ]);

      removeFromLibrary(bookId);
    } catch {
      console.log('Errore durante la richiesta di prestito');
    } finally {
      setIsLoading(false);
    }
  },
  cancelRequest: async (requestId) => {
    const { membership } = useUserStore.getState();
    const { requests, setRequests, setIsLoading } = useBiblioStore.getState();

    setIsLoading(true);
    if (!membership.schoolId) {
      setIsLoading(false);
      throw new Error('No school selected');
    }

    const backup = requests.map((r) => ({ ...r }));

    // optimistic
    setRequests(requests.filter((r) => r.id !== requestId));

    try {
      await deleteDoc(doc(db, 'requests', requestId));
    } catch {
      setRequests(backup);
      console.log('Errore durante la cancellazione');
    } finally {
      setIsLoading(false);
    }
  },

  // Staff
  approveRequest: async (requestId: string) => {
    const { membership } = useUserStore.getState();

    if (membership.role !== 'staff') {
      Alert.alert('Attenzione!', 'Permessi insufficienti');
      return;
    }

    try {
      await runTransaction(db, async (tx) => {
        const requestRef = doc(db, 'requests', requestId);
        const requestSnap = await tx.get(requestRef);
        if (!requestSnap.exists()) throw new Error('Request non trovata');

        const request = requestSnap.data() as Request;

        const bookRef = doc(db, 'books', request.bookId);
        const bookSnap = await tx.get(bookRef);
        if (!bookSnap.exists()) throw new Error('Libro non trovato');

        const book = bookSnap.data() as Book;
        if (book.available <= 0) throw new Error('Nessuna copia disponibile');

        const loanRef = doc(collection(db, 'loans'));

        // Aggiornamenti Firestore
        tx.update(requestRef, { status: 'approved' });
        tx.update(bookRef, { available: book.available - 1 });
        tx.set(loanRef, {
          userId: request.userId,
          bookId: request.bookId,
          schoolId: request.schoolId,
          startDate: serverTimestamp(),
          dueDate: null,
          returnedAt: null,
        });
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Errore', 'Operazione non completata');
    }
  },
  rejectRequest: async (requestId: string) => {
    const { membership } = useUserStore.getState();
    const { requests, setRequests } = useBiblioStore.getState();

    if (membership.role !== 'staff') {
      throw new Error('Permessi insufficienti');
    }

    const backup = requests.map((r) => ({ ...r }));

    // optimistic
    setRequests(requests.filter((r) => r.id !== requestId));

    try {
      await updateDoc(doc(db, 'requests', requestId), {
        status: 'rejected',
      });
    } catch (err) {
      // rollback
      setRequests(backup);
      throw err;
    }
  },

  addBook: async (data) => {
    const { membership } = useUserStore.getState();
    const { setBooks, books } = useBiblioStore.getState();

    if (membership.role !== 'staff') throw new Error('Not allowed');

    const ref = await addDoc(collection(db, 'books'), {
      ...data,
      schoolId: membership.schoolId,
    });

    // optimistic post-write
    setBooks([...books, { id: ref.id, ...data, schoolId: membership.schoolId } as Book]);
  },

  updateBook: async (bookId, data) => {
    const { membership } = useUserStore.getState();
    const { books, setBooks } = useBiblioStore.getState();

    if (membership.role !== 'staff') throw new Error('Not allowed');

    const backup = books.map((b) => ({ ...b }));

    // optimistic
    setBooks(books.map((b) => (b.id === bookId ? { ...b, ...data } : b)));

    try {
      await updateDoc(doc(db, 'books', bookId), data);
    } catch (err) {
      setBooks(backup);
      throw err;
    }
  },

  updateLoan: async (loanId, data) => {
    const { membership } = useUserStore.getState();
    const { loans, setLoans } = useBiblioStore.getState();

    if (membership.role !== 'staff') throw new Error('Not allowed');

    const backup = loans.map((l) => ({ ...l }));

    // optimistic
    setLoans(loans.map((l) => (l.id === loanId ? { ...l, ...data } : l)));

    try {
      await updateDoc(doc(db, 'loans', loanId), data);
    } catch (err) {
      setLoans(backup);
      throw err;
    }
  },
  markReturned: async (loanId: string) => {
    const { membership } = useUserStore.getState();
    const { loans, setLoans } = useBiblioStore.getState();

    if (membership.role !== 'staff') {
      throw new Error('Not allowed');
    }

    const returnedAt = Timestamp.now();

    // Inizio a impostare lo store

    const loansBackup = loans.map((l) => ({ ...l }));

    setLoans(loans.map((l) => (l.id === loanId ? { ...l, returnedAt } : l)));

    try {
      const loanRef = doc(db, 'loans', loanId);
      const snap = await getDoc(loanRef);
      const data = snap.data();
      if (!data) throw new Error('Loan not found');

      await Promise.all([
        updateDoc(loanRef, {
          returnedAt: serverTimestamp(),
        }),
        updateDoc(doc(db, 'books', data.bookId), {
          available: increment(1),
        }),
      ]);
    } catch (err) {
      // nel caso imposto tutto come prima

      setLoans(loansBackup);
      throw err;
    }
  },
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
