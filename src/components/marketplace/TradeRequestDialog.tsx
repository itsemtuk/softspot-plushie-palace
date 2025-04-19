
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MarketplacePlushie } from "@/types/marketplace";
import { Textarea } from "@/components/ui/textarea";
import { Search, UserSearch, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { marketplacePlushies } from "@/data/plushies";

interface TradeRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plushie: MarketplacePlushie;
}

// Mock user data
const users = [
  { id: "user-1", name: "Sarah Johnson", username: "sarahlovesplushies", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: "user-2", name: "Mike Taylor", username: "plushiecollector", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "user-3", name: "Emma Wilson", username: "emmabear", avatar: "https://i.pravatar.cc/150?img=9" },
  { id: "user-4", name: "David Brown", username: "davidplush", avatar: "https://i.pravatar.cc/150?img=3" },
];

const TradeRequestDialog = ({ 
  isOpen, 
  onClose, 
  plushie 
}: TradeRequestDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedPlushie, setSelectedPlushie] = useState<MarketplacePlushie | null>(null);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<"user" | "plushie" | "message">("user");
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // My plushies to offer for trade
  const myPlushies = marketplacePlushies.slice(0, 3);
  
  const handleNextStep = () => {
    if (step === "user" && selectedUser) {
      setStep("plushie");
    } else if (step === "plushie" && selectedPlushie) {
      setStep("message");
    }
  };
  
  const handlePreviousStep = () => {
    if (step === "plushie") {
      setStep("user");
    } else if (step === "message") {
      setStep("plushie");
    }
  };
  
  const handleSubmitTrade = () => {
    if (!selectedUser || !selectedPlushie || !message.trim()) return;
    
    // In a real app, this would send the trade request to the backend
    toast({
      title: "Trade request sent",
      description: `Your trade request has been sent to ${selectedUser.name}.`,
    });
    
    // Reset the form
    setSearchQuery("");
    setSelectedUser(null);
    setSelectedPlushie(null);
    setMessage("");
    setStep("user");
    
    // Close the dialog
    onClose();
  };
  
  const handleClose = () => {
    // Reset the form
    setSearchQuery("");
    setSelectedUser(null);
    setSelectedPlushie(null);
    setMessage("");
    setStep("user");
    
    // Close the dialog
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Trade Request</DialogTitle>
          <DialogDescription>
            {step === "user" && "Search for a user to trade with"}
            {step === "plushie" && "Select a plushie to offer"}
            {step === "message" && "Send a message with your trade request"}
          </DialogDescription>
        </DialogHeader>
        
        {/* User selection step */}
        {step === "user" && (
          <div className="py-4">
            <div className="flex items-center mb-4">
              <div className="mr-4">
                <img 
                  src={plushie.image} 
                  alt={plushie.title} 
                  className="w-20 h-20 object-cover rounded-md" 
                />
              </div>
              <div>
                <h3 className="font-medium">Trading for: {plushie.title}</h3>
                <p className="text-sm text-gray-500">Owner: {plushie.username}</p>
              </div>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      selectedUser?.id === user.id ? 'bg-softspot-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">@{user.username}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <UserSearch className="mx-auto h-8 w-8 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No users found</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Plushie selection step */}
        {step === "plushie" && (
          <div className="py-4">
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.name} />
                <AvatarFallback>{selectedUser?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedUser?.name}</div>
                <div className="text-xs text-gray-500">@{selectedUser?.username}</div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">Select one of your plushies to offer in exchange:</p>
            
            <div className="grid grid-cols-1 gap-3">
              {myPlushies.map(myPlushie => (
                <Card 
                  key={myPlushie.id} 
                  className={`cursor-pointer ${
                    selectedPlushie?.id === myPlushie.id ? 'border-2 border-softspot-300' : ''
                  }`}
                  onClick={() => setSelectedPlushie(myPlushie)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center">
                      <img 
                        src={myPlushie.image} 
                        alt={myPlushie.title} 
                        className="w-16 h-16 object-cover rounded-md mr-3" 
                      />
                      <div>
                        <h3 className="font-medium">{myPlushie.title}</h3>
                        <p className="text-sm text-gray-500">Condition: {myPlushie.condition}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {/* Message step */}
        {step === "message" && (
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src="https://i.pravatar.cc/150?img=1" alt="You" />
                  <AvatarFallback>Y</AvatarFallback>
                </Avatar>
                <div className="text-sm">You</div>
              </div>
              
              <ArrowRight className="h-4 w-4 text-gray-400" />
              
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-2">
                  <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.name} />
                  <AvatarFallback>{selectedUser?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm">{selectedUser?.name}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <img 
                  src={selectedPlushie?.image} 
                  alt={selectedPlushie?.title} 
                  className="w-16 h-16 object-cover rounded-md mr-2" 
                />
                <div className="text-xs">Your plushie</div>
              </div>
              
              <ArrowRight className="h-4 w-4 text-gray-400" />
              
              <div className="flex items-center">
                <img 
                  src={plushie.image} 
                  alt={plushie.title} 
                  className="w-16 h-16 object-cover rounded-md mr-2" 
                />
                <div className="text-xs">Their plushie</div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Write a message to explain your trade offer..."
                className="mt-1"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        )}
        
        <DialogFooter className="flex justify-between">
          {step !== "user" && (
            <Button variant="outline" onClick={handlePreviousStep}>
              Back
            </Button>
          )}
          
          <div>
            <Button variant="outline" onClick={handleClose} className="mr-2">
              Cancel
            </Button>
            
            {step !== "message" ? (
              <Button 
                onClick={handleNextStep}
                disabled={(step === "user" && !selectedUser) || (step === "plushie" && !selectedPlushie)}
                className="bg-softspot-400 hover:bg-softspot-500"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmitTrade}
                disabled={!message.trim()}
                className="bg-softspot-400 hover:bg-softspot-500"
              >
                Send Trade Request
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeRequestDialog;
