
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserStatusBadge } from '@/components/messaging/UserStatusBadge';
import { Spinner } from '@/components/ui/spinner';

interface UserResult {
  id: string;
  username: string;
  imageUrl?: string;
  bio?: string;
  status?: "online" | "offline" | "away" | "busy";
}

interface UserSearchResultsProps {
  searchTerm?: string;
}

export const UserSearchResults: React.FC<UserSearchResultsProps> = ({ searchTerm }) => {
  const [users, setUsers] = useState<UserResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch users based on search term or get popular users
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch from your API/Clerk
        // For now, we'll simulate with local data
        
        // Get users from localStorage if available
        const storedUsers = localStorage.getItem('users');
        let userList: UserResult[] = [];
        
        if (storedUsers) {
          userList = JSON.parse(storedUsers);
        } else {
          // Fallback demo data
          userList = [
            { 
              id: 'user1', 
              username: 'plushielover', 
              imageUrl: '/assets/avatars/PLUSH_Bear.PNG',
              bio: 'Passionate about collecting rare plushies',
              status: 'online'
            },
            { 
              id: 'user2', 
              username: 'teddycollector', 
              imageUrl: '/assets/avatars/PLUSH_Penguin.PNG',
              bio: 'Vintage teddy bear enthusiast',
              status: 'away'
            },
            { 
              id: 'user3', 
              username: 'jellycat_fan', 
              imageUrl: '/assets/avatars/PLUSH_Bunny.PNG',
              bio: 'Jellycat collector since 2015',
              status: 'offline'
            }
          ];
        }
        
        // Filter by search term if provided
        if (searchTerm && searchTerm.length > 0) {
          const term = searchTerm.toLowerCase();
          userList = userList.filter(user => 
            user.username.toLowerCase().includes(term) || 
            (user.bio && user.bio.toLowerCase().includes(term))
          );
        }
        
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [searchTerm]);

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6 bg-white rounded-lg shadow-sm">
        <Spinner size="md" />
      </div>
    );
  }

  if (users.length === 0 && searchTerm) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <p className="text-gray-500">
          No users found matching "{searchTerm}"
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <p className="text-gray-500">
          Popular users will appear here. Start following users to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow bg-white">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  {user.imageUrl && <AvatarImage src={user.imageUrl} alt={user.username} />}
                </Avatar>
                {user.status && (
                  <div className="absolute -bottom-1 -right-1">
                    <UserStatusBadge status={user.status} size="sm" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-base">{user.username}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{user.bio || 'No bio yet'}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleUserClick(user.id)}
              >
                View Profile
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
