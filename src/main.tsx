
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Check if Clerk is configured
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && 
  PUBLISHABLE_KEY.startsWith('pk_') && 
  PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

// Create the root element
const root = createRoot(document.getElementById("root")!);

// Only try to use Clerk if configured
if (isClerkConfigured) {
  // Dynamic import to avoid errors when Clerk is not available
  import('@clerk/clerk-react')
    .then(({ ClerkProvider }) => {
      // When successful, store a flag in localStorage to indicate user is using Clerk
      localStorage.setItem('usingClerk', 'true');
      
      root.render(
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <App />
        </ClerkProvider>
      );
    })
    .catch((error) => {
      console.error("Failed to load Clerk:", error);
      localStorage.removeItem('usingClerk');
      // Render without Clerk if import fails
      root.render(<App />);
    });
} else {
  localStorage.removeItem('usingClerk');
  // Render without Clerk if not configured
  root.render(<App />);
}
