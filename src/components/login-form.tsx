import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GalleryVerticalEnd, Phone, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/hooks/useAuth";
import { phoneSchema, otpSchema, type PhoneFormData, type OtpFormData } from "@/validators/auth.schema";
import { AUTH_CONFIG } from "@/config/auth";

type LoginProps = {
  sendOtpToPhone: AuthContext["sendOtpToPhone"];
  verifyOtpAndLogin: AuthContext["verifyOtpAndLogin"];
  isOtpSent: AuthContext["isOtpSent"];
  otpPhone: AuthContext["otpPhone"];
  isSendingOtp: AuthContext["isSendingOtp"];
  isVerifyingOtp: AuthContext["isVerifyingOtp"];
  resendTimer: AuthContext["resendTimer"];
} & React.ComponentPropsWithoutRef<"div">;


export function LoginForm({
  className,
  sendOtpToPhone,
  verifyOtpAndLogin,
  isOtpSent,
  otpPhone,
  isSendingOtp,
  isVerifyingOtp,
  resendTimer,
  ...props
}: LoginProps) {
  const [authError, setAuthError] = useState<string | null>(null);

  // Phone form
  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  // OTP form
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const handleSendOtp = async (data: PhoneFormData) => {
    setAuthError(null);
    const result = await sendOtpToPhone(data.phone);
    if (result.error) {
      setAuthError(result.error);
    }
  };

  const handleVerifyOtp = async (data: OtpFormData) => {
    if (!otpPhone) return;
    
    setAuthError(null);
    const result = await verifyOtpAndLogin(otpPhone, data.otp);
    if (result.error) {
      setAuthError(result.error);
      otpForm.setError("otp", { message: result.error });
    }
  };

  const handleResendOtp = async () => {
    if (!otpPhone || resendTimer > 0) return;
    
    setAuthError(null);
    const result = await sendOtpToPhone(otpPhone);
    if (result.error) {
      setAuthError(result.error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 rounded-sm border p-8 shadow-md", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a
            href="#"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <span className="sr-only">Darpo dashboard app</span>
          </a>
          <h1 className="text-xl font-bold">Welcome to Darpo dashboard</h1>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline underline-offset-4">
              contact support
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {authError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {authError}
            </div>
          )}
          {!isOtpSent ? (
            <form onSubmit={phoneForm.handleSubmit(handleSendOtp)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">
                    {AUTH_CONFIG.PHONE.COUNTRY_CODE}
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    className="rounded-l-none"
                    {...phoneForm.register("phone")}
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <span className="text-sm text-red-600">
                    {phoneForm.formState.errors.phone.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSendingOtp}>
                <Phone className="mr-2 h-4 w-4" />
                {isSendingOtp ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="flex flex-col gap-4">
              <div className="text-center text-sm text-muted-foreground">
                OTP sent to {AUTH_CONFIG.PHONE.COUNTRY_CODE}{otpPhone}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="otp" className="text-sm font-medium">
                  Enter 4-digit OTP
                </label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="1234"
                  maxLength={4}
                  className="text-center text-lg tracking-widest"
                  {...otpForm.register("otp")}
                />
                {otpForm.formState.errors.otp && (
                  <span className="text-sm text-red-600">
                    {otpForm.formState.errors.otp.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isVerifyingOtp}>
                <Shield className="mr-2 h-4 w-4" />
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </Button>
              <div className="flex flex-col items-center gap-2">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto"
                  disabled={resendTimer > 0}
                  onClick={handleResendOtp}
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
