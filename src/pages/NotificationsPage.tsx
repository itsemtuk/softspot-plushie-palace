
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

const NotificationsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view notifications."
      });
      navigate('/sign-in');
      return;
    }
    
    setIsInitialized(true);
  }, [navigate, user, isLoaded]);

  // Show loading while Clerk is initializing
  if (!isLoaded || !isInitialized) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {isMobile ? <MobileNav /> : <Navbar />}
        <div className="container mx-auto px-4 py-6 flex-grow">
          <LoadingSpinner size="lg" className="py-20" />
        </div>
        <Footer />
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {isMobile ? <MobileNav /> : <Navbar />}
        <div className="container mx-auto px-4 py-6 flex-grow">
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
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Notifications</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <NotificationsTab />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotificationsPage;
