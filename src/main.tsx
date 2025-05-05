
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
    const currentVersion = '1.0.3'; // Increment to force cache clear
    
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
    
    // Store clerk configuration status - must be done after clearing storage
    localStorage.setItem('usingClerk', isClerkConfigured ? 'true' : 'false');
    
    console.log("Storage prepared successfully, Clerk configured:", isClerkConfigured, "Key available:", !!PUBLISHABLE_KEY);
  } catch (e) {
    console.error("Error preparing storage:", e);
  }
};

prepareStorage();

// Render app with or without Clerk based on configuration
if (isClerkConfigured) {
  console.log("Rendering app with ClerkProvider");
  root.render(
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#7e69ab",
          colorText: "#333333",
        },
        elements: {
          socialButtonsBlockButton: "border border-gray-300 text-gray-700 hover:bg-gray-50",
          socialButtonsIconButton: "border border-gray-300 hover:bg-gray-50",
          formButtonPrimary: "bg-softspot-500 hover:bg-softspot-600",
          footerActionLink: "text-softspot-500 hover:text-softspot-600",
          card: "shadow-none",
          identityPreview: "bg-softspot-50",
          formFieldInput: "border-softspot-200 focus:border-softspot-400 focus:ring-softspot-300"
        },
        layout: {
          socialButtonsVariant: "iconButton",
          socialButtonsPlacement: "bottom"
        }
      }}
    >
      <App />
    </ClerkProvider>
  );
} else {
  console.warn("Clerk is not properly configured. Rendering app without Clerk. Check your environment variables.");
  root.render(<App />);
}

// Add typings for window object
declare global {
  interface Window {
    isStoragePrepared?: boolean;
  }
}
