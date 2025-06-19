
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

function App() {
  return (
    <Router>
      <div className="App">
        <ClerkProvider publishableKey="pk_test_Y2xlaXJrLmRldnwwY2EzMzdkOC00ZDA0LTRhNzktYjE4MC00Zjk5NDQ0ZDA4NmI=">
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
