import { useState } from "react";
import { Search, User, Package, Hash, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { ExtendedPost } from "@/types/core";

interface SearchResult {
  users: any[];
  posts: ExtendedPost[];
  marketplace: any[];
}

export function UnifiedSearchSystem() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({ users: [], posts: [], marketplace: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

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

      // Search posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .ilike('content', `%${query}%`)
        .limit(20);

      // Search marketplace items (placeholder for now)
      const marketplace: any[] = [];

      const posts: ExtendedPost[] = (postsData || []).map(post => ({
        id: post.id,
        userId: post.user_id,
        user_id: post.user_id,
        username: 'Unknown User',
        content: post.content || '',
        image: '',
        title: '',
        description: '',
        brand: '',
        price: 0,
        condition: '',
        material: '',
        filling: '',
        species: '',
        delivery_method: '',
        delivery_cost: 0,
        size: '',
        color: '',
        forSale: false,
        timestamp: post.created_at,
        createdAt: post.created_at,
        created_at: post.created_at,
        updatedAt: post.created_at,
        likes: 0,
        comments: 0,
        tags: []
      }));

      setResults({
        users: users || [],
        posts: posts,
        marketplace: marketplace
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalResults = results.users.length + results.posts.length + results.marketplace.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Discover SoftSpot
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find users, posts, plushies, and everything in the community
        </p>
      </div>

      {/* Search Input */}
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for users, posts, or plushies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={isLoading} className="bg-softspot-500 hover:bg-softspot-600">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {/* Quick Filters */}
      {!query && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">Popular Categories</h3>
          <div className="flex flex-wrap gap-2">
            {['Sanrio', 'Pokemon', 'Jellycat', 'Build a Bear', 'Squishmallows', 'Disney'].map((category) => (
              <Badge 
                key={category} 
                variant="outline" 
                className="cursor-pointer hover:bg-softspot-100 dark:hover:bg-softspot-900"
                onClick={() => setQuery(category)}
              >
                <Hash className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Results */}
      {totalResults > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
            <TabsTrigger value="users">Users ({results.users.length})</TabsTrigger>
            <TabsTrigger value="posts">Posts ({results.posts.length})</TabsTrigger>
            <TabsTrigger value="marketplace">Items ({results.marketplace.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {results.users.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="flex items-center gap-2 font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    <User className="h-4 w-4" />
                    Users
                  </h3>
                  <div className="space-y-2">
                    {results.users.slice(0, 3).map((user) => (
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
                  <h3 className="flex items-center gap-2 font-semibold mb-3 text-gray-900 dark:text-gray-100">
                    <Package className="h-4 w-4" />
                    Posts
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {results.posts.slice(0, 4).map((post) => (
                      <div key={post.id} className="p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{post.username}</span>
                          <span>•</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  <User className="h-4 w-4" />
                  Users
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
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardContent className="p-4">
                <h3 className="flex items-center gap-2 font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  <Package className="h-4 w-4" />
                  Posts
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {results.posts.map((post) => (
                    <div key={post.id} className="p-3 rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{post.username}</span>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace">
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Marketplace Search Coming Soon
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We're working on marketplace search functionality. For now, browse the marketplace directly.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
