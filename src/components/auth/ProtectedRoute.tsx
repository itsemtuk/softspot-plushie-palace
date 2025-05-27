
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { isAuthenticated } from '@/utils/auth/authState';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';

  useEffect(() => {
    if (!requireAuth) return;

    // Wait for Clerk to load if configured
    if (isClerkConfigured && !isLoaded) return;

    // Check authentication status
    const authStatus = isClerkConfigured ? isSignedIn : isAuthenticated();

    if (!authStatus) {
      console.log('User not authenticated, redirecting to sign-in');
      navigate('/sign-in', { replace: true });
    }
  }, [isLoaded, isSignedIn, isClerkConfigured, requireAuth, navigate]);

  // Show loading while Clerk loads
  if (isClerkConfigured && !isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Check authentication
  const authStatus = isClerkConfigured ? isSignedIn : isAuthenticated();
  
  if (requireAuth && !authStatus) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};
