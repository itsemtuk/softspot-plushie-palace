
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
import SearchPage from './pages/SearchPage';
import UserProfile from './pages/UserProfile';
import { ClerkProvider } from '@clerk/clerk-react';
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from '@clerk/clerk-react';
import { SignIn } from "@clerk/clerk-react";
import { SignUp } from "@clerk/clerk-react";
import { Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { ClerkButtonComponent } from './components/navigation/user-button/ClerkIntegration';
import AboutWithSocialMedia from './pages/AboutWithSocialMedia';
import Users from './pages/Users';
import NotificationsPage from './pages/NotificationsPage';

// Use the provided Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_bm90YWJsZS1naXJhZmZlLTE2LmNsZXJrLmFjY291bnRzLmRldiQ";

function App() {
  return (
    <Router>
      <div className="App">
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
          <ClerkLoading>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-softspot-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading...</p>
              </div>
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            <Routes>
              {/* Auth routes - accessible when signed out */}
              <Route path="/sign-in" element={
                <SignedOut>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
                  </div>
                </SignedOut>
              } />
              <Route path="/sign-up" element={
                <SignedOut>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
                  </div>
                </SignedOut>
              } />
              
              {/* Public routes - accessible to all */}
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Index />} />
              <Route path="/about" element={<AboutWithSocialMedia />} />
              
              {/* Protected routes - require authentication */}
              <Route path="/feed" element={
                <SignedIn>
                  <Feed />
                </SignedIn>
              } />
              <Route path="/marketplace" element={
                <SignedIn>
                  <Marketplace />
                </SignedIn>
              } />
              <Route path="/sell" element={
                <SignedIn>
                  <MainLayout>
                    <SellItemPage />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/search" element={
                <SignedIn>
                  <SearchPage />
                </SignedIn>
              } />
              <Route path="/discover" element={
                <SignedIn>
                  <SearchPage />
                </SignedIn>
              } />
              <Route path="/profile" element={
                <SignedIn>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/profile/:username" element={
                <SignedIn>
                  <UserProfile />
                </SignedIn>
              } />
              <Route path="/user/:username" element={
                <SignedIn>
                  <UserProfile />
                </SignedIn>
              } />
              <Route path="/settings" element={
                <SignedIn>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/messages" element={
                <SignedIn>
                  <Messages />
                </SignedIn>
              } />
              <Route path="/notifications" element={
                <SignedIn>
                  <NotificationsPage />
                </SignedIn>
              } />
              <Route path="/users" element={
                <SignedIn>
                  <MainLayout>
                    <Users />
                  </MainLayout>
                </SignedIn>
              } />
              
              {/* Redirect signed out users to home, not sign in */}
              <Route path="*" element={
                <SignedOut>
                  <Index />
                </SignedOut>
              } />
              
              {/* 404 for signed in users */}
              <Route path="*" element={
                <SignedIn>
                  <NotFound />
                </SignedIn>
              } />
            </Routes>
            <ClerkButtonComponent />
          </ClerkLoaded>
        </ClerkProvider>
      </div>
    </Router>
  );
}

export default App;
