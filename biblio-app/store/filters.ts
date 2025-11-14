import { router } from 'expo-router';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Filter {
  group: string;
  items: {
    id: string;
    name: string;
    value: string;
  }[];
}

export interface TFiltersState {
  filters: Filter[];
  filtersModal: boolean;
}

export interface TFiltersMutations {
  setFiltersModal: (isOpen: boolean) => void;
}

export interface TFiltersAction {
  openFiltersModal: () => void;
}

export type TFiltersStore = TFiltersState & TFiltersMutations & TFiltersAction;

const filtersState = <TFiltersState>{
  filters: [
    {
      group: 'libro',
      items: [
        { id: '1', name: 'Autore', value: 'Geronimo Stilton' },
        { id: '2', name: 'Titolo', value: 'Le avventure...' },
      ],
    },
    {
      group: 'altro',
      items: [{ id: '3', name: 'Disponibilità', value: 'Tutti' }],
    },
  ],
  filtersModal: false,
};

const filtersMutations = <TFiltersMutations>{
  setFiltersModal: (isOpen: boolean) => useFiltersStore.setState({ filtersModal: isOpen }),
};

const filtersAction = <TFiltersAction>{
  openFiltersModal: () => {
    const { setFiltersModal } = useFiltersStore.getState();

    setFiltersModal(true);
  },
};

export const useFiltersStore = create<TFiltersStore>()(
  persist(
    () => ({
      ...filtersState,
      ...filtersMutations,
      ...filtersAction,
    }),
    {
      name: 'filtersStore',
      // storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
