import { useState, useCallback } from 'react';
import { z } from 'zod';
import { sanitizeTextInput, postCreationLimiter } from '@/utils/security/inputValidation';
import { useCSRFProtection } from '@/utils/security/csrfProtection';
import { logSecurityEvent } from '@/utils/security/securityHeaders';
import { useUser } from '@clerk/clerk-react';

interface UseSecureFormProps<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T, csrfToken: string) => Promise<void>;
  rateLimitKey?: string;
  requireAuth?: boolean;
}

export const useSecureForm = <T extends Record<string, any>>({
  schema,
  onSubmit,
  rateLimitKey,
  requireAuth = true
}: UseSecureFormProps<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { generateCSRFToken } = useCSRFProtection();
  const { user } = useUser();

  const handleSubmit = useCallback(async (data: T) => {
    try {
      setIsSubmitting(true);
      setErrors([]);

      // Security validations
      if (requireAuth && !user) {
        throw new Error('Authentication required');
      }

      // Rate limiting check
      if (rateLimitKey) {
        const identifier = user?.id || 'anonymous';
        if (!postCreationLimiter.isAllowed(identifier)) {
          const remaining = postCreationLimiter.getRemainingAttempts(identifier);
          logSecurityEvent('RATE_LIMIT_EXCEEDED', {
            userId: user?.id,
            identifier,
            remaining,
            action: rateLimitKey
          });
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }

      // Basic data sanitization
      const sanitizedData: Record<string, any> = { ...data };
      for (const [key, value] of Object.entries(sanitizedData)) {
        if (typeof value === 'string') {
          sanitizedData[key] = sanitizeTextInput(value);
        }
      }

      // Schema validation
      try {
        const validatedData = schema.parse(sanitizedData as T);
        
        // Generate CSRF token
        const csrfToken = generateCSRFToken();

        // Log successful validation
        logSecurityEvent('FORM_SUBMITTED', {
          userId: user?.id,
          action: rateLimitKey || 'unknown',
          timestamp: new Date().toISOString()
        });

        // Submit with validated data and CSRF token
        await onSubmit(validatedData, csrfToken);

      } catch (validationError) {
        if (validationError instanceof z.ZodError) {
          const errorMessages = validationError.errors.map(err => err.message);
          setErrors(errorMessages);
          logSecurityEvent('FORM_VALIDATION_FAILED', {
            userId: user?.id,
            errors: errorMessages,
            action: rateLimitKey || 'unknown'
          });
          return;
        }
        throw validationError;
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Submission failed';
      setErrors([errorMessage]);
      
      logSecurityEvent('FORM_SUBMISSION_ERROR', {
        userId: user?.id,
        error: errorMessage,
        action: rateLimitKey || 'unknown'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [schema, onSubmit, rateLimitKey, requireAuth, user, generateCSRFToken]);

  return {
    handleSubmit,
    isSubmitting,
    errors,
    clearErrors: () => setErrors([])
  };
};