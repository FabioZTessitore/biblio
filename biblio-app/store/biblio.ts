import { create } from 'zustand';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  increment,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '~/lib/firebase';
import { User, useUserStore } from './user';
import { useLibraryStore } from './library';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { fetchByIds } from '~/lib/utils';

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

  requestUsers: User[];
  loanUsers: User[];

  bookModal: boolean;
  bookEditModal: boolean;

  isLoading: boolean;
}

export interface TBiblioMutations {
  setBooks: (books: Book[]) => void;
  setLoans: (loans: Loan[]) => void;
  setRequests: (requests: Request[]) => void;

  setRequestUsers: (requestUsers: User[]) => void;
  setLoanUsers: (loanUsers: User[]) => void;

  setBookModal: (isOpen: boolean) => void;
  setBookEditModal: (isOpen: boolean) => void;

  setIsLoading: (isLoading: boolean) => void;
}

export interface TBiblioAction {
  // General
  fetchBooks: () => Promise<void>;
  fetchLoans: () => Promise<void>;
  fetchRequests: () => Promise<void>;

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

  requestUsers: [],
  loanUsers: [],

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
  fetchBooks: async () => {
    const { setBooks, setIsLoading } = useBiblioStore.getState();
    const { setLibrary, library } = useLibraryStore.getState();
    const { membership } = useUserStore.getState();

    try {
      setIsLoading(true);

      // if (!membership?.schoolId) return setBooks([]);

      const q = query(collection(db, 'books'), where('schoolId', '==', membership.schoolId));

      const snap = await getDocs(q);
      const books: Book[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Book, 'id'>),
      }));

      setBooks(books);

      const updatedLibrary = library
        .map((libBook) => books.find((b) => b.id === libBook.id)) // trova il libro aggiornato
        .filter(Boolean) as Book[]; // rimuove eventuali null (libro cancellato)

      setLibrary(updatedLibrary);
    } catch {
      Alert.alert('Errore', 'Errore durante il recupero dei libri');
    } finally {
      setIsLoading(false);
    }
  },
  fetchLoans: async () => {
    const { setLoans, setIsLoading } = useBiblioStore.getState();
    const { membership, user } = useUserStore.getState();

    try {
      setIsLoading(true);

      const q = query(collection(db, 'loans'), where('schoolId', '==', membership.schoolId));

      const snap = await getDocs(q);
      const loans: Loan[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Loan, 'id'>),
      }));

      setLoans(loans);
    } catch {
      Alert.alert('Errore', 'Errore durante il recupero dei prestiti');
    } finally {
      setIsLoading(false);
    }
  },
  fetchRequests: async () => {
    const { setRequests, setIsLoading } = useBiblioStore.getState();
    const { membership, user } = useUserStore.getState();

    try {
      setIsLoading(true);

      const baseQuery = [where('schoolId', '==', membership.schoolId)];

      // Solo gli utenti normali filtrano per userId
      if (membership.role === 'user') {
        baseQuery.push(where('userId', '==', user.uid));
      }
      if (membership.role === 'staff') {
        // Lo staff vede solo richieste in attesa
        baseQuery.push(where('status', '==', 'pending'));
      }

      const q = query(collection(db, 'requests'), ...baseQuery);

      const snap = await getDocs(q);
      const requests: Request[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Request, 'id'>),
      }));

      setRequests(requests);
    } catch (err) {
      console.log('Errore', err);
      Alert.alert('Errore', 'Errore durante il recupero delle richieste');
    } finally {
      setIsLoading(false);
    }
  },

  fetchRequestUsers: async () => {
    const { requests, requestUsers, setRequestUsers } = useBiblioStore.getState();

    if (!requests.length) return;

    const ids = requests.map((r) => r.userId);

    const missing = ids.filter((id) => !requestUsers.some((u) => u.uid === id));
    if (!missing.length) return;

    const fetched = await fetchByIds<User>('users', missing, (id, data) => ({
      uid: id,
      ...(data as Omit<User, 'uid'>),
    }));

    setRequestUsers([...requestUsers, ...fetched]);
  },
  fetchLoanUsers: async () => {
    const { loans, loanUsers, setLoanUsers } = useBiblioStore.getState();

    if (!loans.length) return;

    const ids = loans.map((l) => l.userId);

    const missing = ids.filter((id) => !loanUsers.some((u) => u.uid === id));
    if (!missing.length) return;

    const fetched = await fetchByIds<User>('users', missing, (id, data) => ({
      uid: id,
      ...(data as Omit<User, 'uid'>),
    }));

    setLoanUsers([...loanUsers, ...fetched]);
    console.log('settati\n\n');
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
    const { requests, loans, setRequests, setLoans } = useBiblioStore.getState();

    if (membership.role !== 'staff') {
      Alert.alert('Attenzione!', 'Permessi insufficienti');
      return;
    }

    // backup
    const requestsBackup = requests.map((r) => ({ ...r }));
    const loansBackup = loans.map((l) => ({ ...l }));

    let newLoan: Loan | null = null;
    let removedRequest: Request | null = null;

    try {
      setRequests(requests.filter((r) => r.id !== requestId));

      await runTransaction(db, async (tx) => {
        const requestRef = doc(db, 'requests', requestId);
        const requestSnap = await tx.get(requestRef);
        if (!requestSnap.exists()) throw new Error('Request non trovata');

        const request = requestSnap.data() as Request;
        removedRequest = { id: requestId, ...(request as Omit<Request, 'id'>) };

        const bookRef = doc(db, 'books', request.bookId);
        const bookSnap = await tx.get(bookRef);
        if (!bookSnap.exists()) throw new Error('Libro non trovato');

        const book = bookSnap.data() as Book;
        if (book.available <= 0) throw new Error('Nessuna copia');

        const loanRef = doc(collection(db, 'loans'));

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

        newLoan = {
          id: loanRef.id,
          userId: request.userId,
          bookId: request.bookId,
          schoolId: request.schoolId,
          startDate: Timestamp.now(),
          dueDate: null,
          returnedAt: null,
        };
      });

      if (newLoan) {
        setLoans([...loans, newLoan]);
      }
    } catch (err) {
      // rollback sicuro
      setRequests(requestsBackup);
      setLoans(loansBackup);
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
