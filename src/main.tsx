
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

// Check if Clerk is configured
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && 
  PUBLISHABLE_KEY.startsWith('pk_') && 
  PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

// Create the root element
const root = createRoot(document.getElementById("root")!);

// Reset cache and prepare storage
const prepareStorage = () => {
  try {
    // Get current cache version - this helps manage breaking changes
    const cacheVersion = localStorage.getItem('cacheVersion') || '0';
    const currentVersion = '1.0'; // Update when making breaking cache changes
    
    // Check for version mismatch or corrupted state
    if (cacheVersion !== currentVersion) {
      console.log(`Cache version mismatch: ${cacheVersion} vs ${currentVersion}. Clearing cache.`);
      // Clear storage to prevent stale data issues
      localStorage.clear();
      sessionStorage.clear();
      // Set the new cache version
      localStorage.setItem('cacheVersion', currentVersion);
    }
    
    // Set timestamp for cache invalidation
    localStorage.setItem('lastSyncTimestamp', new Date().toISOString());
    
    // Mark storage as prepared
    window.isStoragePrepared = true;
    
    console.log("Storage prepared successfully");
  } catch (e) {
    console.error("Error preparing storage:", e);
  }
};

prepareStorage();

// Render app with or without Clerk based on configuration
if (isClerkConfigured) {
  console.log("Rendering app with ClerkProvider");
  root.render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  );
  // Store flag in localStorage to indicate user is using Clerk
  localStorage.setItem('usingClerk', 'true');
} else {
  console.log("Clerk is not properly configured. Rendering app without Clerk.");
  root.render(<App />);
  localStorage.removeItem('usingClerk');
}

// Add typings for window object
declare global {
  interface Window {
    isStoragePrepared?: boolean;
  }
}
