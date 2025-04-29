
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from '@/components/ui/toaster';
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

function App() {
  // Check if Clerk has a valid publishable key
  const isClerkConfigured = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && 
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.startsWith('pk_') && 
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== "pk_test_valid-test-key-for-dev-only";

  // Define routes once to avoid duplication
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

  // Conditionally wrap with NotificationsProvider
  const appContent = (
    <PostDialogProvider>
      <Router>
        {appRoutes}
        <CloudSyncStatus />
        <Toaster />
      </Router>
    </PostDialogProvider>
  );

  // Use NotificationsProvider only if Clerk is configured
  const wrappedAppContent = isClerkConfigured ? (
    <NotificationsProvider>
      {appContent}
    </NotificationsProvider>
  ) : (
    appContent
  );

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {wrappedAppContent}
    </ThemeProvider>
  );
}

export default App;
