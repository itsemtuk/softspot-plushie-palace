/**
 * CSRF Protection utilities for state-changing operations
 */

import { v4 as uuidv4 } from 'uuid';

class CSRFManager {
  private static instance: CSRFManager;
  private tokens: Map<string, number> = new Map();
  private readonly TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes

  static getInstance(): CSRFManager {
    if (!CSRFManager.instance) {
      CSRFManager.instance = new CSRFManager();
    }
    return CSRFManager.instance;
  }

  /**
   * Generate a new CSRF token
   */
  generateToken(): string {
    const token = uuidv4();
    const timestamp = Date.now();
    
    // Clean up expired tokens
    this.cleanupExpiredTokens();
    
    // Store token with timestamp
    this.tokens.set(token, timestamp);
    
    return token;
  }

  /**
   * Validate a CSRF token
   */
  validateToken(token: string): boolean {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const timestamp = this.tokens.get(token);
    if (!timestamp) {
      return false;
    }

    // Check if token is expired
    const isExpired = Date.now() - timestamp > this.TOKEN_EXPIRY;
    if (isExpired) {
      this.tokens.delete(token);
      return false;
    }

    return true;
  }

  /**
   * Consume a CSRF token (one-time use)
   */
  consumeToken(token: string): boolean {
    const isValid = this.validateToken(token);
    if (isValid) {
      this.tokens.delete(token);
    }
    return isValid;
  }

  /**
   * Clean up expired tokens
   */
  private cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, timestamp] of this.tokens.entries()) {
      if (now - timestamp > this.TOKEN_EXPIRY) {
        this.tokens.delete(token);
      }
    }
  }
}

export const csrfManager = CSRFManager.getInstance();

/**
 * Hook for CSRF protection in forms
 */
export const useCSRFProtection = () => {
  const generateCSRFToken = () => csrfManager.generateToken();
  const validateCSRFToken = (token: string) => csrfManager.validateToken(token);
  const consumeCSRFToken = (token: string) => csrfManager.consumeToken(token);

  return {
    generateCSRFToken,
    validateCSRFToken,
    consumeCSRFToken
  };
};

/**
 * Middleware function to validate CSRF tokens in API calls
 */
export const validateCSRFHeader = (headers: Record<string, string>): boolean => {
  const token = headers['x-csrf-token'] || headers['X-CSRF-Token'];
  return token ? csrfManager.consumeToken(token) : false;
};