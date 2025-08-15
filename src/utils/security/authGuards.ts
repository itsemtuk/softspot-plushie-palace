import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { logSecurityEvent } from './securityHeaders';

/**
 * Authentication guard hook
 */
export const useAuthGuard = (requireAuth: boolean = true) => {
  const { user, isLoaded } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (requireAuth && !user) {
      logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', {
        timestamp: new Date().toISOString(),
        path: window.location.pathname
      });
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  }, [user, isLoaded, requireAuth]);

  return {
    isAuthorized,
    isLoading: !isLoaded,
    user
  };
};

/**
 * Resource ownership validation
 */
export const useOwnershipGuard = (resourceUserId?: string) => {
  const { user } = useUser();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!user || !resourceUserId) {
      setIsOwner(false);
      return;
    }

    const userOwnsResource = user.id === resourceUserId;
    setIsOwner(userOwnsResource);

    if (!userOwnsResource) {
      logSecurityEvent('OWNERSHIP_VIOLATION_ATTEMPT', {
        userId: user.id,
        resourceUserId,
        timestamp: new Date().toISOString(),
        path: window.location.pathname
      });
    }
  }, [user, resourceUserId]);

  return isOwner;
};

/**
 * Role-based access control hook
 */
export const useRoleGuard = (requiredRoles: string[] = []) => {
  const { user } = useUser();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!user || requiredRoles.length === 0) {
      setHasAccess(true);
      return;
    }

    // Check user roles (this would need to be implemented based on your role system)
    const userRoles = user.publicMetadata?.roles as string[] || [];
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
    
    setHasAccess(hasRequiredRole);

    if (!hasRequiredRole) {
      logSecurityEvent('ROLE_ACCESS_DENIED', {
        userId: user.id,
        requiredRoles,
        userRoles,
        timestamp: new Date().toISOString(),
        path: window.location.pathname
      });
    }
  }, [user, requiredRoles]);

  return hasAccess;
};