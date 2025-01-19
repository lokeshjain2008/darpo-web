import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../api/supabaseClient';
import { User } from '@supabase/supabase-js'; // Import User type from Supabase

export const useAuth = () => {
  const { user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const { data: {subscription} } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // console.log('SIGNED_IN', session, session.user);
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        console.error('SIGNED_OUT');
        clearUser();
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, clearUser]);

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error logging in with Google:', error.message);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      clearUser();
    }
  };

  const isAuthenticated = ()=> user !== null;


  return { user, isAuthenticated, loginWithGoogle, logout };
};



export type AuthContext = ReturnType<typeof useAuth>;