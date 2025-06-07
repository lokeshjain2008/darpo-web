import { z } from 'zod';
import { AUTH_CONFIG } from '@/config/auth';

// Phone number schema for India (+91)
export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, AUTH_CONFIG.ERRORS.PHONE_REQUIRED)
    .regex(/^[6-9]\d{9}$/, AUTH_CONFIG.ERRORS.INVALID_PHONE)
    .length(AUTH_CONFIG.PHONE.MIN_LENGTH, AUTH_CONFIG.ERRORS.INVALID_PHONE),
});

// OTP verification schema
export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, AUTH_CONFIG.ERRORS.OTP_REQUIRED)
    .regex(/^\d{4}$/, AUTH_CONFIG.ERRORS.INVALID_OTP)
    .length(AUTH_CONFIG.PHONE.OTP_LENGTH, AUTH_CONFIG.ERRORS.INVALID_OTP),
});

// Combined phone auth schema
export const phoneAuthSchema = phoneSchema.merge(otpSchema);

export type PhoneFormData = z.infer<typeof phoneSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type PhoneAuthFormData = z.infer<typeof phoneAuthSchema>;
