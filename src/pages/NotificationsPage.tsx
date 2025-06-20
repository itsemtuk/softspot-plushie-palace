
import { Navbar } from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import NotificationsTab from "@/components/profile/NotificationsTab";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const NotificationsPage = () => {
  const { user, isLoaded } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view notifications."
      });
      return;
    }
    
    setIsInitialized(true);
  }, [user, isLoaded]);

  // Show loading while Clerk is initializing
  if (!isLoaded || !isInitialized) {
    return (
      <MainLayout>
        <LoadingSpinner size="lg" className="py-20" />
      </MainLayout>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Sign in to view notifications</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get notified about new messages, likes, and updates!
          </p>
          <Link to="/sign-in">
            <Button className="bg-softspot-500 hover:bg-softspot-600 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Notifications</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <NotificationsTab />
      </div>
    </MainLayout>
  );
};

export default NotificationsPage;
