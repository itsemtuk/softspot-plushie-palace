
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "@/components/ui/theme-provider";

import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Discover from "./pages/Discover";
import Marketplace from "./pages/Marketplace";
import Users from "./pages/Users";
import Messages from "./pages/Messages";
import SellItemPage from "./pages/SellItemPage";
import CheckoutPage from "./pages/CheckoutPage";
import PostPage from "./pages/PostPage";

const queryClient = new QueryClient();

// Use the hardcoded Clerk publishable key
const clerkPubKey = "pk_test_bm90YWJsZS1naXJhZmZlLTE2LmNsZXJrLmFjY291bnRzLmRldiQ";

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="softspot-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/users" element={<Users />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/sell" element={<SellItemPage />} />
                <Route path="/checkout/:id" element={<CheckoutPage />} />
                <Route path="/post/:id" element={<PostPage />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
