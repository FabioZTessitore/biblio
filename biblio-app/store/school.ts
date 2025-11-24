import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface School {
  id: string;
  name: string;
}

export interface TSchoolState {
  schools: School[];
}

export interface TSchoolMutations {}

export interface TSchoolAction {}

export type TSchoolStore = TSchoolState & TSchoolMutations & TSchoolAction;

const schoolState = <TSchoolState>{
  schools: [
    {
      id: '1234',
      name: 'Istituto Tecnicio Commerciale "G. Marconi"',
    },
  ],
};

const schoolMutations = <TSchoolMutations>{};

const schoolAction = <TSchoolAction>{};

export const useSchoolStore = create<TSchoolStore>()(
  persist(
    () => ({
      ...schoolState,
      ...schoolMutations,
      ...schoolAction,
    }),
    {
      name: 'schoolStore',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Non salviamo niente, ma rimaniamolo come scheletro
      }),
    }
  )
);
