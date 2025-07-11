import { useEffect } from 'react';
import { applySecurityHeaders } from '@/utils/security/securityHeaders';

/**
 * Security initialization component - sets up security configurations
 */
export const SecurityProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Apply security headers and configurations
    applySecurityHeaders();
    
    // Log security initialization
    console.log('[Security] Security headers and configurations applied');
  }, []);

  return <>{children}</>;
};