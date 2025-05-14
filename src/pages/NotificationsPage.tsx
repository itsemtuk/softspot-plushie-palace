
import { Navbar } from "@/components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import NotificationsTab from "@/components/profile/NotificationsTab";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";

const NotificationsPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view notifications."
      });
      navigate('/sign-in');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <div className="container mx-auto px-4 py-6 flex-grow">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <NotificationsTab />
      </div>
      
      <Footer />
    </div>
  );
};

export default NotificationsPage;
