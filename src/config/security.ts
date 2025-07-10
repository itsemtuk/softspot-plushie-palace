/**
 * Security configuration and environment validation
 */

interface SecurityConfig {
  clerkPublishableKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

/**
 * Validates and returns security configuration
 */
export const getSecurityConfig = (): SecurityConfig => {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  // Validate required environment variables
  if (!clerkKey) {
    console.warn('VITE_CLERK_PUBLISHABLE_KEY not found, using fallback');
  }

  // Validate Clerk key format (should start with pk_)
  if (clerkKey && !clerkKey.startsWith('pk_')) {
    console.error('Invalid Clerk publishable key format');
  }

  return {
    clerkPublishableKey: clerkKey || "pk_test_bm90YWJsZS1naXJhZmZlLTE2LmNsZXJrLmFjY291bnRzLmRldiQ",
    supabaseUrl: "https://evsaupqzqbynwkuszssm.supabase.co",
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2c2FtanptcXpieW53a3VzenNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MzgwMTEsImV4cCI6MjA2MDQxNDAxMX0.rkYcUyq7tMf3om2doHkWt85bdAHinEceuH43Hwn1knw",
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD
  };
};

/**
 * Security feature flags
 */
export const securityFeatures = {
  enableCSRFProtection: true,
  enableRateLimiting: true,
  enableInputSanitization: true,
  enableSecurityHeaders: true,
  enableSecurityLogging: true,
  enableContentValidation: true
} as const;

/**
 * Rate limiting configuration
 */
export const rateLimits = {
  postCreation: { maxAttempts: 5, windowMs: 300000 }, // 5 posts per 5 minutes
  authentication: { maxAttempts: 5, windowMs: 900000 }, // 5 attempts per 15 minutes
  search: { maxAttempts: 30, windowMs: 60000 }, // 30 searches per minute
  fileUpload: { maxAttempts: 10, windowMs: 600000 } // 10 uploads per 10 minutes
} as const;

/**
 * Content validation rules
 */
export const contentLimits = {
  maxPostLength: 2000,
  maxTitleLength: 200,
  maxBioLength: 500,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxImageDimensions: { width: 4096, height: 4096 }
} as const;