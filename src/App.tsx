
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import UserProfile from "./pages/UserProfile";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Onboarding from "./pages/Onboarding";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import SearchPage from "./pages/SearchPage";
import NotificationsPage from "./pages/Notifications";
import MobileMessages from "./pages/MobileMessages";
import MobileWishlist from "./pages/MobileWishlist";
import MobileMarketplace from "./pages/MobileMarketplace";
import Marketplace from "./pages/Marketplace";
import SellItem from "./pages/SellItem";
import About from "./pages/About";
import Users from "./pages/Users";
import BrandPage from "./pages/BrandPage";
import EnhancedSellItem from "./pages/EnhancedSellItem";
import EnhancedMessages from "./pages/EnhancedMessages";
import { ClerkUserSync } from "@/components/auth/ClerkUserSync";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { useIsMobile } from "@/hooks/use-mobile";

function App() {
  const isMobile = useIsMobile();
  
  return (
    <EnhancedErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/discover" element={<SearchPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/about" element={<About />} />
            <Route path="/users" element={<Users />} />
            <Route path="/messages" element={<EnhancedMessages />} />
            <Route path="/messages-old" element={<MobileMessages />} />
            <Route path="/wishlist" element={<MobileWishlist />} />
            <Route path="/marketplace" element={isMobile ? <MobileMarketplace /> : <Marketplace />} />
            <Route path="/marketplace/brands/:brandId" element={<BrandPage />} />
            <Route path="/marketplace/sell" element={<SellItem />} />
            <Route path="/marketplace/sell-enhanced" element={<EnhancedSellItem />} />
            <Route path="/sell" element={<EnhancedSellItem />} />
          </Routes>
          <Toaster />
          <ClerkUserSync />
        </div>
      </Router>
    </EnhancedErrorBoundary>
  );
}

export default App;
