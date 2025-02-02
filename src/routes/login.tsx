import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { LoginForm } from '@/components/login-form';

export const Route = createFileRoute('/login')({
  component: Login
})

function Login() {
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // if user then redirect to home
  if (isAuthenticated()) {
    navigate({ to: '/about' });
    // redirect({ to: '/' });
  }

  console.log('user', isAuthenticated());

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4 md:p-4">
      <div className="w-full max-w-md">
        <LoginForm login={loginWithGoogle} />
      </div>
    </div>
  );
};

//export default Login;
