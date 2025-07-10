/**
 * Enhanced security headers and CSP configuration
 */

export const applySecurityHeaders = () => {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.accounts.dev https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: http:",
    "media-src 'self' data: blob:",
    "connect-src 'self' https://evsaupqzqbynwkuszssm.supabase.co https://clerk.com https://*.clerk.accounts.dev wss://evsaupqzqbynwkuszssm.supabase.co",
    "frame-src 'self' https://challenges.cloudflare.com https://*.clerk.accounts.dev",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ');

  // Apply CSP via meta tag
  const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!existingCSP) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  }

  // Additional security headers via meta tags where possible
  const securityMetas = [
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'X-Frame-Options', content: 'DENY' },
    { httpEquiv: 'X-XSS-Protection', content: '1; mode=block' },
    { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
  ];

  securityMetas.forEach(({ httpEquiv, content }) => {
    const existing = document.querySelector(`meta[http-equiv="${httpEquiv}"]`);
    if (!existing) {
      const meta = document.createElement('meta');
      meta.httpEquiv = httpEquiv;
      meta.content = content;
      document.head.appendChild(meta);
    }
  });
};

/**
 * Validate origin for requests
 */
export const validateOrigin = (origin: string): boolean => {
  const allowedOrigins = [
    'https://preview--softspot-plushie-palace.lovable.app',
    'https://softspot-plushie-palace.lovable.app',
    window.location.origin
  ];
  
  return allowedOrigins.includes(origin);
};

/**
 * Security event logging
 */
export const logSecurityEvent = (event: string, details: Record<string, any> = {}) => {
  console.warn(`[SECURITY] ${event}:`, details);
  
  // In production, this would send to a security monitoring service
  if (import.meta.env.PROD) {
    // Could integrate with services like Sentry, LogRocket, etc.
  }
};