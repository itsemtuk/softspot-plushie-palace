
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { setCurrentUserContext } from '@/utils/supabase/rls';

interface AuthBoundaryProps {
  children: React.ReactNode;
}

export default function AuthBoundary({ children }: AuthBoundaryProps) {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      if (user) {
        try {
          await setCurrentUserContext(user.id);
        } catch (error) {
          console.error('Failed to set user context:', error);
        }
      } else if (isLoaded) {
        navigate('/sign-in');
      }
    };
    
    initializeAuth();
  }, [user, isLoaded, navigate]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-softspot-600"></div>
        <p className="ml-4 text-gray-600">Loading authentication...</p>
      </div>
    );
  }
  
  if (!user) return null; // Already redirected

  return <>{children}</>;
}
