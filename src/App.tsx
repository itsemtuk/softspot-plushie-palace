
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ClerkProvider } from "@clerk/clerk-react";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { useUserSync } from "@/hooks/useUserSync";
import { useEffect } from "react";

// Pages
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import BrandPage from "./pages/BrandPage";
import About from "./pages/About";
import Notifications from "./pages/Notifications";
import MobileMarketplace from "./pages/MobileMarketplace";
import MobileWishlist from "./pages/MobileWishlist";
import MobileMessages from "./pages/MobileMessages";
import Marketplace from "./pages/Marketplace";

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = "pk_test_bm90YWJsZS1naXJhZmZlLTE2LmNsZXJrLmFjY291bnRzLmRldiQ";

function AppContent() {
  const { synced, error } = useUserSync();

  useEffect(() => {
    if (error) {
      console.warn('User sync error:', error);
    } else if (synced) {
      console.log('User successfully synced to backend');
    }
  }, [synced, error]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/user/:username" element={<UserProfile />} />
      <Route path="/marketplace" element={<MobileMarketplace />} />
      <Route path="/users" element={<Users />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/brand/:brandId" element={<BrandPage />} />
      <Route path="/wishlist" element={<MobileWishlist />} />
      <Route path="/messages" element={<MobileMessages />} />
      <Route path="/about" element={<About />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <TooltipProvider>
            <NotificationsProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </NotificationsProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
