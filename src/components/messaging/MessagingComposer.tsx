
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActivityStatus } from "@/components/ui/activity-status";

export const MessagingComposer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [message, setMessage] = useState("");

  // Mock user search results
  const users = [
    { id: 1, name: "PlushieLover", avatar: "/assets/avatars/PLUSH_Bear.PNG", status: "online" },
    { id: 2, name: "JellycatFan", avatar: "/assets/avatars/PLUSH_Cat.PNG", status: "away" },
    { id: 3, name: "SquishCollector", avatar: "/assets/avatars/PLUSH_Panda.PNG", status: "offline" },
    { id: 4, name: "TeddyBearOwner", avatar: "/assets/avatars/PLUSH_Bunny.PNG", status: "busy" },
  ];

  const filteredUsers = searchTerm 
    ? users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : users;

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };

  const handleUnselectUser = () => {
    setSelectedUser(null);
  };

  const handleSend = () => {
    if (!selectedUser || !message.trim()) return;
    
    console.log("Sending message to", selectedUser.name, ":", message);
    // Here you would send the message via your messaging system
    setMessage("");
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredUsers.map((user) => (
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
                ))}

                {searchTerm && filteredUsers.length === 0 && (
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
                <DialogClose asChild>
                  <Button 
                    className="bg-softspot-500 hover:bg-softspot-600" 
                    onClick={handleSend}
                    disabled={!message.trim()}
                  >
                    Send Message
                  </Button>
                </DialogClose>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
