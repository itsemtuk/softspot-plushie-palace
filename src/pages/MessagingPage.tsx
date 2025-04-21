
import { Navbar } from "@/components/Navbar";
import DirectMessaging from "@/components/messaging/DirectMessaging";
import { useEffect } from "react";

const MessagingPage = () => {
  // Force scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-gray-600">Chat with other plushie enthusiasts</p>
        </div>
        
        <DirectMessaging />
      </div>
    </div>
  );
};

export default MessagingPage;
