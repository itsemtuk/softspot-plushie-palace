
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Check if Clerk publishable key is available
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_bm90YWJsZS1naXJhZmZlLTE2LmNsZXJrLmFjY291bnRzLmRldiQ';

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

// Import Clerk directly for stable integration
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SecurityProvider } from "@/components/security/SecurityProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SecurityProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ClerkProvider 
          publishableKey={CLERK_PUBLISHABLE_KEY}
          signInFallbackRedirectUrl="/feed"
          signUpFallbackRedirectUrl="/onboarding"
        >
          <App />
        </ClerkProvider>
      </ThemeProvider>
    </SecurityProvider>
  </React.StrictMode>
);
