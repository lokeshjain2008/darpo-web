// Auth configuration
export const AUTH_CONFIG = {
  // Phone auth settings
  PHONE: {
    // India country code
    COUNTRY_CODE: '+91',
    // OTP settings
    OTP_LENGTH: 4,
    // Resend timeout in seconds
    RESEND_TIMEOUT: 30,
    // Phone number validation
    MIN_LENGTH: 10,
    MAX_LENGTH: 10,
  },
  
  // Error messages
  ERRORS: {
    INVALID_PHONE: 'Please enter a valid 10-digit phone number',
    INVALID_OTP: 'Please enter a valid 4-digit OTP',
    OTP_EXPIRED: 'OTP has expired. Please request a new one',
    OTP_INVALID: 'Invalid OTP. Please try again',
    PHONE_REQUIRED: 'Phone number is required',
    OTP_REQUIRED: 'OTP is required',
    NETWORK_ERROR: 'Network error. Please try again',
    UNKNOWN_ERROR: 'Something went wrong. Please try again',
    TOO_MANY_REQUESTS: 'Too many requests. Please wait before trying again',
  }
} as const;
