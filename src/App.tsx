import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import SellItem from './pages/SellItem';
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
import { MainLayout } from './layouts/MainLayout';
import { AuthenticationLayout } from './layouts/AuthenticationLayout';
import { ClerkButtonComponent } from './components/navigation/user-button/ClerkIntegration';
import AboutWithSocialMedia from './pages/AboutWithSocialMedia';

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
                  <AuthenticationLayout>
                    <SignIn path="/sign-in" routing="path" />
                  </AuthenticationLayout>
                </SignedOut>
              } />
              <Route path="/sign-up" element={
                <SignedOut>
                  <AuthenticationLayout>
                    <SignUp path="/sign-up" routing="path" />
                  </AuthenticationLayout>
                </SignedOut>
              } />
              <Route path="/" element={
                <SignedIn>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </SignedIn>
              } />
              <Route path="/home" element={
                <SignedIn>
                  <MainLayout>
                    <Home />
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
                    <SellItem />
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
              <Route path="*" element={<NotFound />} />
              <Route path="/" element={<Navigate to="/home" />} />
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
