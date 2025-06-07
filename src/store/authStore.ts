// filepath: src/store/authStore.ts
import {create} from 'zustand';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  // Phone auth state
  isOtpSent: boolean;
  setOtpSent: (sent: boolean) => void;
  otpPhone: string | null;
  setOtpPhone: (phone: string | null) => void;
  // Loading states
  isSendingOtp: boolean;
  setSendingOtp: (loading: boolean) => void;
  isVerifyingOtp: boolean;
  setVerifyingOtp: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ 
    user: null, 
    isOtpSent: false, 
    otpPhone: null, 
    isSendingOtp: false, 
    isVerifyingOtp: false 
  }),
  // Phone auth state
  isOtpSent: false,
  setOtpSent: (sent) => set({ isOtpSent: sent }),
  otpPhone: null,
  setOtpPhone: (phone) => set({ otpPhone: phone }),
  // Loading states
  isSendingOtp: false,
  setSendingOtp: (loading) => set({ isSendingOtp: loading }),
  isVerifyingOtp: false,
  setVerifyingOtp: (loading) => set({ isVerifyingOtp: loading }),
}));