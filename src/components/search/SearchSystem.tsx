
import { useState } from "react";
import { Search, User, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ExtendedPost } from "@/types/core";

interface SearchResult {
  users: any[];
  posts: ExtendedPost[];
}

export function SearchSystem() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({ users: [], posts: [] });
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      // Search users
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .or(`username.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
        .limit(10);

      // Search posts - convert to ExtendedPost format
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
        .limit(20);

      // Transform posts data to match ExtendedPost interface
      const posts: ExtendedPost[] = (postsData || []).map(post => ({
        id: post.id,
        userId: post.user_id,
        user_id: post.user_id,
        username: 'Unknown User', // We'd need a join to get this
        content: post.content || '',
        image: post.image || '',
        title: post.title || '',
        description: post.description || '',
        brand: post.brand || '',
        price: post.price || 0,
        condition: post.condition || '',
        material: post.material || '',
        filling: post.filling || '',
        species: post.species || '',
        delivery_method: post.delivery_method || '',
        delivery_cost: post.delivery_cost || 0,
        size: post.size || '',
        color: post.color || '',
        forSale: post.for_sale || false,
        timestamp: post.created_at,
        createdAt: post.created_at,
        created_at: post.created_at,
        updatedAt: post.created_at,
        likes: 0,
        comments: 0
      }));

      setResults({
        users: users || [],
        posts: posts
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search users, posts, or marketplace items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {(results.users.length > 0 || results.posts.length > 0) && (
        <div className="space-y-4">
          {results.users.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <User className="h-4 w-4" />
                  Users ({results.users.length})
                </h3>
                <div className="space-y-2">
                  {results.users.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="h-8 w-8 rounded-full bg-softspot-500 flex items-center justify-center text-white text-sm">
                        {user.username?.[0]?.toUpperCase() || user.first_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {user.username || `${user.first_name} ${user.last_name}`.trim()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {results.posts.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <Package className="h-4 w-4" />
                  Posts & Marketplace ({results.posts.length})
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {results.posts.map((post) => (
                    <div key={post.id} className="p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex gap-3">
                        {post.image && (
                          <img src={post.image} alt={post.title} className="h-12 w-12 rounded object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                            {post.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                            {post.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {post.forSale && post.price && (
                              <Badge variant="secondary">${post.price}</Badge>
                            )}
                            {post.brand && (
                              <Badge variant="outline">{post.brand}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
