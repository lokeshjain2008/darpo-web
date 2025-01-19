import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';

export const Route = createFileRoute('/login')({
  component: Login
})

function Login() {
  const { loginWithGoogle } = useAuth();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">Login</h2>
        <button
          onClick={loginWithGoogle}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Login with Google
        </button>
        {user && (
          <div className="mt-4 text-center">
            <p>Welcome, {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

//export default Login;
