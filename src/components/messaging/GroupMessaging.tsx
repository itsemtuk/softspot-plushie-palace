
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Users, Camera } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { UserStatusBadge } from "./UserStatusBadge";

export const GroupMessaging = () => {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [groupImageUrl, setGroupImageUrl] = useState<string | null>(null);
  
  // In a real app, these would come from an API or state management
  const mockGroups = [
    { 
      id: "group1",
      name: "Jellycat Enthusiasts",
      image: "https://images.unsplash.com/photo-1559454473-280beb7a0a68?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
      lastMessage: "Sarah: Does anyone know where I can find the bashful bunny?",
      timestamp: "2 hours ago",
      unread: 3,
      members: 12
    },
    { 
      id: "group2",
      name: "Squishmallows Trading",
      image: null,
      lastMessage: "Mike: I have the strawberry one if anyone wants to trade",
      timestamp: "Yesterday",
      unread: 0,
      members: 24
    }
  ];
  
  const handleImageUpload = () => {
    // Mock image upload
    setTimeout(() => {
      setGroupImageUrl("https://images.unsplash.com/photo-1607344645866-009c320c5ab8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80");
      toast({ title: "Image uploaded", description: "Your group image has been uploaded." });
    }, 1000);
  };
  
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Group created", description: "Your group has been created successfully." });
    setOpenCreateDialog(false);
  };
  
  const handleGroupClick = (groupId: string) => {
    toast({ 
      title: "Group chat opening", 
      description: "This feature is coming soon." 
    });
  };
  
  return (
    <div>
      {/* Create Group Button */}
      <div className="flex justify-end mb-4">
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-softspot-500 hover:bg-softspot-600 text-white">
              <PlusCircle className="h-4 w-4" /> New Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Group Chat</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              {/* Group Image Upload */}
              <div className="flex flex-col items-center mb-4">
                <div 
                  onClick={handleImageUpload}
                  className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-softspot-300 hover:border-softspot-400"
                >
                  {groupImageUrl ? (
                    <img src={groupImageUrl} alt="Group" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-2">Click to add group photo</span>
              </div>
              
              {/* Group Name */}
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input id="groupName" placeholder="Enter group name" required />
              </div>
              
              {/* Group Members */}
              <div className="space-y-2">
                <Label>Add Members</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                  {['Alex', 'Taylor', 'Jordan'].map((name) => (
                    <div key={name} className="bg-softspot-100 rounded-full px-3 py-1 text-sm flex items-center">
                      {name} <button className="ml-2 text-softspot-500">×</button>
                    </div>
                  ))}
                  <Input 
                    placeholder="Search for members" 
                    className="flex-1 min-w-[100px] border-0 focus-visible:ring-0" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setOpenCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Group</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Groups List */}
      <div className="space-y-2">
        {mockGroups.length > 0 ? (
          <ScrollArea className="h-[400px]">
            {mockGroups.map(group => (
              <Card 
                key={group.id} 
                className="p-3 cursor-pointer hover:bg-gray-50"
                onClick={() => handleGroupClick(group.id)}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      {group.image ? (
                        <AvatarImage src={group.image} alt={group.name} />
                      ) : (
                        <AvatarFallback className="bg-softspot-200 text-softspot-800">
                          <Users className="h-6 w-6" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{group.name}</h3>
                      <span className="text-xs text-gray-500">{group.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 line-clamp-1">{group.lastMessage}</p>
                      {group.unread > 0 && (
                        <span className="bg-softspot-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {group.unread}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      <Users className="h-3 w-3 inline mr-1" /> {group.members} members
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </ScrollArea>
        ) : (
          <div className="text-center py-10">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-700">No Groups Yet</h3>
            <p className="text-gray-500 mt-1">Create a new group to start chatting!</p>
          </div>
        )}
      </div>
    </div>
  );
};
