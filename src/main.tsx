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

// Ensure storage is ready before rendering
const prepareStorage = () => {
  // Check for stale data
  try {
    const lastSyncStr = localStorage.getItem('lastSyncTimestamp');
    if (lastSyncStr) {
      const lastSync = new Date(lastSyncStr);
      const now = new Date();
      const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
      
      // Clear session storage on fresh load and if data is over 24 hours old
      if (hoursSinceSync > 24) {
        console.log("Clearing stale data older than 24 hours");
        sessionStorage.clear();
        localStorage.setItem('lastSyncTimestamp', new Date().toISOString());
      }
    } else {
      // Set initial sync timestamp if none exists
      localStorage.setItem('lastSyncTimestamp', new Date().toISOString());
    }
    
    // Mark storage as prepared
    window.isStoragePrepared = true;
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
