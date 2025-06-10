import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../db/supabaseClient';
import { sendOTP, verifyOTP } from '../api/auth';
import { AUTH_CONFIG } from '@/config/auth';

export const useAuth = () => {
  const { 
    user, setUser, clearUser,
    isOtpSent, setOtpSent, otpPhone, setOtpPhone,
    isSendingOtp, setSendingOtp, isVerifyingOtp, setVerifyingOtp
  } = useAuthStore();
  
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    const { data: {subscription} } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // console.log('SIGNED_IN', session, session.user);
        setUser(session.user);
        // Clear OTP state on successful login
        setOtpSent(false);
        setOtpPhone(null);
      } else if (event === 'SIGNED_OUT') {
        console.error('SIGNED_OUT');
        clearUser();
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [clearUser, setUser, setOtpSent, setOtpPhone]);

  // Timer effect for resend countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Send OTP to phone number
  const sendOtpToPhone = useCallback(async (phone: string) => {
    if (isSendingOtp) return { error: null };
    
    setSendingOtp(true);
    try {
      await sendOTP(phone);
      setOtpSent(true);
      setOtpPhone(phone);
      setResendTimer(AUTH_CONFIG.PHONE.RESEND_TIMEOUT);
      return { error: null };
    } catch (error: unknown) {
      console.error('Error sending OTP:', error);
      const errorMessage = error instanceof Error ? error.message : AUTH_CONFIG.ERRORS.UNKNOWN_ERROR;
      return { 
        error: errorMessage || AUTH_CONFIG.ERRORS.UNKNOWN_ERROR 
      };
    } finally {
      setSendingOtp(false);
    }
  }, [isSendingOtp, setSendingOtp, setOtpSent, setOtpPhone]);

  // Verify OTP and complete login
  const verifyOtpAndLogin = useCallback(async (phone: string, otp: string) => {
    if (isVerifyingOtp) return { error: null };
    
    setVerifyingOtp(true);
    try {
      await verifyOTP(phone, otp);
      // Auth state change will be handled by the listener above
      return { error: null };
    } catch (error: unknown) {
      console.error('Error verifying OTP:', error);
      
      if (error instanceof Error) {
        if (error.message?.includes('invalid') || error.message?.includes('expired')) {
          return { error: AUTH_CONFIG.ERRORS.OTP_INVALID };
        } else if (error.message?.includes('too many')) {
          return { error: AUTH_CONFIG.ERRORS.TOO_MANY_REQUESTS };
        }
      }
      
      return { error: AUTH_CONFIG.ERRORS.UNKNOWN_ERROR };
    } finally {
      setVerifyingOtp(false);
    }
  }, [isVerifyingOtp, setVerifyingOtp]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      clearUser();
    }
  };

  const isAuthenticated = () => user !== null;

  return { 
    user, 
    isAuthenticated, 
    logout,
    // Phone auth
    sendOtpToPhone,
    verifyOtpAndLogin,
    isOtpSent,
    otpPhone,
    isSendingOtp,
    isVerifyingOtp,
    resendTimer,
  };
};



export type AuthContext = ReturnType<typeof useAuth>;