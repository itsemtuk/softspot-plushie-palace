
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Check if Clerk publishable key is available
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Only import and use Clerk if the key is available
const renderWithClerk = async () => {
  try {
    const { ClerkProvider } = await import('@clerk/clerk-react');
    
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
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
  renderWithClerk();
} else {
  console.warn('No Clerk publishable key found, rendering without authentication');
  renderWithoutClerk();
}
