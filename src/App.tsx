
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Feed from "@/pages/Feed";
import Discover from "@/pages/Discover";
import Profile from "@/pages/Profile";
import UserProfile from "@/pages/UserProfile";  
import EditProfile from "@/pages/EditProfile";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import Messaging from "@/pages/Messaging";
import SellItemPageFixed from "@/pages/SellItemPageFixed";
import Marketplace from "@/pages/Marketplace";
import CheckoutPage from "@/pages/CheckoutPage";
import NotificationsPage from "@/pages/NotificationsPage";
import WishlistPage from "@/pages/WishlistPage";
import BrandPage from "@/pages/BrandPage";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import AuthBoundary from "@/components/auth/AuthBoundary";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Index />,
      errorElement: <NotFound />,
    },
    {
      path: "/sign-in",
      element: <ProtectedRoute requireAuth={false}><SignIn /></ProtectedRoute>,
    },
    {
      path: "/sign-up",
      element: <ProtectedRoute requireAuth={false}><SignUp /></ProtectedRoute>,
    },
    {
      path: "/marketplace",
      element: <Marketplace />,
    },
    {
      path: "/brand/:brandName",
      element: <BrandPage />,
    },
    {
      path: "/feed",
      element: <AuthBoundary><Feed /></AuthBoundary>,
    },
    {
      path: "/discover",
      element: <AuthBoundary><Discover /></AuthBoundary>,
    },
    {
      path: "/profile",
      element: <AuthBoundary><Profile /></AuthBoundary>,
    },
    {
      path: "/user/:userId",
      element: <AuthBoundary><UserProfile /></AuthBoundary>,
    },
    {
      path: "/edit-profile",
      element: <AuthBoundary><EditProfile /></AuthBoundary>,
    },
    {
      path: "/settings",
      element: <AuthBoundary><Settings /></AuthBoundary>,
    },
    {
      path: "/messaging",
      element: <AuthBoundary><Messaging /></AuthBoundary>,
    },
    {
      path: "/messages",
      element: <AuthBoundary><Messaging /></AuthBoundary>,
    },
    {
      path: "/sell",
      element: <AuthBoundary><SellItemPageFixed /></AuthBoundary>,
    },
    {
      path: "/checkout",
      element: <AuthBoundary><CheckoutPage /></AuthBoundary>,
    },
    {
      path: "/notifications",
      element: <AuthBoundary><NotificationsPage /></AuthBoundary>,
    },
    {
      path: "/wishlist",
      element: <AuthBoundary><WishlistPage /></AuthBoundary>,
    },
  ],
  {
    basename: "/",
  }
);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
