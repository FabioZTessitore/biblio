import { router } from 'expo-router';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';

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
  schools: [],
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
      // storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
