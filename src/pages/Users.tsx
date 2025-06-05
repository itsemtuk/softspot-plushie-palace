
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, UserPlus, Users as UsersIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

const Users = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const { user: currentUser } = useUser();

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase.from('users').select('*');
      
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.limit(20);
      
      if (error) {
        console.error('Error fetching users:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch users",
        });
        return;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error:', error);
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
      const { error } = await supabase
        .from('followers')
        .insert({
          follower_id: currentUser.id,
          following_id: userId
        });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to follow user",
        });
        return;
      }

      setFollowingUsers(prev => new Set(prev).add(userId));
      toast({
        title: "Success",
        description: "You are now following this user!",
      });
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const getDisplayName = (user: User) => {
    if (user.username) return user.username;
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`;
    if (user.first_name) return user.first_name;
    return user.email?.split('@')[0] || 'Anonymous';
  };

  const getInitials = (user: User) => {
    const name = getDisplayName(user);
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <Card className="mb-6 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <UsersIcon className="h-5 w-5 mr-2" />
              Find Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id} className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar_url || ''} />
                      <AvatarFallback className="bg-softspot-500 text-white">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {getDisplayName(user)}
                      </h3>
                      {user.email && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                      )}
                    </div>
                    {currentUser && currentUser.id !== user.id && (
                      <Button
                        size="sm"
                        variant={followingUsers.has(user.id) ? "secondary" : "default"}
                        onClick={() => handleFollow(user.id)}
                        disabled={followingUsers.has(user.id)}
                        className="bg-softspot-500 hover:bg-softspot-600 text-white"
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        {followingUsers.has(user.id) ? 'Following' : 'Follow'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-8">
            <UsersIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'No users found matching your search.' : 'No users found.'}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Users;
