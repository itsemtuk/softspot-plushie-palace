
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
import { useFollowUser } from "@/hooks/useFollowUser";

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
      
      // Filter out current user
      const filteredUsers = data?.filter(user => user.clerk_id !== currentUser?.id) || [];
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
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

  const UserCard = ({ user }: { user: User }) => {
    const { isFollowing, isLoading, toggleFollow } = useFollowUser(user.id);

    return (
      <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar_url || ''} />
              <AvatarFallback className="bg-softspot-500 text-white text-lg">
                {getInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {getDisplayName(user)}
              </h3>
              {user.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              )}
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span>Joined 2024</span>
              </div>
            </div>
            {currentUser && (
              <Button
                size="sm"
                variant={isFollowing ? "outline" : "default"}
                onClick={toggleFollow}
                disabled={isLoading}
                className={`${
                  isFollowing 
                    ? 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700' 
                    : 'bg-softspot-500 hover:bg-softspot-600 text-white'
                } min-w-[100px]`}
              >
                {isLoading ? (
                  'Loading...'
                ) : isFollowing ? (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-4xl">
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
          <div className="space-y-4">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
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
