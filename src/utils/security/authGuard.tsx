import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

/**
 * Authentication guard component to protect routes and components
 */
export const AuthGuard = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/sign-in',
  fallback 
}: AuthGuardProps) => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && requireAuth && !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this feature.",
      });
      navigate(redirectTo);
    }
  }, [user, isLoaded, requireAuth, navigate, redirectTo]);

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-softspot-500"></div>
      </div>
    );
  }

  // Show fallback if user is not authenticated and auth is required
  if (requireAuth && !user) {
    return fallback || null;
  }

  return <>{children}</>;
};

/**
 * Hook to check authorization for specific actions
 */
export const useAuthorization = () => {
  const { user } = useUser();

  const canCreatePost = (): boolean => {
    return !!user?.id;
  };

  const canEditPost = (postUserId: string): boolean => {
    return !!user?.id && user.id === postUserId;
  };

  const canDeletePost = (postUserId: string): boolean => {
    return !!user?.id && user.id === postUserId;
  };

  const canAccessMarketplace = (): boolean => {
    return !!user?.id;
  };

  const canSellItems = (): boolean => {
    return !!user?.id;
  };

  const canSendMessages = (): boolean => {
    return !!user?.id;
  };

  const canViewProfile = (profileUserId?: string): boolean => {
    if (!profileUserId) return !!user?.id; // Own profile
    return true; // Public profiles are viewable by everyone
  };

  const canEditProfile = (profileUserId?: string): boolean => {
    if (!user?.id) return false;
    if (!profileUserId) return true; // Own profile
    return user.id === profileUserId;
  };

  return {
    canCreatePost,
    canEditPost,
    canDeletePost,
    canAccessMarketplace,
    canSellItems,
    canSendMessages,
    canViewProfile,
    canEditProfile,
    isAuthenticated: !!user?.id
  };
};

/**
 * Higher-order component for protecting components
 */
export const withAuthGuard = <P extends object>(
  Component: React.ComponentType<P>,
  options: { requireAuth?: boolean; redirectTo?: string } = {}
) => {
  return (props: P) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  );
};