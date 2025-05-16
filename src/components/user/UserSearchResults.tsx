
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useClerk } from '@clerk/clerk-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserSearchResultsProps {
  query: string;
}

export const UserSearchResults = ({ query }: UserSearchResultsProps) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const clerk = useClerk();

  useEffect(() => {
    const searchUsers = async () => {
      if (!query || query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Note: In a real implementation, we would use Clerk's search API or our own backend
        // Since clerk.user?.getUserList doesn't exist, we're using a simple mock
        // In a real app, you'd need to implement a proper backend search endpoint
        
        // Mock user data for demonstration
        const mockResults = [
          { id: '1', username: 'plushielover', imageUrl: '/assets/avatars/PLUSH_Bear.PNG' },
          { id: '2', username: 'teddycollector', imageUrl: '/assets/avatars/PLUSH_Panda.PNG' },
          { id: '3', username: 'softtoys', imageUrl: '/assets/avatars/PLUSH_Bunny.PNG' },
        ].filter(user => 
          user.username.toLowerCase().includes(query.toLowerCase())
        );
        
        setResults(mockResults);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeout);
  }, [query, clerk]);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-2 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0 && query.length >= 2) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        No users found matching "{query}"
      </div>
    );
  }

  return (
    <div className="divide-y">
      {results.map((user) => (
        <Link
          key={user.id}
          to={`/profile/${user.id}`}
          className="flex items-center p-3 hover:bg-gray-50 transition"
        >
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={user.imageUrl} alt={user.username} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{user.username}</p>
            <p className="text-xs text-gray-500">@{user.username}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
