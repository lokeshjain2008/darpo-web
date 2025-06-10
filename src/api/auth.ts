// filepath: src/api/auth.ts
import { supabase } from '@/db/supabaseClient';
import { AUTH_CONFIG } from '@/config/auth';

// Send OTP to phone number
export const sendOTP = async (phone: string) => {
  const formattedPhone = `${AUTH_CONFIG.PHONE.COUNTRY_CODE}${phone}`;
  
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  });
  
  if (error) throw error;
  return data;
};

// Verify OTP and sign in
export const verifyOTP = async (phone: string, token: string) => {
  const formattedPhone = `${AUTH_CONFIG.PHONE.COUNTRY_CODE}${phone}`;
  
  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token,
    type: 'sms',
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};