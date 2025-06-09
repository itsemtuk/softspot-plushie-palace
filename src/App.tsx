
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { ClerkProvider } from '@clerk/clerk-react';

// Import all pages
import Index from "@/pages/Index";
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";
import UserProfile from "@/pages/UserProfile";
import Marketplace from "@/pages/Marketplace";
import SearchPage from "@/pages/SearchPage";
import SellItemPage from "@/pages/SellItemPage";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import Settings from "@/pages/Settings";
import EditProfile from "@/pages/EditProfile";
import Onboarding from "@/pages/Onboarding";
import Messages from "@/pages/Messages";
import NotificationsPage from "@/pages/NotificationsPage";
import WishlistPage from "@/pages/WishlistPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Get Clerk publishable key from environment
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="softspot-theme">
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={clerkPubKey || ''}>
          <NotificationsProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:userId" element={<UserProfile />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/marketplace/sell" element={<SellItemPage />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/edit-profile" element={<EditProfile />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </Router>
          </NotificationsProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
