
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { DirectMessaging } from "@/components/messaging/DirectMessaging";
import { MessagingComposer } from "@/components/messaging/MessagingComposer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Users } from "lucide-react";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { GroupMessaging } from "@/components/messaging/GroupMessaging";

const MessagingPage = () => {
  const isMobile = useIsMobile();
  const [showMessageRequests, setShowMessageRequests] = useState(false);
  
  // Mock data for message requests - would come from real data in production
  const hasMessageRequests = true;

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}

      <div className="container mx-auto px-4 py-6 mb-20 md:mb-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <MessagingComposer />
        </div>
        
        {/* Message Requests Banner (only shows if there are pending requests) */}
        {hasMessageRequests && (
          <div className="bg-softspot-50 border border-softspot-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-softspot-800">Message Requests</h3>
                <p className="text-sm text-softspot-600">You have new message requests</p>
              </div>
              <Button 
                variant="outline" 
                className="border-softspot-300 text-softspot-700 hover:bg-softspot-100"
                onClick={() => setShowMessageRequests(true)}
              >
                View
              </Button>
            </div>
          </div>
        )}

        {/* Messages main content */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="all" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  All Messages
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Groups
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {showMessageRequests ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Message Requests</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowMessageRequests(false)}
                      >
                        Back to messages
                      </Button>
                    </div>
                    <MessageRequestList />
                  </div>
                ) : (
                  <DirectMessaging />
                )}
              </TabsContent>
              
              <TabsContent value="groups">
                <GroupMessaging />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile floating action button */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-50">
          <Button 
            onClick={() => toast({
              title: "Coming soon",
              description: "This feature will be available soon!"
            })} 
            className="bg-softspot-500 hover:bg-softspot-600 text-white h-14 w-14 rounded-full shadow-lg p-0"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      <Footer />
    </div>
  );
};

// Mock component for message requests
const MessageRequestList = () => {
  const mockRequests = [
    { id: '1', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=AJ', preview: 'Hey, I saw your plushie collection...' },
    { id: '2', name: 'Taylor Smith', avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=TS', preview: 'I'd like to ask about your Jellycat bunny...' }
  ];
  
  const handleAccept = (id: string) => {
    toast({
      title: "Request Accepted",
      description: "You can now message with this user."
    });
  };
  
  const handleDecline = (id: string) => {
    toast({
      title: "Request Declined",
      description: "This request has been removed."
    });
  };
  
  return (
    <div className="space-y-4">
      {mockRequests.map(request => (
        <div key={request.id} className="border rounded-lg p-4">
          <div className="flex items-center mb-3">
            <img src={request.avatar} alt={request.name} className="w-10 h-10 rounded-full" />
            <div className="ml-3">
              <h4 className="font-medium">{request.name}</h4>
              <p className="text-sm text-gray-500 line-clamp-1">{request.preview}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleAccept(request.id)} size="sm" variant="default">Accept</Button>
            <Button onClick={() => handleDecline(request.id)} size="sm" variant="outline">Decline</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagingPage;
