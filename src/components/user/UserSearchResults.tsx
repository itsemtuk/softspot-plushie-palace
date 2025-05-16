
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export interface UserSearchResultsProps {
  searchTerm?: string;
  isLoading?: boolean;
  users?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  }[];
}

export function UserSearchResults({ 
  searchTerm = '', 
  isLoading = false, 
  users: providedUsers 
}: UserSearchResultsProps) {
  const navigate = useNavigate();
  
  // Default mock users if none provided
  const defaultUsers = [
    { id: '1', name: 'Alex Johnson', username: 'alexj', avatar: '/assets/avatars/PLUSH_Bear.PNG' },
    { id: '2', name: 'Sam Parker', username: 'sammy', avatar: '/assets/avatars/PLUSH_Bunny.PNG' },
    { id: '3', name: 'Jordan Lee', username: 'jlee', avatar: '/assets/avatars/PLUSH_Cat.PNG' },
    { id: '4', name: 'Taylor Kim', username: 'tkim', avatar: '/assets/avatars/PLUSH_Dog.PNG' },
  ];

  const users = providedUsers || defaultUsers;
  
  // Filter users based on search term
  const filteredUsers = searchTerm
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-3 flex items-center animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No users found matching "{searchTerm}"</p>
      ) : (
        filteredUsers.map(user => (
          <Card key={user.id} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-gray-500">@{user.username}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              View
            </Button>
          </Card>
        ))
      )}
    </div>
  );
}

export default UserSearchResults;
