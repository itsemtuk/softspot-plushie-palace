import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '@/utils/auth/authState';
import { useUser } from '@clerk/clerk-react';
import { Navigate, useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ui/error-boundary';
import { Spinner } from '@/components/ui/spinner';

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
          console.log(`Clerk auth state loaded. isSignedIn: ${isClerkSignedIn}`);
          setIsUserAuthenticated(isClerkSignedIn);
        }
      } else {
        // For fallback auth, check localStorage
        const authState = isAuthenticated();
        console.log(`Fallback auth state checked. isAuthenticated: ${authState}`);
        setIsUserAuthenticated(authState);
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
    
    // Check auth status periodically to ensure it's up to date
    const intervalId = setInterval(checkAuth, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('clerk-auth-change', checkAuth);
      clearInterval(intervalId);
    };
  }, [isClerkConfigured, isClerkLoaded, isClerkSignedIn]);
  
  // Show loading state if Clerk is still loading
  if (isClerkConfigured && !isClerkLoaded) {
    return (
      <div className="flex justify-center items-center h-24">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  
  console.log(`AuthWrapper rendering: requiresAuth=${requiresAuth}, isUserAuthenticated=${isUserAuthenticated}`);
  
  // If auth is required but user is not authenticated, show fallback or redirect
  if (requiresAuth && !isUserAuthenticated) {
    if (fallback) {
      return <ErrorBoundary>{fallback}</ErrorBoundary>;
    } else {
      console.log("Redirecting to sign-in page due to missing authentication");
      return <Navigate to="/sign-in" replace />;
    }
  }

  // If auth is not required but user is authenticated, show fallback or redirect
  if (!requiresAuth && isUserAuthenticated) {
    if (fallback) {
      return <ErrorBoundary>{fallback}</ErrorBoundary>;
    } else {
      console.log("Already authenticated, redirecting to feed");
      return <Navigate to="/feed" replace />;
    }
  }
  
  // Otherwise show the children wrapped in error boundary
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
