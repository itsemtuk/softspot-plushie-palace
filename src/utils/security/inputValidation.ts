import { z } from 'zod';

/**
 * Input validation schemas and utilities
 */

// Common validation patterns
export const ValidationSchemas = {
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
    .transform(input => sanitizeTextInput(input)),
  
  email: z.string()
    .email('Invalid email address')
    .max(254, 'Email address too long'),
  
  postContent: z.string()
    .min(1, 'Content cannot be empty')
    .max(2000, 'Content must be less than 2000 characters')
    .transform(input => sanitizeTextInput(input)),
  
  postTitle: z.string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters')
    .transform(input => sanitizeTextInput(input)),
  
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .transform(input => sanitizeTextInput(input)),
  
  price: z.number()
    .min(0, 'Price must be positive')
    .max(10000, 'Price must be less than $10,000')
    .finite('Price must be a valid number'),
  
  imageUrl: z.string()
    .url('Invalid image URL')
    .max(2048, 'Image URL too long')
    .refine(url => {
      const allowedDomains = ['supabase.co', 'clerk.dev', 'localhost', 'lovable.app'];
      try {
        const urlObj = new URL(url);
        return allowedDomains.some(domain => urlObj.hostname.includes(domain));
      } catch {
        return false;
      }
    }, 'Image URL from unauthorized domain')
    .optional(),
  
  brandName: z.string()
    .min(1, 'Brand name cannot be empty')
    .max(50, 'Brand name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s&.-]+$/, 'Brand name contains invalid characters')
    .transform(input => sanitizeTextInput(input)),
  
  condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor']),
  
  material: z.string()
    .max(100, 'Material description must be less than 100 characters')
    .transform(input => sanitizeTextInput(input)),
  
  size: z.string()
    .max(50, 'Size description must be less than 50 characters')
    .transform(input => sanitizeTextInput(input)),
  
  searchQuery: z.string()
    .max(100, 'Search query must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s&.-]*$/, 'Search query contains invalid characters')
    .transform(input => sanitizeTextInput(input)),

  // Additional secure validation schemas
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message must be less than 1000 characters')
    .transform(input => sanitizeTextInput(input)),
    
  phoneNumber: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
    .optional(),
    
  address: z.string()
    .max(200, 'Address must be less than 200 characters')
    .transform(input => sanitizeTextInput(input))
    .optional()
};

/**
 * Sanitizes text input by removing dangerous characters
 */
export const sanitizeTextInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/expression\s*\(/gi, '') // Remove CSS expressions
    .trim();
};

/**
 * Validates and sanitizes form data
 */
export const validateAndSanitizeFormData = <T extends Record<string, any>>(
  data: T,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    // First sanitize text fields
    const sanitizedData: Record<string, any> = { ...data };
    for (const [key, value] of Object.entries(sanitizedData)) {
      if (typeof value === 'string') {
        sanitizedData[key] = sanitizeTextInput(value);
      }
    }
    
    // Then validate with schema
    const validatedData = schema.parse(sanitizedData as T);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => err.message) 
      };
    }
    return { 
      success: false, 
      errors: ['Validation failed'] 
    };
  }
};

/**
 * Rate limiting utility for client-side
 */
export class ClientRateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = userAttempts.filter(
      attempt => now - attempt < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }
  
  getRemainingAttempts(identifier: string): number {
    const userAttempts = this.attempts.get(identifier) || [];
    const now = Date.now();
    const recentAttempts = userAttempts.filter(
      attempt => now - attempt < this.windowMs
    );
    
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
}

// Global rate limiter instances
export const postCreationLimiter = new ClientRateLimiter(5, 300000); // 5 posts per 5 minutes
export const searchLimiter = new ClientRateLimiter(30, 60000); // 30 searches per minute