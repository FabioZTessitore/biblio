import { router } from 'expo-router';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

interface Book {
  id: string;
  title: string;
  schoolId: string;
  author?: string;
  qty?: number | 1;
}

export interface TBookState {
  books: Book[];
}

export interface TBookMutations {}

export interface TBookAction {}

export type TBookStore = TBookState & TBookMutations & TBookAction;

const bookState = <TBookState>{
  books: [],
};

const bookMutations = <TBookMutations>{};

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
      // storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
