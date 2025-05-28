
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { setCurrentUserContext, isInFallbackMode } from '@/utils/supabase/rls';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface AuthBoundaryProps {
  children: React.ReactNode;
}

export default function AuthBoundary({ children }: AuthBoundaryProps) {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const [fallbackAuth, setFallbackAuth] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('AuthBoundary: Starting initialization', { isLoaded, user: !!user });
      
      try {
        setIsInitializing(true);
        setAuthError(null);

        if (!isLoaded) {
          console.log('AuthBoundary: Clerk not loaded yet');
          return;
        }

        if (!user) {
          console.log('AuthBoundary: No user found, redirecting to sign-in');
          navigate('/sign-in');
          return;
        }

        console.log('AuthBoundary: User found, setting up context for:', user.id);
        
        // Try to set user context
        const success = await setCurrentUserContext(user.id);
        
        if (!success) {
          console.warn('AuthBoundary: Failed to set user context, using fallback mode');
          setFallbackAuth(true);
        } else {
          console.log('AuthBoundary: User context set successfully');
          setFallbackAuth(false);
        }

      } catch (error: any) {
        console.error('AuthBoundary: Auth initialization error:', error);
        setAuthError(error.message || 'Authentication failed');
        setFallbackAuth(true);
      } finally {
        setIsInitializing(false);
        console.log('AuthBoundary: Initialization complete');
      }
    };
    
    initializeAuth();
  }, [user, isLoaded, navigate]);

  // Show loading while Clerk is loading or while we're initializing
  if (!isLoaded || isInitializing) {
    console.log('AuthBoundary: Showing loading spinner');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Show error if authentication failed and we're not in fallback mode
  if (authError && !fallbackAuth) {
    console.log('AuthBoundary: Showing auth error');
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Authentication Error:</strong> {authError}
            <button 
              onClick={() => window.location.reload()} 
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // User is not authenticated, redirect handled above
  if (!user) {
    console.log('AuthBoundary: No user, returning null');
    return null;
  }

  // Don't show fallback mode indicator - just work silently in the background
  console.log('AuthBoundary: Rendering children', { fallbackMode: fallbackAuth || isInFallbackMode() });
  return <>{children}</>;
}
