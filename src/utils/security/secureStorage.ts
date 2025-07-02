/**
 * Secure storage utilities with encryption for sensitive data
 */

// Simple encryption/decryption for localStorage (not for production secrets)
class SimpleEncryption {
  private static readonly key = 'softspot-app-key';
  
  static encrypt(text: string): string {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch {
      return text; // Fallback to plain text if encoding fails
    }
  }
  
  static decrypt(encodedText: string): string {
    try {
      return decodeURIComponent(escape(atob(encodedText)));
    } catch {
      return encodedText; // Fallback to original if decoding fails
    }
  }
}

/**
 * Secure storage wrapper for localStorage
 */
export class SecureStorage {
  // Non-sensitive data (can be stored as plain text)
  private static readonly plainTextKeys = [
    'theme',
    'language',
    'ui-preferences',
    'view-mode'
  ];
  
  // Sensitive data that should be encrypted
  private static readonly sensitiveKeys = [
    'user-preferences',
    'search-history',
    'draft-posts'
  ];
  
  static setItem(key: string, value: string): void {
    try {
      if (this.sensitiveKeys.includes(key)) {
        localStorage.setItem(key, SimpleEncryption.encrypt(value));
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Failed to store data securely:', error);
    }
  }
  
  static getItem(key: string): string | null {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;
      
      if (this.sensitiveKeys.includes(key)) {
        return SimpleEncryption.decrypt(value);
      }
      return value;
    } catch (error) {
      console.warn('Failed to retrieve data securely:', error);
      return null;
    }
  }
  
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove data:', error);
    }
  }
  
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }
  
  // Clean up old/expired data
  static cleanup(): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('temp-')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => this.removeItem(key));
    } catch (error) {
      console.warn('Failed to cleanup storage:', error);
    }
  }
}

/**
 * Session management utilities
 */
export class SessionManager {
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  
  static setSession(data: any): void {
    const sessionData = {
      ...data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.SESSION_TIMEOUT
    };
    
    SecureStorage.setItem('user-session', JSON.stringify(sessionData));
  }
  
  static getSession(): any | null {
    try {
      const sessionString = SecureStorage.getItem('user-session');
      if (!sessionString) return null;
      
      const sessionData = JSON.parse(sessionString);
      
      // Check if session is expired
      if (Date.now() > sessionData.expiresAt) {
        this.clearSession();
        return null;
      }
      
      return sessionData;
    } catch (error) {
      console.warn('Failed to get session:', error);
      this.clearSession();
      return null;
    }
  }
  
  static clearSession(): void {
    SecureStorage.removeItem('user-session');
  }
  
  static refreshSession(): void {
    const session = this.getSession();
    if (session) {
      this.setSession(session);
    }
  }
}

// Initialize cleanup on app start
if (typeof window !== 'undefined') {
  SecureStorage.cleanup();
}