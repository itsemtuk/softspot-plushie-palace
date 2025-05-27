
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
      path: "/feed",
      element: <ProtectedRoute><Feed /></ProtectedRoute>,
    },
    {
      path: "/discover",
      element: <ProtectedRoute><Discover /></ProtectedRoute>,
    },
    {
      path: "/profile",
      element: <ProtectedRoute><Profile /></ProtectedRoute>,
    },
    {
      path: "/user/:userId",
      element: <ProtectedRoute><UserProfile /></ProtectedRoute>,  
    },
    {
      path: "/edit-profile",
      element: <ProtectedRoute><EditProfile /></ProtectedRoute>,
    },
    {
      path: "/settings",
      element: <ProtectedRoute><Settings /></ProtectedRoute>,
    },
    {
      path: "/messaging",
      element: <ProtectedRoute><Messaging /></ProtectedRoute>,
    },
    {
      path: "/messages",
      element: <ProtectedRoute><Messaging /></ProtectedRoute>,
    },
    {
      path: "/sell",
      element: <ProtectedRoute><SellItemPageFixed /></ProtectedRoute>,
    },
    {
      path: "/marketplace",
      element: <Marketplace />,
    },
    {
      path: "/checkout",
      element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>,
    },
    {
      path: "/notifications",
      element: <ProtectedRoute><NotificationsPage /></ProtectedRoute>,
    },
    {
      path: "/wishlist",
      element: <ProtectedRoute><WishlistPage /></ProtectedRoute>,
    },
    {
      path: "/brand/:brandName",
      element: <BrandPage />,
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
