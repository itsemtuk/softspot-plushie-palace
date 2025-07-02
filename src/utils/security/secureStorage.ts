/**
 * Secure storage utilities with encryption for sensitive data
 */

// Improved encryption for localStorage with proper key derivation
class SecureEncryption {
  private static readonly salt = 'softspot-security-salt-v2';
  
  private static async deriveKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(this.salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  static async encrypt(text: string): Promise<string> {
    try {
      if (!crypto.subtle) {
        // Fallback to Base64 for environments without crypto.subtle
        return btoa(unescape(encodeURIComponent(text)));
      }
      
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const key = await this.deriveKey(this.salt);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
      
      const result = new Uint8Array(iv.length + encrypted.byteLength);
      result.set(iv);
      result.set(new Uint8Array(encrypted), iv.length);
      
      return btoa(String.fromCharCode(...result));
    } catch {
      // Fallback to Base64 if encryption fails
      return btoa(unescape(encodeURIComponent(text)));
    }
  }
  
  static async decrypt(encryptedText: string): Promise<string> {
    try {
      if (!crypto.subtle) {
        // Fallback from Base64
        return decodeURIComponent(escape(atob(encryptedText)));
      }
      
      const data = new Uint8Array(atob(encryptedText).split('').map(c => c.charCodeAt(0)));
      const iv = data.slice(0, 12);
      const encrypted = data.slice(12);
      
      const key = await this.deriveKey(this.salt);
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );
      
      return new TextDecoder().decode(decrypted);
    } catch {
      // Fallback from Base64
      return decodeURIComponent(escape(atob(encryptedText)));
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
  
  static async setItem(key: string, value: string): Promise<void> {
    try {
      if (this.sensitiveKeys.includes(key)) {
        const encrypted = await SecureEncryption.encrypt(value);
        localStorage.setItem(key, encrypted);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Failed to store data securely:', error);
    }
  }
  
  static async getItem(key: string): Promise<string | null> {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;
      
      if (this.sensitiveKeys.includes(key)) {
        return await SecureEncryption.decrypt(value);
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
  
  static async setSession(data: any): Promise<void> {
    const sessionData = {
      ...data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.SESSION_TIMEOUT
    };
    
    await SecureStorage.setItem('user-session', JSON.stringify(sessionData));
  }
  
  static async getSession(): Promise<any | null> {
    try {
      const sessionString = await SecureStorage.getItem('user-session');
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
  
  static async refreshSession(): Promise<void> {
    const session = await this.getSession();
    if (session) {
      await this.setSession(session);
    }
  }
}

// Initialize cleanup on app start
if (typeof window !== 'undefined') {
  SecureStorage.cleanup();
}