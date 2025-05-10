import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '@/utils/auth/authState';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useNavigate } from 'react-router-dom';

interface AuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiresAuth?: boolean;
}

/**
 * AuthWrapper is a utility component that conditionally renders content based on
 * authentication state, working with both Clerk and fallback authentication.
 */
export const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  fallback = null,
  requiresAuth = true
}) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  const navigate = useNavigate();
  
  // If Clerk is configured, use the Clerk hook to check auth state
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = 
    isClerkConfigured ? useUser() : { isLoaded: true, isSignedIn: false };
  
  useEffect(() => {
    const checkAuth = () => {
      // For Clerk auth, wait for it to load
      if (isClerkConfigured) {
        if (isClerkLoaded) {
          setIsUserAuthenticated(isClerkSignedIn);
        }
      } else {
        // For fallback auth, check localStorage
        setIsUserAuthenticated(isAuthenticated());
      }
    };
    
    // Initial check
    checkAuth();
    
    // Listen for auth state changes
    const handleStorageChange = () => {
      if (!isClerkConfigured) {
        setIsUserAuthenticated(isAuthenticated());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('clerk-auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('clerk-auth-change', checkAuth);
    };
  }, [isClerkConfigured, isClerkLoaded, isClerkSignedIn]);
  
  // Show loading state if Clerk is still loading
  if (isClerkConfigured && !isClerkLoaded) {
    return <div className="flex justify-center items-center h-24">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-softspot-500"></div>
    </div>;
  }
  
  // If auth is required but user is not authenticated, show fallback or redirect
  if (requiresAuth && !isUserAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    } else {
      return <Navigate to="/sign-in" replace />;
    }
  }

  // If auth is not required but user is authenticated, show fallback or redirect
  if (!requiresAuth && isUserAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    } else {
      return <Navigate to="/feed" replace />;
    }
  }
  
  // Otherwise show the children
  return <>{children}</>;
};
