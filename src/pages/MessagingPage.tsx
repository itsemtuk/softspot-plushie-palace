
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { DirectMessaging } from "@/components/messaging/DirectMessaging";
import { MessagingComposer } from "@/components/messaging/MessagingComposer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Users, Handshake } from "lucide-react";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { GroupMessaging } from "@/components/messaging/GroupMessaging";
import { MessageRequest } from "@/components/messaging/MessageRequest";

const MessagingPage = () => {
  const isMobile = useIsMobile();
  const [showMessageRequests, setShowMessageRequests] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [messageRequests, setMessageRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for message requests - would come from real data in production
  useEffect(() => {
    const fetchMessageRequests = async () => {
      setIsLoading(true);
      try {
        // In production, you would fetch from Supabase:
        // const { data } = await supabase
        //   .from('trade_requests')
        //   .select('*')
        //   .eq('to_user', user.id)
        //   .eq('status', 'pending');
        
        // For now, use mock data with a delay to simulate API call
        setTimeout(() => {
          const mockRequests = [
            { 
              id: '1', 
              name: 'Alex Johnson', 
              username: 'alexj',
              avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=AJ', 
              preview: 'Hey, I saw your plushie collection...', 
              timestamp: '2 hours ago',
              mutualCount: 3,
              isVerified: true,
              status: 'online'
            },
            { 
              id: '2', 
              name: 'Taylor Smith', 
              username: 'tsmith',
              avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=TS', 
              preview: "I'd like to ask about your Jellycat bunny...",
              timestamp: 'Yesterday',
              mutualCount: 0,
              isVerified: false,
              status: 'offline'
            }
          ];
          
          setMessageRequests(mockRequests);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching message requests:", error);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load message requests",
          variant: "destructive"
        });
      }
    };
    
    fetchMessageRequests();
  }, []);
  
  const handleAcceptRequest = (id: string) => {
    setMessageRequests(prev => prev.filter(req => req.id !== id));
    
    if (messageRequests.length <= 1) {
      // If this was the last request, go back to messages
      setTimeout(() => setShowMessageRequests(false), 500);
    }
  };
  
  const handleDeclineRequest = (id: string) => {
    setMessageRequests(prev => prev.filter(req => req.id !== id));
    
    if (messageRequests.length <= 1) {
      // If this was the last request, go back to messages
      setTimeout(() => setShowMessageRequests(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}

      <div className="container mx-auto px-4 py-6 mb-20 md:mb-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <MessagingComposer />
        </div>
        
        {/* Message Requests Banner (only shows if there are pending requests) */}
        {messageRequests.length > 0 && !showMessageRequests && (
          <div className="bg-softspot-50 border border-softspot-200 rounded-lg p-4 mb-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-softspot-800">Message Requests</h3>
                <p className="text-sm text-softspot-600">
                  You have {messageRequests.length} new message request{messageRequests.length > 1 ? 's' : ''}
                </p>
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
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="all" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="trades" className="flex items-center">
                  <Handshake className="h-4 w-4 mr-2" />
                  Trades
                </TabsTrigger>
                <TabsTrigger value="groups" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Groups
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {showMessageRequests ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Message Requests</h3>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowMessageRequests(false)}
                      >
                        Back to messages
                      </Button>
                    </div>
                    
                    {isLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin h-8 w-8 rounded-full border-4 border-softspot-200 border-t-softspot-500" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messageRequests.map(request => (
                          <MessageRequest
                            key={request.id}
                            id={request.id}
                            name={request.name}
                            username={request.username}
                            avatar={request.avatar}
                            preview={request.preview}
                            timestamp={request.timestamp}
                            mutualCount={request.mutualCount}
                            isVerified={request.isVerified}
                            status={request.status}
                            onAccept={handleAcceptRequest}
                            onDecline={handleDeclineRequest}
                          />
                        ))}
                        
                        {messageRequests.length === 0 && (
                          <div className="text-center py-8">
                            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                            <h3 className="text-lg font-medium text-gray-700">No Message Requests</h3>
                            <p className="text-gray-500 mt-1">You're all caught up!</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <DirectMessaging />
                )}
              </TabsContent>
              
              <TabsContent value="trades">
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <Handshake className="h-12 w-12 text-gray-300 mx-auto" />
                    <h3 className="mt-2 text-lg font-medium">Trade Requests</h3>
                    <p className="text-sm text-gray-500 mt-1">Coming soon! You'll be able to manage all your plushie trades here.</p>
                  </div>
                </div>
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

export default MessagingPage;
