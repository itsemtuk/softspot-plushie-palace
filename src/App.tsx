
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Marketplace from './pages/Marketplace';
import SellItemPage from './pages/SellItemPage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Feed from './pages/Feed';
import Messages from './pages/Messages';
import NotFound from './pages/NotFound';
import { ClerkProvider } from '@clerk/clerk-react';
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from '@clerk/clerk-react';
import { SignIn } from "@clerk/clerk-react";
import { SignUp } from "@clerk/clerk-react";
import { Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { ClerkButtonComponent } from './components/navigation/user-button/ClerkIntegration';
import AboutWithSocialMedia from './pages/AboutWithSocialMedia';
import Users from './pages/Users';

// Use the provided Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_bm90YWJsZS1naXJhZmZlLTE2LmNsZXJrLmFjY291bnRzLmRldiQ";

function App() {
  // Check if we have a valid Clerk key
  const hasValidClerkKey = CLERK_PUBLISHABLE_KEY !== "pk_test_placeholder" && 
                          CLERK_PUBLISHABLE_KEY && 
                          CLERK_PUBLISHABLE_KEY.startsWith('pk_');

  // If no valid Clerk key, render app without Clerk authentication
  if (!hasValidClerkKey) {
    console.warn('No valid Clerk publishable key found. Running without Clerk authentication.');
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/sign-in" element={
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Authentication Setup Required</h2>
                  <p className="text-gray-600">Please configure your Clerk publishable key to enable authentication.</p>
                </div>
              </div>
            } />
            <Route path="/sign-up" element={
              <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">Authentication Setup Required</h2>
                  <p className="text-gray-600">Please configure your Clerk publishable key to enable authentication.</p>
                </div>
              </div>
            } />
            <Route path="/" element={
              <MainLayout>
                <Index />
              </MainLayout>
            } />
            <Route path="/home" element={
              <MainLayout>
                <Index />
              </MainLayout>
            } />
            <Route path="/marketplace" element={
              <MainLayout>
                <Marketplace />
              </MainLayout>
            } />
            <Route path="/sell" element={
              <MainLayout>
                <SellItemPage />
              </MainLayout>
            } />
            <Route path="/profile/:username" element={
              <MainLayout>
                <Profile />
              </MainLayout>
            } />
            <Route path="/settings" element={
              <MainLayout>
                <Settings />
              </MainLayout>
            } />
            <Route path="/feed" element={
              <MainLayout>
                <Feed />
              </MainLayout>
            } />
            <Route path="/messages" element={
              <MainLayout>
                <Messages />
              </MainLayout>
            } />
            <Route path="/users" element={
              <MainLayout>
                <Users />
              </MainLayout>
            } />
            <Route path="*" element={<NotFound />} />
            <Route path="/about" element={<AboutWithSocialMedia />} />
          </Routes>
        </div>
      </Router>
    );
  }

  // Render with Clerk authentication if valid key is present
  return (
    <Router>
      <div className="App">
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
          <ClerkLoading>
            <div>Loading...</div>
          </ClerkLoading>
          <ClerkLoaded>
            <Routes>
              <Route path="/sign-in" element={
                <SignedOut>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <SignIn path="/sign-in" routing="path" />
                  </div>
                </SignedOut>
              } />
              <Route path="/sign-up" element={
                <SignedOut>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <SignUp path="/sign-up" routing="path" />
                  </div>
                </SignedOut>
              } />
              <Route path="/" element={
                <SignedIn>
                  <MainLayout>
                    <Index />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/home" element={
                <SignedIn>
                  <MainLayout>
                    <Index />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/marketplace" element={
                <SignedIn>
                  <MainLayout>
                    <Marketplace />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/sell" element={
                <SignedIn>
                  <MainLayout>
                    <SellItemPage />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/profile/:username" element={
                <SignedIn>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/settings" element={
                <SignedIn>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/feed" element={
                <SignedIn>
                  <MainLayout>
                    <Feed />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/messages" element={
                <SignedIn>
                  <MainLayout>
                    <Messages />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/users" element={
                <SignedIn>
                  <MainLayout>
                    <Users />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="*" element={<NotFound />} />
              <Route path="/about" element={<AboutWithSocialMedia />} />
            </Routes>
            <ClerkButtonComponent />
          </ClerkLoaded>
        </ClerkProvider>
      </div>
    </Router>
  );
}

export default App;
