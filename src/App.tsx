import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "@/pages/Index";
import Feed from "@/pages/Feed";
import Discover from "@/pages/Discover";
import Profile from "@/pages/Profile";
import UserProfilePage from "@/pages/UserProfilePage";
import EditProfile from "@/pages/EditProfile";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import Messaging from "@/pages/Messaging";
import SellItemPage from "@/pages/SellItemPage";
import Marketplace from "@/pages/Marketplace";
import CheckoutPage from "@/pages/CheckoutPage";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Index />,
      errorElement: <NotFound />,
    },
    {
      path: "/feed",
      element: <Feed />,
    },
    {
      path: "/discover",
      element: <Discover />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/user/:userId",
      element: <UserProfilePage />,
    },
    {
      path: "/edit-profile",
      element: <EditProfile />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/messaging",
      element: <Messaging />,
    },
    {
      path: "/sell",
      element: <SellItemPage />,
    },
    {
      path: "/marketplace",
      element: <Marketplace />,
    },
    {
      path: "/checkout",
      element: <CheckoutPage />,
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
