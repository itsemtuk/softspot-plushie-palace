
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && 
  PUBLISHABLE_KEY.startsWith('pk_') && 
  PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

// Only import ClerkProvider if Clerk is configured
let ClerkProvider: React.ComponentType<{children: React.ReactNode, publishableKey: string}> | null = null;

// Use dynamic import to avoid errors when Clerk is not configured
if (isClerkConfigured) {
  try {
    // This dynamic import technique helps prevent build-time errors
    const clerk = await import('@clerk/clerk-react');
    ClerkProvider = clerk.ClerkProvider;
  } catch (error) {
    console.error("Failed to import ClerkProvider:", error);
  }
}

// Create the root element once
const root = createRoot(document.getElementById("root")!);

// Render the app with or without ClerkProvider based on configuration
if (isClerkConfigured && ClerkProvider) {
  root.render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  );
} else {
  // Render without Clerk if not configured
  root.render(<App />);
}
