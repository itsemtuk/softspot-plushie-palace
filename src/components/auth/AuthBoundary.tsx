
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
      try {
        setIsInitializing(true);
        setAuthError(null);

        if (!isLoaded) {
          return;
        }

        if (!user) {
          console.log('No user found, redirecting to sign-in');
          navigate('/sign-in');
          return;
        }

        console.log('Initializing auth for user:', user.id);
        
        // Try to set user context
        const success = await setCurrentUserContext(user.id);
        
        if (!success) {
          console.warn('Failed to set user context, using fallback mode');
          setFallbackAuth(true);
        } else {
          setFallbackAuth(false);
        }

      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setAuthError(error.message || 'Authentication failed');
        setFallbackAuth(true);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeAuth();
  }, [user, isLoaded, navigate]);

  // Show loading while Clerk is loading or while we're initializing
  if (!isLoaded || isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Show error if authentication failed
  if (authError && !fallbackAuth) {
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
  if (!user) return null;

  // Show fallback mode indicator
  if (fallbackAuth || isInFallbackMode()) {
    return (
      <div>
        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Offline Mode:</strong> Database connection issues detected. Working in local mode - changes will sync when connection is restored.
          </AlertDescription>
        </Alert>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}
