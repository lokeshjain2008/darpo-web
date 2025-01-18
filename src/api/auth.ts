// filepath: src/api/auth.ts
import { supabase } from './supabaseClient';

export const signIn = async (email: string, password: string) => {
  const { user, error } = await supabase.auth.signIn({ email, password });
  if (error) throw error;
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};