/**
 * Security monitoring and logging utilities
 */

export interface SecurityEvent {
  type: 'auth_attempt' | 'unauthorized_access' | 'input_validation_failure' | 'suspicious_activity' | 'rate_limit_exceeded';
  userId?: string;
  details: string;
  timestamp: number;
  userAgent?: string;
  ip?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityLogger {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 1000;
  
  log(event: Omit<SecurityEvent, 'timestamp' | 'userAgent'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    
    this.events.push(securityEvent);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Security Event]', securityEvent);
    }
    
    // For critical events, could send to monitoring service
    if (event.severity === 'critical') {
      this.reportCriticalEvent(securityEvent);
    }
  }
  
  private reportCriticalEvent(event: SecurityEvent): void {
    // In a real app, this would send to a monitoring service
    console.error('[CRITICAL SECURITY EVENT]', event);
    
    // Could also show user notification for certain events
    if (event.type === 'unauthorized_access') {
      // Show security warning to user
    }
  }
  
  getRecentEvents(count = 50): SecurityEvent[] {
    return this.events.slice(-count);
  }
  
  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }
  
  getSuspiciousActivity(): SecurityEvent[] {
    return this.events.filter(event => 
      event.severity === 'high' || event.severity === 'critical'
    );
  }
}

export const securityLogger = new SecurityLogger();

/**
 * Security monitoring hooks and utilities
 */
export const useSecurityMonitoring = () => {
  const logAuthAttempt = (success: boolean, userId?: string) => {
    securityLogger.log({
      type: 'auth_attempt',
      userId,
      details: success ? 'Successful authentication' : 'Failed authentication attempt',
      severity: success ? 'low' : 'medium'
    });
  };
  
  const logUnauthorizedAccess = (resource: string, userId?: string) => {
    securityLogger.log({
      type: 'unauthorized_access',
      userId,
      details: `Attempted to access ${resource} without authorization`,
      severity: 'high'
    });
  };
  
  const logInputValidationFailure = (field: string, value: string, userId?: string) => {
    securityLogger.log({
      type: 'input_validation_failure',
      userId,
      details: `Invalid input for ${field}: ${value.slice(0, 100)}...`,
      severity: 'medium'
    });
  };
  
  const logSuspiciousActivity = (details: string, userId?: string) => {
    securityLogger.log({
      type: 'suspicious_activity',
      userId,
      details,
      severity: 'high'
    });
  };
  
  const logRateLimitExceeded = (endpoint: string, userId?: string) => {
    securityLogger.log({
      type: 'rate_limit_exceeded',
      userId,
      details: `Rate limit exceeded for ${endpoint}`,
      severity: 'medium'
    });
  };
  
  return {
    logAuthAttempt,
    logUnauthorizedAccess,
    logInputValidationFailure,
    logSuspiciousActivity,
    logRateLimitExceeded
  };
};

/**
 * Content Security Policy helper
 */
export const applySecurityHeaders = (): void => {
  // This would typically be done server-side, but we can add some client-side protections
  
  // Prevent clickjacking
  if (window.self !== window.top) {
    window.top.location = window.self.location;
  }
  
  // Add security meta tags if they don't exist
  const addMetaTag = (name: string, content: string) => {
    if (!document.querySelector(`meta[name="${name}"]`)) {
      const meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    }
  };
  
  addMetaTag('referrer', 'strict-origin-when-cross-origin');
  addMetaTag('X-Content-Type-Options', 'nosniff');
  addMetaTag('X-Frame-Options', 'DENY');
};
