
import { useState, useEffect } from 'react';
import { Search, UserPlus, UserCheck, Users, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EnhancedCard } from '@/components/ui/enhanced-card';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

export const EnhancedUserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setUsers([]);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, avatar_url')
        .or(`username.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
        .limit(10);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error searching users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search users",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to follow users",
      });
      return;
    }

    try {
      // TODO: Implement actual follow functionality once follow system is set up
      console.log('Following user:', userId);
      
      setFollowing(prev => new Set(prev).add(userId));
      toast({
        title: "Success",
        description: "You are now following this user!",
      });
    } catch (error) {
      console.error('Error following user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to follow user",
      });
    }
  };

  const handleViewProfile = (userId: string, username: string | null) => {
    const profilePath = username ? `/user/${username}` : `/user/${userId}`;
    navigate(profilePath);
  };

  const getDisplayName = (user: User) => {
    if (user.username) return user.username;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    return 'Anonymous User';
  };

  const getInitials = (user: User) => {
    const displayName = getDisplayName(user);
    return displayName.slice(0, 2).toUpperCase();
  };

  return (
    <EnhancedCard>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Find Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-600"
          />
        </div>

        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400">Searching...</p>
          </div>
        )}

        {users.length > 0 && (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback className="bg-softspot-500 text-white">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {getDisplayName(user)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      @{user.username || 'user'}
                    </p>
                  </div>
                </div>
                
                {currentUser && currentUser.id !== user.id && (
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewProfile(user.id, user.username)}
                      className="text-softspot-600 border-softspot-300 hover:bg-softspot-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant={following.has(user.id) ? "secondary" : "default"}
                      onClick={() => handleFollow(user.id)}
                      disabled={following.has(user.id)}
                      className="bg-softspot-500 hover:bg-softspot-600 text-white"
                    >
                      {following.has(user.id) ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-1" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Follow
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {searchTerm && !loading && users.length === 0 && (
          <div className="text-center py-4">
            <p className="text-gray-600 dark:text-gray-400">
              No users found matching "{searchTerm}"
            </p>
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  );
};
