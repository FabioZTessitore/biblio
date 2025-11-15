import { create } from 'zustand';

interface userStore {
  id: string;
  name: string;
  surname: string;
  email: string;
  schoolsId: string[];
  booksId: string[];
  updateUser: (id: string, name: string, surname: string, image: string, email: string) => void;
  addSchool: (newSchoolId: string) => void;
  addBook: (newBookId: string) => void;
}

export const useUserStore = create<userStore>()((set) => ({
  id: '',
  name: '',
  surname: '',
  image: '',
  email: '',
  schoolsId: [],
  booksId: [],
  updateUser: (id, name, surname, image, email) => set(() => ({ id, name, surname, image, email })),
  addSchool: (newSchoolId: string) =>
    set((state) => ({ schoolsId: [...state.schoolsId, newSchoolId] })),
  addBook: (newBookId: string) => set((state) => ({ booksId: [...state.booksId, newBookId] })),
}));
