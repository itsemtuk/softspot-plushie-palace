
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ActivityStatus } from "@/components/ui/activity-status";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface UserSearchResultsProps {
  searchTerm: string;
}

export const UserSearchResults = ({ searchTerm }: UserSearchResultsProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useUser();
  const { users: clerkUsers } = useClerk();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setUsers([]);
      return;
    }
    
    const searchUsers = async () => {
      setLoading(true);
      try {
        // Search users from Clerk
        if (clerkUsers) {
          const userResults = clerkUsers.filter(user => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const username = user.username?.toLowerCase() || '';
            return (
              username.includes(searchTerm.toLowerCase()) ||
              fullName.includes(searchTerm.toLowerCase())
            );
          }).map(user => ({
            id: user.id,
            username: user.username || `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            status: 'online' // You might want to implement actual status tracking
          }));
          
          setUsers(userResults);
        } else {
          // Fallback for development
          const mockUsers = [
            { id: '1', username: 'plushielover', imageUrl: '/assets/avatars/PLUSH_Bear.PNG', status: 'online' },
            { id: '2', username: 'jellycatfan', imageUrl: '/assets/avatars/PLUSH_Cat.PNG', status: 'away' },
            { id: '3', username: 'squishmallowcollector', imageUrl: '/assets/avatars/PLUSH_Panda.PNG', status: 'offline' },
            { id: '4', username: 'teddybearlover', imageUrl: '/assets/avatars/PLUSH_Bunny.PNG', status: 'busy' },
          ];
          
          const filtered = mockUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          setUsers(filtered);
        }
      } catch (error) {
        console.error("Error searching users:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timer = setTimeout(searchUsers, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, clerkUsers]);
  
  const viewProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };
  
  if (searchTerm.length < 2) {
    return <p className="text-sm text-gray-500 mt-2">Enter at least 2 characters to search</p>;
  }
  
  if (loading) {
    return (
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium">Users</h3>
        <div className="grid grid-cols-1 gap-2">
          {[1, 2].map((i) => (
            <Card key={i} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (users.length === 0) {
    return <p className="text-sm text-gray-500 mt-2">No users found matching "{searchTerm}"</p>;
  }
  
  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-sm font-medium">Users</h3>
      <div className="grid grid-cols-1 gap-2">
        {users.map(user => (
          <Card key={user.id} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.imageUrl} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <ActivityStatus 
                  status={user.status} 
                  className="absolute bottom-0 right-0"
                  size="sm"
                />
              </div>
              <div>
                <p className="font-medium">{user.username}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => viewProfile(user.username)}
            >
              View
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
