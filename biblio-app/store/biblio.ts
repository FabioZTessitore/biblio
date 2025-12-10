import { create } from 'zustand';
import {
  addDoc,
  collection,
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

export interface Loan {
  userId: string;
  bookId: string;
  schoolId: string;
  startDate: Timestamp;
  dueDate: Timestamp;
  returnedAt: Timestamp | null;
}

export interface Request {
  userId: string;
  bookId: string;
  schoolId: string;
  startDate: Timestamp;
  dueDate: Timestamp;
  returnedAt: Timestamp | null;
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
}

export interface TBiblioMutations {
  setBooks: (books: Book[]) => void;
  setLoans: (books: Loan[]) => void;
  setRequests: (books: Request[]) => void;

  setBookModal: (isOpen: boolean) => void;
}

export interface TBiblioAction {
  // General
  fetchBooks: () => Promise<void>;
  fetchLoans: (schoolId: string) => Promise<void>;
  fetchRequests: (schoolId: string) => Promise<void>;

  // User
  requestLoan: (bookId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;

  // Staff
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  addBook: (data: Partial<Book>) => Promise<void>;
  updateBook: (bookId: string, data: Book) => Promise<void>;
  markReturned: (loanId: string) => Promise<void>;
  createLoanFromRequest: (requestId: string) => Promise<void>;
}

export type TBiblioStore = TBiblioState & TBiblioMutations & TBiblioAction;

const biblioState = {
  books: [],
  loans: [],
  requests: [],

  bookModal: false,
} satisfies TBiblioState;

const biblioMutations = {
  setBooks: (books) => useBiblioStore.setState({ books }),
  setLoans: (loans) => useBiblioStore.setState({ loans }),
  setRequests: (requests) => useBiblioStore.setState({ requests }),

  setBookModal: (isOpen: boolean) => useBiblioStore.setState({ bookModal: isOpen }),
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
  fetchRequests: async (schoolId) => {},

  // User
  requestLoan: async (bookId) => {},
  cancelRequest: async (requestId) => {},

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
  // loadBooks: async () => {
  //   // const { uid, setUid } = useUserStore.getState();
  //   // const { setBooks } = useBookStore.getState();
  //   // if (uid === null) setUid('Vjv3oMJC6zUfW3B9hqOlwf9JCyo2');
  //   // const docRef = doc(db, 'users', uid!);
  //   // const docSnap = await getDoc(docRef);
  //   // const schoolsId = docSnap.data()?.schoolsId || [];
  //   // if (schoolsId.length === 0) {
  //   //   setBooks([]);
  //   //   return;
  //   // }
  //   // const q = query(collection(db, 'books'), where('schoolId', 'in', schoolsId));
  //   // const querySnapshot = await getDocs(q);
  //   // const newBooks: Book[] = [];
  //   // querySnapshot.forEach((doc) => {
  //   //   newBooks.push({
  //   //     id: doc.id,
  //   //     ...doc.data(),
  //   //   } as Book);
  //   // });
  //   // setBooks(newBooks);
  // },
  // saveBook: async () => {},
} satisfies TBiblioAction;

export const useBiblioStore = create<TBiblioStore>(() => ({
  ...biblioState,
  ...biblioMutations,
  ...biblioAction,
  /* Non utilizziamo il persist perché non vogliamo salvare
   * i libri nello store del dispositivo, se poi è necessario
   * ricaricarli (per averli aggiornati) ogni volta che l'app viene riaperta.
   */
}));
