
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;

    // If auth is required and user is not signed in, redirect to sign-in
    if (requireAuth && !isSignedIn) {
      console.log('User not authenticated, redirecting to sign-in');
      navigate('/sign-in', { replace: true });
      return;
    }

    // If auth is not required and user is signed in, redirect to feed
    if (!requireAuth && isSignedIn) {
      console.log('User already authenticated, redirecting to feed');
      navigate('/feed', { replace: true });
      return;
    }
  }, [isLoaded, isSignedIn, requireAuth, navigate]);

  // Show loading while Clerk loads
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Check authentication requirements
  if (requireAuth && !isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // For non-auth pages, don't render if user is already signed in (they'll be redirected)
  if (!requireAuth && isSignedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};
