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

  requestUsers: User[];

  bookModal: boolean;
  bookEditModal: boolean;

  isLoading: boolean;
}

export interface TBiblioMutations {
  setBooks: (books: Book[]) => void;
  setLoans: (loans: Loan[]) => void;
  setRequests: (requests: Request[]) => void;

  setRequestUsers: (requestUsers: User[]) => void;

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

  // User
  requestLoan: (loanId: string) => Promise<void>;
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

  requestUsers: [],

  bookModal: false,
  bookEditModal: false,

  isLoading: false,
} satisfies TBiblioState;

const biblioMutations = {
  setBooks: (books) => useBiblioStore.setState({ books }),
  setLoans: (loans) => useBiblioStore.setState({ loans }),
  setRequests: (requests) => useBiblioStore.setState({ requests }),

  setRequestUsers: (requestUsers) => useBiblioStore.setState({ requestUsers }),

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
  fetchLoans: async (schoolId) => {},
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

    // ID richiesti
    const requestedIds = [...new Set(requests.map((r) => r.userId))];

    // ID mancanti in cache
    const missingIds = requestedIds.filter((id) => !requestUsers[id as any]);
    if (!missingIds.length) return;

    // helper chunk
    const chunk = <T>(arr: T[], size: number) =>
      Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
      );

    const chunks = chunk(missingIds, 10);

    const snaps = await Promise.all(
      chunks.map((c) => getDocs(query(collection(db, 'users'), where(documentId(), 'in', c))))
    );

    const fetched: User[] = snaps.flatMap((snap) =>
      snap.docs.map((d) => ({
        uid: d.id,
        ...(d.data() as Omit<User, 'uid'>),
      }))
    );

    setRequestUsers(fetched);
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
  approveRequest: async (requestId: string) => {
    const { membership } = useUserStore.getState();
    const { requests, setRequests } = useBiblioStore.getState();

    if (membership.role !== 'staff') {
      Alert.alert('Attenzione!', 'Permessi insufficienti');
    }

    const requestRef = doc(db, 'requests', requestId);

    await runTransaction(db, async (tx) => {
      const requestSnap = await tx.get(requestRef);
      if (!requestSnap.exists()) {
        Alert.alert('Attenzione!', 'Request non trovata');
        return;
      }
      const request = requestSnap.data() as Request;

      if (request.status !== 'pending') {
        Alert.alert('Attenzione!', 'Request già processata');
        return;
      }

      const bookRef = doc(db, 'books', request.bookId);
      const bookSnap = await tx.get(bookRef);
      if (!bookSnap.exists()) {
        Alert.alert('Attenzione!', 'Libro non trovato');
        return;
      }
      const book = bookSnap.data() as Book;

      if (book.available <= 0) {
        Alert.alert('Attenzione!', 'Nessuna copia disponibile');
        return;
      }

      // 1) Approva la request
      tx.update(requestRef, {
        status: 'approved',
      });

      // 2) Decrementa copie libro
      tx.update(bookRef, {
        available: book.available - 1,
      });

      // 3) Crea il loan
      const loanRef = doc(collection(db, 'loans'));
      tx.set(loanRef, {
        userId: request.userId,
        bookId: request.bookId,
        schoolId: request.schoolId,
        startDate: serverTimestamp(),
        dueDate: null, // lo decidi dopo
        returnedAt: null,
      });

      // 4) Rimuovo dallo store
      setRequests(requests.filter((r) => r.id !== requestId));
    });
  },

  rejectRequest: async (requestId: string) => {
    const { membership } = useUserStore.getState();
    const { requests, setRequests } = useBiblioStore.getState();

    if (membership.role !== 'staff') {
      throw new Error('Permessi insufficienti');
    }

    const requestRef = doc(db, 'requests', requestId);

    await updateDoc(requestRef, {
      status: 'rejected',
    });

    setRequests(requests.filter((r) => r.id !== requestId));
  },

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
