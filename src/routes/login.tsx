import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '@/components/login-form';

export const Route = createFileRoute('/login')({
  component: Login
})

function Login() {
  const auth = useAuth();
  const navigate = useNavigate();

  // if user then redirect to home
  if (auth.isAuthenticated()) {
    navigate({ to: '/about' });
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-4 md:p-4">
      <div className="w-full max-w-md">
        <LoginForm
          sendOtpToPhone={auth.sendOtpToPhone}
          verifyOtpAndLogin={auth.verifyOtpAndLogin}
          isOtpSent={auth.isOtpSent}
          otpPhone={auth.otpPhone}
          isSendingOtp={auth.isSendingOtp}
          isVerifyingOtp={auth.isVerifyingOtp}
          resendTimer={auth.resendTimer}
        />
      </div>
    </div>
  );
};

//export default Login;
