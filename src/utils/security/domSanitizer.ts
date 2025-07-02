/**
 * DOM sanitization utilities to prevent XSS attacks
 */

/**
 * Safely escapes HTML characters to prevent XSS
 */
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Safely creates a DOM element with text content (prevents XSS)
 */
export const createSafeElement = (
  tagName: string,
  textContent: string,
  className?: string
): HTMLElement => {
  const element = document.createElement(tagName);
  element.textContent = textContent; // Uses textContent instead of innerHTML
  if (className) {
    element.className = className;
  }
  return element;
};

/**
 * Safely replaces element content without using innerHTML
 */
export const safeReplaceElement = (
  parent: HTMLElement,
  newElement: HTMLElement
): void => {
  // Clear parent content safely
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  // Add new element
  parent.appendChild(newElement);
};

/**
 * Validates and sanitizes image URLs
 */
export const sanitizeImageUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Only allow http, https, and data URLs
    if (!['http:', 'https:', 'data:'].includes(urlObj.protocol)) {
      throw new Error('Invalid protocol');
    }
    return url;
  } catch {
    // Return placeholder for invalid URLs
    return '/placeholder.svg';
  }
};

/**
 * Validates username/display name input
 */
export const sanitizeDisplayName = (name: string): string => {
  // Remove any HTML tags and limit length
  const cleaned = name.replace(/<[^>]*>/g, '').trim();
  return cleaned.slice(0, 50); // Limit to 50 characters
};