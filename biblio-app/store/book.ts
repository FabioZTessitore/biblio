import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Book {
  id: string;
  title: string;
  schoolId: string;
  author?: string;
  qty?: number | 1;
}

export interface TBookState {
  books: Book[];
}

export interface TBookMutations {
  setBooks: (books: Book[]) => void;
}

export interface TBookAction {}

export type TBookStore = TBookState & TBookMutations & TBookAction;

const bookState = <TBookState>{
  books: [
    { id: '1', title: '1984', author: 'George Orwell' },
    { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: '3', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { id: '4', title: 'Moby Dick', author: 'Herman Melville' },
    { id: '5', title: 'Fahrenheit 451', author: 'Ray Bradbury' },
    { id: '6', title: 'Brave New World', author: 'Aldous Huxley' },
  ],
};

const bookMutations = <TBookMutations>{
  setBooks: (books) => useBookStore.setState({ books }),
};

const bookAction = <TBookAction>{};

export const useBookStore = create<TBookStore>()(
  persist(
    () => ({
      ...bookState,
      ...bookMutations,
      ...bookAction,
    }),
    {
      name: 'bookStore',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
