import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { AuthWrapper } from './components/auth/AuthWrapper';
import { useEffect } from 'react';
import { initAuthState } from './utils/auth/authState';
import { ClerkButtonComponent } from './components/navigation/user-button/ClerkIntegration';
import { supabase } from './utils/supabase/client';
import { toast } from './components/ui/use-toast';
import WaitlistPage from './pages/WaitlistPage';

function App() {
  // Use Clerk integration only when specified
  const isClerkConfigured = localStorage.getItem('usingClerk') === 'true';
  
  // Initialize auth state on app load
  useEffect(() => {
    // Check if we're using Clerk or Supabase
    const determineAuthProvider = async () => {
      // Check if we have a valid Supabase session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking Supabase session:", error);
      }
      
      // If we have a valid Supabase session, use Supabase auth
      if (data?.session) {
        console.log("Valid Supabase session found, using Supabase auth");
        localStorage.setItem('usingClerk', 'false');
        localStorage.setItem('authProvider', 'supabase');
      } else {
        // Otherwise, default to Clerk if not explicitly set
        if (localStorage.getItem('usingClerk') === null) {
          localStorage.setItem('usingClerk', 'true'); 
        }
      }
      
      // Initialize auth state
      await initAuthState();
    };
    
    determineAuthProvider();
    
    // Listen for storage events to keep authentication state in sync across tabs
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'authStatus' || event.key === 'currentUserId' || 
          event.key === 'cacheVersion' || event.key === 'usingClerk') {
        console.log('Auth state changed in another tab, syncing...');
        initAuthState();
      }
    };
    
    // Set up Supabase auth change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase auth state change:', event);
      
      if (event === 'SIGNED_IN' && session) {
        // Show toast for successful sign-in
        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${session.user.email || 'User'}!`,
        });
      } else if (event === 'SIGNED_OUT') {
        // Clear local auth state when signed out from Supabase
        if (localStorage.getItem('authProvider') === 'supabase') {
          initAuthState();
        }
      }
    });
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      subscription.unsubscribe();
    };
  }, []);

  // Define routes once to avoid duplication
  const appRoutes = (
    <Routes>
      {/* Set WaitlistPage as the main route */}
      <Route path="/" element={<WaitlistPage />} />
      
      {/* Move the old Index page to a different route for future use */}
      <Route path="/home" element={<Index />} />
      
      {/* Keep all other routes the same */}
      <Route path="/sign-in/*" element={
        <AuthWrapper requiresAuth={false} fallback={<Navigate to="/feed" replace />}>
          <SignIn />
        </AuthWrapper>
      } />
      <Route path="/sign-up/*" element={
        <AuthWrapper requiresAuth={false} fallback={<Navigate to="/feed" replace />}>
          <SignUp />
        </AuthWrapper>
      } />
      
      {/* Protected routes that require authentication */}
      <Route path="/feed" element={
        <AuthWrapper fallback={<SignIn />}>
          <Feed />
        </AuthWrapper>
      } />
      <Route path="/marketplace/*" element={
        <AuthWrapper fallback={<SignIn />}>
          <Marketplace />
        </AuthWrapper>
      } />
      <Route path="/profile" element={
        <AuthWrapper fallback={<SignIn />}>
          <Profile />
        </AuthWrapper>
      } />
      <Route path="/posts/:postId" element={<PostPage />} />
      <Route path="/settings" element={
        <AuthWrapper fallback={<SignIn />}>
          <Settings />
        </AuthWrapper>
      } />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/messages" element={
        <AuthWrapper fallback={<SignIn />}>
          <MessagingPage />
        </AuthWrapper>
      } />
      <Route path="/sell" element={
        <AuthWrapper fallback={<SignIn />}>
          <SellItemPage />
        </AuthWrapper>
      } />
      <Route path="/wishlist" element={
        <AuthWrapper fallback={<SignIn />}>
          <WishlistPage />
        </AuthWrapper>
      } />
      <Route path="/about" element={<About />} />
      <Route path="/notifications" element={
        <AuthWrapper fallback={<SignIn />}>
          <NotificationsPage />
        </AuthWrapper>
      } />
      <Route path="/brand/:brandId" element={<BrandPage />} />
      <Route path="/discover" element={
        <AuthWrapper fallback={<SignIn />}>
          <Discover />
        </AuthWrapper>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  // Add the global ClerkButtonComponent to ensure auth state is always tracked
  const globalAuthTracker = isClerkConfigured ? <ClerkButtonComponent /> : null;

  // Conditionally wrap with NotificationsProvider
  const appContent = (
    <PostDialogProvider>
      <Router>
        {globalAuthTracker}
        {appRoutes}
        <CloudSyncStatus />
        <Toaster />
      </Router>
    </PostDialogProvider>
  );

  // Use NotificationsProvider only if user is authenticated
  const wrappedAppContent = (
    <NotificationsProvider>
      {appContent}
    </NotificationsProvider>
  );

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {wrappedAppContent}
    </ThemeProvider>
  );
}

export default App;
