
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserPlus, UserCheck } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";

interface UserItem {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

// Mock user data - in a real app this would come from your API
const MOCK_USERS: UserItem[] = [
  { id: "user1", username: "plushielover", firstName: "Emily", lastName: "Chen", imageUrl: "https://i.pravatar.cc/150?img=1" },
  { id: "user2", username: "teddycollector", firstName: "James", lastName: "Wilson", imageUrl: "https://i.pravatar.cc/150?img=2" },
  { id: "user3", username: "softiequeen", firstName: "Maria", lastName: "Garcia", imageUrl: "https://i.pravatar.cc/150?img=3" },
  { id: "user4", username: "plushiepals", firstName: "Alex", lastName: "Taylor", imageUrl: "https://i.pravatar.cc/150?img=4" },
  { id: "user5", username: "cuddlycreatures", firstName: "Sam", lastName: "Johnson", imageUrl: "https://i.pravatar.cc/150?img=5" },
];

export function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserItem[]>([]);
  const { user } = useUser();
  const [following, setFollowing] = useState<string[]>([]);
  
  useEffect(() => {
    // Get following list from user metadata
    if (user) {
      const userFollowing = user.unsafeMetadata?.following as string[] || [];
      setFollowing(userFollowing);
    }
  }, [user]);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    
    // Filter users based on search query
    // In a real app, this would be an API call to search users
    const filteredUsers = MOCK_USERS.filter(
      user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.firstName && user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setSearchResults(filteredUsers);
  }, [searchQuery]);
  
  const handleFollowToggle = (username: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow users",
        variant: "destructive"
      });
      return;
    }
    
    const isFollowing = following.includes(username);
    let updatedFollowing: string[];
    
    if (isFollowing) {
      // Unfollow
      updatedFollowing = following.filter(name => name !== username);
      toast({
        title: "Unfollowed",
        description: `You are no longer following @${username}`
      });
    } else {
      // Follow
      updatedFollowing = [...following, username];
      toast({
        title: "Following",
        description: `You are now following @${username}`
      });
    }
    
    // Update local state
    setFollowing(updatedFollowing);
    
    // Update user metadata
    user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        following: updatedFollowing
      }
    }).catch(error => {
      console.error("Error updating following list:", error);
      // Revert local state on error
      setFollowing(following);
      toast({
        title: "Error",
        description: "Failed to update following status",
        variant: "destructive"
      });
    });
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search for users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {searchResults.length > 0 ? (
        <div className="mt-4 border rounded-md divide-y">
          {searchResults.map(userResult => (
            <div key={userResult.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={userResult.imageUrl} />
                  <AvatarFallback>{userResult.firstName?.[0] || userResult.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userResult.firstName} {userResult.lastName}</p>
                  <p className="text-sm text-gray-500">@{userResult.username}</p>
                </div>
              </div>
              <Button 
                variant={following.includes(userResult.username) ? "outline" : "default"}
                size="sm"
                onClick={() => handleFollowToggle(userResult.username)}
                className={following.includes(userResult.username) ? "border-softspot-200 text-softspot-500" : ""}
              >
                {following.includes(userResult.username) ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      ) : searchQuery.length > 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found matching "{searchQuery}"
        </div>
      ) : null}
      
      <p className="text-sm text-gray-500 mt-2">
        Search for users by username or name to follow them
      </p>
    </div>
  );
}
