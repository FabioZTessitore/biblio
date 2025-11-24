import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  books: [
    {
      id: '1',
      title: '1984',
      author: 'George Orwell',
      available: true,
      schoolId: 'tSkHlDpJXQBXLMQjlZMm',
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      available: true,
      schoolId: 'tSkHlDpJXQBXLMQjlZMm',
    },
    {
      id: '3',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      available: true,
      schoolId: 'tSkHlDpJXQBXLMQjlZMm',
    },
    {
      id: '4',
      title: 'Moby Dick',
      author: 'Herman Melville',
      available: true,
      schoolId: 'tSkHlDpJXQBXLMQjlZMm',
    },
    {
      id: '5',
      title: 'Fahrenheit 451',
      author: 'Ray Bradbury',
      available: true,
      schoolId: 'tSkHlDpJXQBXLMQjlZMm',
    },
    {
      id: '6',
      title: 'Brave New World',
      author: 'Aldous Huxley',
      available: true,
      schoolId: 'tSkHlDpJXQBXLMQjlZMm',
    },
  ],
} as TBookState;

const bookMutations = {
  setBooks: (books) => useBookStore.setState({ books }),

  setBookModal: (isOpen: boolean) => useBookStore.setState({ bookModal: isOpen }),
} as TBookMutations;

const bookAction = {
  loadBooks: async () => {
    const { uid } = useUserStore.getState();
    const { setBooks } = useBookStore.getState();

    const q = query(collection(db, 'books'), where('userId', '==', uid));
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
