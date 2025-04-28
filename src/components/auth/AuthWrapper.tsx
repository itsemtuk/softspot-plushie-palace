import React from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiresAuth?: boolean;
}

/**
 * AuthWrapper is a utility component that conditionally renders content based on
 * authentication state without relying on Clerk components directly.
 * This avoids the ClerkProvider wrapping issues.
 */
export const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  fallback = null,
  requiresAuth = true
}) => {
  // Check if a user is logged in via localStorage
  const isUserLoggedIn = !!localStorage.getItem('currentUserId');
  
  // If auth is required but user is not logged in, show fallback
  if (requiresAuth && !isUserLoggedIn) {
    return <>{fallback}</>;
  }

  // If auth is not required but user is logged in, show fallback (for SignedOut equivalent)
  if (!requiresAuth && isUserLoggedIn) {
    return <>{fallback}</>;
  }
  
  // Otherwise show the children
  return <>{children}</>;
};
