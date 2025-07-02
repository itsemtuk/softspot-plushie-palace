
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Check if Clerk publishable key is available
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const renderWithClerk = async () => {
  try {
    const { ClerkProvider } = await import('@clerk/clerk-react');
    
    if (!CLERK_PUBLISHABLE_KEY) {
      throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
    }
    
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <ClerkProvider 
          publishableKey={CLERK_PUBLISHABLE_KEY}
          afterSignInUrl="/feed"
          afterSignUpUrl="/onboarding"
        >
          <App />
        </ClerkProvider>
      </React.StrictMode>
    );
  } catch (error) {
    console.warn('Failed to load Clerk, rendering without authentication:', error);
    renderWithoutClerk();
  }
};

const renderWithoutClerk = () => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

if (CLERK_PUBLISHABLE_KEY) {
  console.log("Clerk publishable key found, initializing with authentication");
  renderWithClerk();
} else {
  console.warn('No Clerk publishable key found, rendering without authentication');
  renderWithoutClerk();
}
