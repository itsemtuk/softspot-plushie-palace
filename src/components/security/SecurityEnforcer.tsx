import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { sanitizeTextInput, validateAndSanitizeFormData, ValidationSchemas } from '@/utils/security/inputValidation';
import { SecureStorage } from '@/utils/security/secureStorage';
import { logSecurityEvent } from '@/utils/security/securityHeaders';

/**
 * Security enforcement component that provides global security utilities
 */
export const SecurityEnforcer = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();

  useEffect(() => {
    // Initialize security monitoring
    const initSecurity = () => {
      // Clean up old storage data on app start
      SecureStorage.cleanup();
      
      // Log security initialization
      console.log('[Security] Security enforcement initialized');
      
      // Set up global security event listeners
      const handleSecurityViolation = (event: SecurityPolicyViolationEvent) => {
        logSecurityEvent('CSP_VIOLATION', {
          violatedDirective: event.violatedDirective,
          blockedURI: event.blockedURI,
          documentURI: event.documentURI,
          lineNumber: event.lineNumber,
          sourceFile: event.sourceFile
        });
      };
      
      // Listen for CSP violations
      document.addEventListener('securitypolicyviolation', handleSecurityViolation);
      
      return () => {
        document.removeEventListener('securitypolicyviolation', handleSecurityViolation);
      };
    };

    const cleanup = initSecurity();
    return cleanup;
  }, []);

  useEffect(() => {
    // Monitor authentication state changes for security
    if (user) {
      logSecurityEvent('USER_AUTHENTICATED', {
        userId: user.id,
        timestamp: new Date().toISOString()
      });
    }
  }, [user]);

  // Make security utilities available globally
  useEffect(() => {
    // Attach security utilities to window for global access
    (window as any).securityUtils = {
      sanitizeInput: sanitizeTextInput,
      validateForm: validateAndSanitizeFormData,
      schemas: ValidationSchemas
    };
    
    return () => {
      delete (window as any).securityUtils;
    };
  }, []);

  return <>{children}</>;
};