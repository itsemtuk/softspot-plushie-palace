
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from '@/components/ui/toaster';
import { ClerkProvider } from '@clerk/clerk-react';
import Index from '@/pages/Index';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Feed from '@/pages/Feed';
import Marketplace from '@/pages/Marketplace';
import Profile from '@/pages/Profile';
import PostPage from '@/pages/PostPage';
import Settings from '@/pages/Settings';
import Onboarding from '@/pages/Onboarding';
import MessagingPage from '@/pages/MessagingPage';
import NotFound from '@/pages/NotFound';
import SellItemPage from './pages/SellItemPage';
import WishlistPage from './pages/WishlistPage';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import About from './pages/About';
import NotificationsPage from './pages/NotificationsPage';
import BrandPage from './pages/BrandPage';
import Discover from './pages/Discover';
import { CloudSyncStatus } from './components/CloudSyncStatus';
import { PostDialogProvider } from './hooks/use-post-dialog';

// Get Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_valid-test-key-for-dev-only";

function App() {
  // Check if Clerk has a valid publishable key
  const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY.startsWith('pk_') && PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

  // Create the app content once so we don't repeat code
  const renderAppContent = (withNotificationsProvider = false) => {
    const appRoutes = (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sign-in/*" element={<SignIn />} />
        <Route path="/sign-up/*" element={<SignUp />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/marketplace/*" element={<Marketplace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/posts/:postId" element={<PostPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/messages" element={<MessagingPage />} />
        <Route path="/sell" element={<SellItemPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/brand/:brandId" element={<BrandPage />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
    
    const appContent = (
      <PostDialogProvider>
        <Router>
          {appRoutes}
          <CloudSyncStatus />
          <Toaster />
        </Router>
      </PostDialogProvider>
    );

    // Wrap with notifications provider if needed
    if (withNotificationsProvider) {
      return <NotificationsProvider>{appContent}</NotificationsProvider>;
    }
    
    return appContent;
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {isClerkConfigured ? (
        // If Clerk is configured, wrap everything with ClerkProvider 
        // AND NotificationsProvider, which depends on Clerk
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          {renderAppContent(true)}
        </ClerkProvider>
      ) : (
        // Fallback without Clerk when no valid key is provided
        // Also don't use NotificationsProvider since it depends on Clerk
        renderAppContent(false)
      )}
    </ThemeProvider>
  );
}

export default App;
