
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActivityStatus } from "@/components/ui/activity-status";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const MessagingComposer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const { user } = useUser();

  // Fetch users based on search term
  const searchUsers = async (term: string) => {
    if (!term.trim()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // In a real app, this would call your backend API that queries Clerk users
      // For now, we'll use mock data but simulate an API call
      setTimeout(() => {
        // Mock filtered users based on search term
        const filteredUsers = [
          { id: 1, name: "PlushieLover", avatar: "/assets/avatars/PLUSH_Bear.PNG", status: "online" },
          { id: 2, name: "JellycatFan", avatar: "/assets/avatars/PLUSH_Cat.PNG", status: "away" },
          { id: 3, name: "SquishCollector", avatar: "/assets/avatars/PLUSH_Panda.PNG", status: "offline" },
          { id: 4, name: "TeddyBearOwner", avatar: "/assets/avatars/PLUSH_Bunny.PNG", status: "busy" },
        ].filter(user => user.name.toLowerCase().includes(term.toLowerCase()));
        
        setUsers(filteredUsers);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error searching users:", error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

  const handleUnselectUser = () => {
    setSelectedUser(null);
  };

  const handleSend = async () => {
    if (!selectedUser || !message.trim() || !user) return;
    
    setIsLoading(true);
    try {
      // In a real app with Supabase integration, you would use:
      // const { error } = await supabase.from('messages').insert({
      //   sender_id: user.id,
      //   receiver_id: selectedUser.id,
      //   content: message,
      //   type: 'text'
      // });
      
      // For now, simulate a successful message send
      setTimeout(() => {
        toast({
          title: "Message sent",
          description: `Your message to ${selectedUser.name} has been sent.`
        });
        setMessage("");
        setSelectedUser(null);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-softspot-500 hover:bg-softspot-600">
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
          <DialogDescription>
            Send a direct message to another user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!selectedUser ? (
            <>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for a user..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    searchUsers(e.target.value);
                  }}
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin h-5 w-5 rounded-full border-2 border-softspot-500 border-t-transparent" />
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <ActivityStatus 
                          status={user.status as "online" | "offline" | "away" | "busy"} 
                          className="absolute bottom-0 right-0" 
                          size="sm" 
                        />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>
                  ))
                )}

                {searchTerm && users.length === 0 && !isLoading && (
                  <p className="text-center text-gray-500 p-2">No users found</p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <ActivityStatus 
                      status={selectedUser.status as "online" | "offline" | "away" | "busy"} 
                      className="absolute bottom-0 right-0" 
                      size="sm" 
                    />
                  </div>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleUnselectUser}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                placeholder={`Write your message to ${selectedUser.name}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />

              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  className="bg-softspot-500 hover:bg-softspot-600" 
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent"></span>
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
