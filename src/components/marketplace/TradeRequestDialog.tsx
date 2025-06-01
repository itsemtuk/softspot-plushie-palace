import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, MessageSquare } from "lucide-react";
import { MarketplacePlushie, UserProfile, PlushieFilling } from '@/types/marketplace';
import { toast } from '@/components/ui/use-toast';

interface TradeRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plushie?: MarketplacePlushie;
}

// Mock data with all required properties
const mockFollowers: UserProfile[] = [
  { 
    id: "user-2", 
    username: "sarahlovesplushies", 
    avatar: "https://i.pravatar.cc/150?img=5", 
    bio: "Collector of rare plushies", 
    interests: ["plushies", "collecting", "trading"],
    isPrivate: false,
    joinDate: new Date().toISOString(),
    followersCount: 123,
    followingCount: 45,
    postsCount: 32,
    collectionsCount: 5,
    marketplaceListingsCount: 10
  },
  { 
    id: "user-3", 
    username: "mikeplush", 
    avatar: "https://i.pravatar.cc/150?img=12", 
    bio: "Teddy bear enthusiast", 
    interests: ["teddy bears", "vintage toys"],
    isPrivate: false,
    joinDate: new Date().toISOString(),
    followersCount: 56,
    followingCount: 30,
    postsCount: 20,
    collectionsCount: 3,
    marketplaceListingsCount: 5
  },
  { 
    id: "user-4", 
    username: "emmacollects", 
    avatar: "https://i.pravatar.cc/150?img=9", 
    bio: "Plushie photographer", 
    interests: ["photography", "plushies", "art"],
    isPrivate: false,
    joinDate: new Date().toISOString(),
    followersCount: 208,
    followingCount: 150,
    postsCount: 45,
    collectionsCount: 8,
    marketplaceListingsCount: 15
  }
];

const mockPlushies: MarketplacePlushie[] = [
  {
    id: "1",
    userId: "user-1",
    name: "Mint Jellycat Bunny",
    image: "https://i.pravatar.cc/300?img=1",
    imageUrl: "https://i.pravatar.cc/300?img=1",
    title: "Mint Jellycat Bunny",
    username: "plushielover",
    likes: 24,
    comments: 5,
    price: 45.99,
    forSale: true,
    condition: "Like New",
    description: "Adorable mint green bunny, super soft",
    color: "Mint",
    material: "Plush",
    filling: "Cotton" as PlushieFilling,
    species: "Rabbit",
    brand: "Jellycat",
    timestamp: new Date().toISOString(),
    tags: ['bunny', 'jellycat', 'mint green'],
    deliveryCost: 5.00
  },
  {
    id: "2",
    userId: "user-1",
    name: "Limited Edition Teddy",
    image: "https://i.pravatar.cc/300?img=2",
    imageUrl: "https://i.pravatar.cc/300?img=2",
    title: "Limited Edition Teddy",
    username: "plushielover",
    likes: 42,
    comments: 8,
    price: 89.99,
    forSale: true,
    condition: "New",
    description: "Limited edition anniversary teddy bear",
    color: "Brown",
    material: "Cotton",
    filling: "Polyester Fiberfill" as PlushieFilling,
    species: "Bear",
    brand: "Build-A-Bear",
    timestamp: new Date().toISOString(),
    tags: ['teddy', 'limited edition', 'anniversary'],
    deliveryCost: 0
  }
];

const TradeRequestDialog = ({ isOpen, onClose, plushie }: TradeRequestDialogProps) => {
  const [activeTab, setActiveTab] = useState("followers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedPlushieId, setSelectedPlushieId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  
  // Filter followers by search query
  const filteredFollowers = mockFollowers.filter(follower => 
    follower.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter my plushies
  const myPlushies = mockPlushies;
  
  const handleSendTradeRequest = () => {
    // In a real app, you would send the trade request to the backend
    toast({
      title: "Trade request sent!",
      description: "Your trade request has been sent. You'll be notified when they respond."
    });
    
    // Reset form and close dialog
    setSelectedUserId(null);
    setSelectedPlushieId(null);
    setMessage("");
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Trade Request</DialogTitle>
          <DialogDescription>
            Choose who you want to trade with and which plushie you'd like to offer.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="followers" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="followers">Trade with Follower</TabsTrigger>
            <TabsTrigger value="user">Request from User</TabsTrigger>
          </TabsList>
          
          <TabsContent value="followers" className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search followers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="text-sm font-medium mb-2">Select a follower to trade with:</div>
            
            <ScrollArea className="h-[180px] rounded-md border">
              <div className="p-2 space-y-2">
                {filteredFollowers.map(follower => (
                  <Card 
                    key={follower.id}
                    className={`p-3 cursor-pointer ${
                      selectedUserId === follower.id ? 'bg-softspot-50 border-softspot-200' : ''
                    }`}
                    onClick={() => setSelectedUserId(follower.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={follower.avatar} alt={follower.username} />
                        <AvatarFallback>{follower.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{follower.username}</div>
                        <div className="text-xs text-gray-500">{follower.followersCount} followers</div>
                      </div>
                    </div>
                  </Card>
                ))}
                
                {filteredFollowers.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No followers found
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {selectedUserId && (
              <>
                <div className="text-sm font-medium mb-2">Select your plushie to offer:</div>
                
                <ScrollArea className="h-[180px] rounded-md border">
                  <div className="p-2 space-y-2">
                    {myPlushies.map(myPlushie => (
                      <Card 
                        key={myPlushie.id}
                        className={`p-3 cursor-pointer ${
                          selectedPlushieId === myPlushie.id ? 'bg-softspot-50 border-softspot-200' : ''
                        }`}
                        onClick={() => setSelectedPlushieId(myPlushie.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                            <img 
                              src={myPlushie.image} 
                              alt={myPlushie.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{myPlushie.title}</div>
                            <div className="text-xs text-gray-500">{myPlushie.condition} • ${myPlushie.price}</div>
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    {myPlushies.length === 0 && (
                      <div className="text-center py-4 text-gray-500">
                        You don't have any plushies to trade
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
            
            <Textarea
              placeholder="Add a message about your trade offer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </TabsContent>
          
          <TabsContent value="user" className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Input 
                type="text"
                placeholder="Enter username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            
            {/* Similar layout as followers tab */}
            <div className="text-sm font-medium mb-2">Select your plushie to offer:</div>
            
            <ScrollArea className="h-[180px] rounded-md border">
              <div className="p-2 space-y-2">
                {myPlushies.map(myPlushie => (
                  <Card 
                    key={myPlushie.id}
                    className={`p-3 cursor-pointer ${
                      selectedPlushieId === myPlushie.id ? 'bg-softspot-50 border-softspot-200' : ''
                    }`}
                    onClick={() => setSelectedPlushieId(myPlushie.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                        <img 
                          src={myPlushie.image} 
                          alt={myPlushie.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{myPlushie.title}</div>
                        <div className="text-xs text-gray-500">{myPlushie.condition} • ${myPlushie.price}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            
            <Textarea
              placeholder="Add a message about your trade request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="sm:flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="sm:flex-1 bg-softspot-400 hover:bg-softspot-500"
            onClick={handleSendTradeRequest}
            disabled={!selectedUserId || !selectedPlushieId}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {activeTab === "followers" ? "Send Trade Offer" : "Send Trade Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeRequestDialog;
