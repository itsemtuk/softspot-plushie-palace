import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import UserProfile from "./pages/UserProfile";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import MobileMessages from "./pages/MobileMessages";
import MobileWishlist from "./pages/MobileWishlist";
import MobileMarketplace from "./pages/MobileMarketplace";
import Marketplace from "./pages/Marketplace";
import SellItem from "./pages/SellItem";
import About from "./pages/About";
import Users from "./pages/Users";
import { ClerkButtonComponent } from "@/components/navigation/user-button/ClerkIntegration";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { useIsMobile } from "@/hooks/use-mobile";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing Clerk Publishable Key - authentication features may not work");
}

function AppContent() {
  const isMobile = useIsMobile();
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/messages" element={<MobileMessages />} />
        <Route path="/wishlist" element={<MobileWishlist />} />
        <Route path="/marketplace" element={isMobile ? <MobileMarketplace /> : <Marketplace />} />
        <Route path="/marketplace/sell" element={<SellItem />} />
        <Route path="/sell" element={<SellItem />} />
      </Routes>
      <Toaster />
      <ClerkButtonComponent />
    </div>
  );
}

function App() {
  return (
    <EnhancedErrorBoundary>
      <Router>
        {PUBLISHABLE_KEY ? (
          <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <AppContent />
          </ClerkProvider>
        ) : (
          <AppContent />
        )}
      </Router>
    </EnhancedErrorBoundary>
  );
}

export default App;
