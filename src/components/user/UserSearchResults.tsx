
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export interface UserSearchResultsProps {
  searchTerm?: string; // Make searchTerm optional to fix the error
}

export function UserSearchResults({ searchTerm = '' }: UserSearchResultsProps) {
  const navigate = useNavigate();
  
  // Mock users for demonstration
  const users = [
    { id: '1', name: 'Alex Johnson', username: 'alexj', avatar: '/assets/avatars/PLUSH_Bear.PNG' },
    { id: '2', name: 'Sam Parker', username: 'sammy', avatar: '/assets/avatars/PLUSH_Bunny.PNG' },
    { id: '3', name: 'Jordan Lee', username: 'jlee', avatar: '/assets/avatars/PLUSH_Cat.PNG' },
    { id: '4', name: 'Taylor Kim', username: 'tkim', avatar: '/assets/avatars/PLUSH_Dog.PNG' },
  ];
  
  // Filter users based on search term
  const filteredUsers = searchTerm
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  return (
    <div className="space-y-2">
      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No users found</p>
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
