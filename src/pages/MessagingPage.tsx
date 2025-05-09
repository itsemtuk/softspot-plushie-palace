
import { Navbar } from "@/components/Navbar";
import { DirectMessaging } from "@/components/messaging/DirectMessaging";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const MessagingPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Verify authentication on component mount
  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem('currentUserId');
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to be signed in to access messages."
      });
      navigate('/sign-in');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        <Card className="bg-white shadow-sm">
          <DirectMessaging />
        </Card>
      </main>
    </div>
  );
};

export default MessagingPage;
