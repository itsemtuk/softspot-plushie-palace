
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Index from "./pages/Index";
import LoadingSpinner from "./components/common/LoadingSpinner";

// Lazy load pages for better performance
const Feed = lazy(() => import("./pages/Feed"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const BrandPage = lazy(() => import("./pages/BrandPage"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SellItemPage = lazy(() => import("./pages/SellItemPage"));
const Messages = lazy(() => import("./pages/Messages"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));

const queryClient = new QueryClient();

const PUBLISHABLE_KEY = "pk_test_bm90YWJsZS1naXJhZmZlLTE2LmNsZXJrLmFjY291bnRzLmRldiQ";

// Error component for missing publishable key
const ErrorComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Configuration Required</h3>
        <div className="mt-2 text-sm text-gray-500">
          <p>The Clerk publishable key is missing.</p>
          <p className="mt-2">Please set the <code className="bg-gray-100 px-1 rounded">VITE_CLERK_PUBLISHABLE_KEY</code> environment variable.</p>
          <p className="mt-2">You can get your key from the <a href="https://go.clerk.com/lovable" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">Clerk Dashboard</a>.</p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  // If no publishable key is provided, show a helpful error message
  if (!PUBLISHABLE_KEY) {
    return <ErrorComponent />;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/marketplace/brands/:brandName" element={<BrandPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:userId" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/sign-in" element={<SignIn />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/sell" element={<SellItemPage />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/checkout/:id" element={<CheckoutPage />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
