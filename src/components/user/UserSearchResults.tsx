
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserStatusBadge } from '@/components/messaging/UserStatusBadge';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@clerk/clerk-react';
import { useFollowUser } from '@/hooks/useFollowUser';

interface UserResult {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  status?: "online" | "offline" | "away" | "busy";
  isFollowing?: boolean;
}

interface UserSearchResultsProps {
  searchTerm?: string;
}

export const UserSearchResults: React.FC<UserSearchResultsProps> = ({ searchTerm }) => {
  const [users, setUsers] = useState<UserResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser } = useUser();

  // Fetch users based on search term from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from('users')
          .select(`
            id,
            username,
            first_name,
            last_name,
            avatar_url
          `);

        // Filter by search term if provided
        if (searchTerm && searchTerm.length > 0) {
          const term = searchTerm.toLowerCase();
          query = query.or(`username.ilike.%${term}%,first_name.ilike.%${term}%,last_name.ilike.%${term}%`);
        }

        const { data: usersData, error } = await query.limit(20);

        if (error) {
          console.error('Error fetching users:', error);
          setUsers([]);
          return;
        }

        if (usersData) {
          // Get current user's Supabase ID for follow status
          let currentUserSupabaseId = null;
          if (currentUser?.id) {
            const { data: currentUserData } = await supabase
              .from('users')
              .select('id')
              .eq('clerk_id', currentUser.id)
              .maybeSingle();
            
            currentUserSupabaseId = currentUserData?.id;
          }

          // Check follow status for each user
          const usersWithFollowStatus = await Promise.all(
            usersData.map(async (userData) => {
              let isFollowing = false;
              
              if (currentUserSupabaseId && userData.id !== currentUserSupabaseId) {
                const { data: followData } = await supabase
                  .from('followers')
                  .select('id')
                  .eq('follower_id', currentUserSupabaseId)
                  .eq('following_id', userData.id)
                  .maybeSingle();
                
                isFollowing = !!followData;
              }

              return {
                id: userData.id,
                username: userData.username || userData.first_name || 'User',
                first_name: userData.first_name,
                last_name: userData.last_name,
                avatar_url: userData.avatar_url,
                bio: '', // Will fetch from profiles table separately if needed
                status: 'offline' as const,
                isFollowing: currentUserSupabaseId ? isFollowing : false
              };
            })
          );

          setUsers(usersWithFollowStatus);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [searchTerm, currentUser?.id]);

  const handleUserClick = (username: string) => {
    navigate(`/user/${username}`);
  };

  const getDisplayName = (user: UserResult) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.first_name || user.username;
  };

  const getInitials = (user: UserResult) => {
    const displayName = getDisplayName(user);
    return displayName.slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <Spinner size="md" />
      </div>
    );
  }

  if (users.length === 0 && searchTerm) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No users found matching "{searchTerm}"
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Popular users will appear here. Start following users to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-softspot-500 text-white">
                    {getInitials(user)}
                  </AvatarFallback>
                  {user.avatar_url && (
                    <AvatarImage 
                      src={user.avatar_url} 
                      alt={user.username}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                </Avatar>
                {user.status && (
                  <div className="absolute -bottom-1 -right-1">
                    <UserStatusBadge status={user.status} size="sm" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-base text-gray-900 dark:text-white">
                    {getDisplayName(user)}
                  </h3>
                  {user.isFollowing && (
                    <Badge variant="secondary" className="text-xs">
                      Following
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {user.bio || 'No bio yet'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleUserClick(user.username)}
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
