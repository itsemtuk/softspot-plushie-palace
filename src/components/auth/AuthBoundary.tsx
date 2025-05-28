
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { setCurrentUserContext } from '@/utils/supabase/rls';
import LoadingSpinner from '@/components/LoadingSpinner';

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
    return <LoadingSpinner />;
  }
  
  if (!user) return null; // Already redirected

  return <>{children}</>;
}
