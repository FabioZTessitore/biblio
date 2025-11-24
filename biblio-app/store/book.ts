import { create } from 'zustand';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/lib/firebase';
import { useUserStore } from './user';

export interface Book {
  id: string;
  title: string;
  schoolId: string;
  author: string;
  qty?: number | 1;
  available: boolean;
  imageUrl?: string;
  bibliotecarioId: string;
}

export interface TBookState {
  books: Book[];
  bookModal: boolean;
}

export interface TBookMutations {
  setBooks: (books: Book[]) => void;
  setBookModal: (isOpen: boolean) => void;
}

export interface TBookAction {
  loadBooks: () => void;
  saveBook: () => void;
}

export type TBookStore = TBookState & TBookMutations & TBookAction;

const bookState = {
  books: [],
  bookModal: false,
} as TBookState;

const bookMutations = {
  setBooks: (books) => useBookStore.setState({ books }),

  setBookModal: (isOpen: boolean) => useBookStore.setState({ bookModal: isOpen }),
} as TBookMutations;

const bookAction = {
  loadBooks: async () => {
    const { uid, setUid } = useUserStore.getState();
    const { setBooks } = useBookStore.getState();

    if (uid === null) setUid('Vjv3oMJC6zUfW3B9hqOlwf9JCyo2');
    const docRef = doc(db, 'users', uid!);
    const docSnap = await getDoc(docRef);
    const schoolsId = docSnap.data()?.schoolsId || [];

    if (schoolsId.length === 0) {
      setBooks([]);
      return;
    }

    const q = query(collection(db, 'books'), where('schoolId', 'in', schoolsId));
    const querySnapshot = await getDocs(q);

    const newBooks: Book[] = [];

    querySnapshot.forEach((doc) => {
      newBooks.push({
        id: doc.id,
        ...doc.data(),
      } as Book);
    });

    setBooks(newBooks);
  },

  saveBook: async () => {},
} as TBookAction;

export const useBookStore = create<TBookStore>(() => ({
  ...bookState,
  ...bookMutations,
  ...bookAction,
  /* Non utilizziamo il persist perché non vogliamo salvare
   * i libri nello store del dispositivo, se poi è necessario
   * ricaricarli ogni volta che l'app viene riaperta.
   */
}));
