// filepath: src/store/authStore.ts
import {create} from 'zustand';

interface AuthState {
  user: any;
  setUser: (user: any) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));