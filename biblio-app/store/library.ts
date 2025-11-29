import { create } from 'zustand';
import { db } from '~/lib/firebase';
import { collection, doc, getDoc, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { Book } from './biblio';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface TLibraryState {
  library: Book[];
}

export interface TLibraryMutations {
  setLibrary: (library: Book[]) => void;

  addToLibrary: (book: Book) => void;
  removeFromLibrary: (bookId: string) => void;
}

export interface TLibraryAction {
  clearLibrary: () => void;
}

export type TLibraryStore = TLibraryState & TLibraryMutations & TLibraryAction;

// ##########################################################################
// ###################              LO STATO              ###################
// ##########################################################################
const libraryState = {
  library: [],
} satisfies TLibraryState;

// ##########################################################################
// ###################  FUNZIONI CHE MODIFICANO LO STATO  ###################
// ##########################################################################
const libraryMutations = {
  setLibrary: (library): void => useLibraryStore.setState({ library }),

  addToLibrary: (book) =>
    useLibraryStore.setState((state: TLibraryState) => ({ library: [...state.library, book] })),

  removeFromLibrary: (bookId): void =>
    useLibraryStore.setState((state) => ({
      library: state.library.filter((b) => b.id !== bookId),
    })),
} satisfies TLibraryMutations;

// ##########################################################################
// ###################     AZIONI LOGICA + MUTATIONS     ####################
// ##########################################################################
const libraryAction = {
  clearLibrary: () => {
    const { setLibrary } = useLibraryStore.getState();

    Alert.alert('Attenzione!', 'Vuoi eliminare tutta la libreria?', [
      {
        text: 'Annulla',
        style: 'cancel',
        isPreferred: true,
      },
      {
        text: 'Sì',
        style: 'destructive',
        onPress: () => {
          setLibrary([]);
        },
      },
    ]);
  },
} satisfies TLibraryAction;

// ##########################################################################
// ###################      CREAZIONE STORE ZUSTAND      ####################
// ##########################################################################
export const useLibraryStore = create<TLibraryStore>()(
  persist<TLibraryStore>(
    () => ({
      ...libraryState,
      ...libraryMutations,
      ...libraryAction,
    }),
    {
      name: 'libraryStore',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
