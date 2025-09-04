
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { getSecurityConfig } from "@/config/security";

// Clerk publishable key - using secure configuration
const { clerkPublishableKey } = getSecurityConfig();

// Import Clerk directly for stable integration
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import { SecurityEnforcer } from "@/components/security/SecurityEnforcer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SecurityProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <ClerkProvider 
          publishableKey={clerkPublishableKey}
          signInFallbackRedirectUrl="/feed"
          signUpFallbackRedirectUrl="/onboarding"
        >
          <SecurityEnforcer>
            <App />
          </SecurityEnforcer>
        </ClerkProvider>
      </ThemeProvider>
    </SecurityProvider>
  </React.StrictMode>
);
