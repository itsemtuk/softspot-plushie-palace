import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding, { OnboardingRoute } from "./pages/Onboarding";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Marketplace from "./pages/Marketplace";
import BrandPage from "./pages/BrandPage";
import MessagingPage from "./pages/MessagingPage";
import WishlistPage from "./pages/WishlistPage";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Discover from "./pages/Discover";
import Footer from "./components/Footer";
import SellItemPage from "./pages/SellItemPage";
import About from "./pages/About";
import PostPage from "./pages/PostPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Use a fixed publishable key for development
const PUBLISHABLE_KEY = "pk_test_bm90YWJsZS1naXJhZmZlLTE2LmNsZXJrLmFjY291bnRzLmRldiQ";
const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);
  
  // Public routes that don't require onboarding completion
  const publicRoutes = ['/sign-in', '/sign-up', '/onboarding', '/', '/post'];

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in/*" element={<SignIn />} />
        <Route path="/sign-up/*" element={<SignUp />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/about" element={<About />} />
        <Route path="/post/:postId" element={<PostPage />} />
        
        {/* Protected routes that require onboarding completion */}
        <Route path="/settings" element={
          <OnboardingRoute>
            <Settings />
          </OnboardingRoute>
        } />
        <Route path="/profile" element={
          <OnboardingRoute>
            <Profile />
          </OnboardingRoute>
        } />
        <Route path="/feed" element={
          <OnboardingRoute>
            <Feed />
          </OnboardingRoute>
        } />
        <Route path="/discover" element={
          <OnboardingRoute>
            <Discover />
          </OnboardingRoute>
        } />
        <Route path="/marketplace" element={
          <OnboardingRoute>
            <Marketplace />
          </OnboardingRoute>
        } />
        <Route path="/marketplace/sell" element={
          <OnboardingRoute>
            <SellItemPage />
          </OnboardingRoute>
        } />
        <Route path="/brand/:brandId" element={
          <OnboardingRoute>
            <BrandPage />
          </OnboardingRoute>
        } />
        <Route path="/messages" element={
          <OnboardingRoute>
            <MessagingPage />
          </OnboardingRoute>
        } />
        <Route path="/wishlist" element={
          <OnboardingRoute>
            <WishlistPage />
          </OnboardingRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <NotificationsProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
            <Toaster />
          </NotificationsProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
