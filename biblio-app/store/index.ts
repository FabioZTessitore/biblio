// import { db } from "@/firebaseConfig";
import { create } from 'zustand';

type DomainType = any;
type UserType = any;

export type AppState = {
  data: DomainType;
  history: DomainType[];
  loading: boolean;
  commit: (next: DomainType) => void;
  undo: () => void;
  signup: (user: UserType) => void;
  logout: () => void;
};

export type AppStore = AppState;

export const useAppStore = create<AppStore>()((set, get) => ({
  data: {},
  history: [],
  loading: false,

  commit: (next: DomainType) =>
    set((state: AppState) => ({
      data: next,
      history: [...state.history, state.data],
    })),

  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;

      const prev = state.history[state.history.length - 1];

      return {
        data: prev,
        history: state.history.slice(0, -1),
      };
    }),

  signup: (user: UserType) => {
    const { data, commit } = get();
    // const next = Todos.signup(data, user);
    // commit(next);
  },

  logout: () => {
    const { data, commit } = get();
    // const next = Todos.logout(data);
    // commit(next);
  },
}));
