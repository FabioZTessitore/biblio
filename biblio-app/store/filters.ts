import { router } from 'expo-router';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Book } from './book';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FilterItem {
  id: string;
  name: string;
  value: string;
  type: 'text' | 'select';
  options?: string[];
}

export interface FilterGroups {
  group: string;
  items: FilterItem[];
}

type Filters = FilterGroups[];

export interface TFiltersState {
  filters: Filters;
  filtersModal: boolean;
}

export interface TFiltersMutations {
  resetFilters: () => void;
  setFiltersModal: (isOpen: boolean) => void;
  updateFilterValue: (group: string, id: string, value: string) => void;
}

export interface TFiltersAction {
  openFiltersModal: () => void;
  applyFilters: (books: Book[], filters: Filters) => Book[];
}

export type TFiltersStore = TFiltersState & TFiltersMutations & TFiltersAction;

const filtersState = <TFiltersState>{
  filters: [
    {
      group: 'libro',
      items: [
        {
          id: 'title',
          name: 'Titolo',
          value: '',
          type: 'text',
        },
        {
          id: 'author',
          name: 'Autore',
          value: '',
          type: 'text',
        },
      ],
    },
    {
      group: 'altro',
      items: [
        {
          id: 'available',
          name: 'Disponibilità',
          value: 'Tutti',
          type: 'select',
          options: ['Tutti', 'Si', 'No'],
        },
      ],
    },
  ],

  filtersModal: false,
};

const filtersMutations = <TFiltersMutations>{
  resetFilters: () => useFiltersStore.setState(() => ({ ...filtersState })),

  setFiltersModal: (isOpen) => useFiltersStore.setState({ filtersModal: isOpen }),

  updateFilterValue: (group, id, value) =>
    useFiltersStore.setState((state) => {
      const newFilters = state.filters.map((section) => {
        if (section.group !== group) return section;

        return {
          ...section,
          items: section.items.map((f) => (f.id === id ? { ...f, value } : f)),
        };
      });

      return { filters: newFilters };
    }),
};

const filtersAction = <TFiltersAction>{
  openFiltersModal: () => {
    const { setFiltersModal } = useFiltersStore.getState();

    setFiltersModal(true);
  },

  applyFilters: (books, filters) => {
    let filtered = books;

    filters.forEach((group) => {
      group.items.forEach((filter) => {
        if (!filter.value || filter.value === '') return;

        switch (filter.id) {
          case 'title':
            filtered = filtered.filter((book) =>
              book.title.toLowerCase().includes(filter.value.toLowerCase())
            );
            break;

          case 'author':
            filtered = filtered.filter((book) =>
              book.author.toLowerCase().includes(filter.value.toLowerCase())
            );
            break;

          case 'available':
            if (filter.value === 'Tutti') return;
            if (filter.value === 'Si')
              filtered = filtered.filter((book) => book.available === true);
            if (filter.value === 'No')
              filtered = filtered.filter((book) => book.available === false);
            break;

          default:
            break;
        }
      });
    });

    return filtered;
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
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        filters: state.filters,
        // Salviamo in modo persistente solo filters.
      }),
    }
  )
);
