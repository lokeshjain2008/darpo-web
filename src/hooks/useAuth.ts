// filepath: src/hooks/useAuth.ts
import { useAuthStore } from '../store/authStore';
import { signIn, signOut } from '../api/auth';

export const useAuth = () => {
  const { user, setUser, clearUser } = useAuthStore();

  const login = async (email: string, password: string) => {
    const user = await signIn(email, password);
    setUser(user);
  };

  const logout = async () => {
    await signOut();
    clearUser();
  };

  return { user, login, logout };
};