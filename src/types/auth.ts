
export interface UserCredentials {
  email: string;
  password?: string; // Password might be optional for OTP scenarios initially
  username?: string; // Optional username
}

export interface UserProfile {
  id: string | number; // Or number, depending on your backend
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  user_type?: 'candidate' | 'employer' | 'admin'; // Example user types
  // Add other profile fields as needed
  email_verified?: boolean;
}

export interface OTPVerificationResult {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
  user?: UserProfile;
}

// You can add other auth-related types here, e.g., for JWT tokens
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}
