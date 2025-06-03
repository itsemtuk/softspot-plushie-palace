
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, TrendingUp, Users, MapPin, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { ExtendedPost } from "@/types/core";
import { getPosts } from "@/utils/postStorage";
import { getAllPosts } from "@/utils/posts/postFetch";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get search query from URL params
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, [searchParams]);

  // Optimized data fetching with memoization
  const fetchPosts = useMemo(() => async () => {
    setIsLoading(true);
    try {
      // Use Promise.allSettled to avoid blocking on failed requests
      const [allPostsResult, userPostsResult] = await Promise.allSettled([
        getAllPosts(),
        getPosts()
      ]);
      
      const allPosts = allPostsResult.status === 'fulfilled' ? allPostsResult.value : [];
      const userPosts = userPostsResult.status === 'fulfilled' ? userPostsResult.value : [];
      
      // Combine and deduplicate posts efficiently
      const postMap = new Map();
      [...allPosts, ...userPosts].forEach(post => {
        if (post.id && !postMap.has(post.id)) {
          postMap.set(post.id, post);
        }
      });
      
      setPosts(Array.from(postMap.values()));
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  // Optimized filtering with useMemo
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    
    const searchLower = searchTerm.toLowerCase();
    return posts.filter((post) => 
      post.title?.toLowerCase().includes(searchLower) ||
      post.description?.toLowerCase().includes(searchLower) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }, [posts, searchTerm]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-softspot-500"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <Card className="mb-4 rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Discover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search for posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                </div>
              </div>
              <div>
                <Button className="w-full rounded-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="bg-white shadow-sm mb-6 rounded-full w-full flex justify-center p-1">
            <TabsTrigger value="trending" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              <Users className="h-4 w-4 mr-2" />
              <span>New</span>
            </TabsTrigger>
            <TabsTrigger value="nearby" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Nearby</span>
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              <Tag className="h-4 w-4 mr-2" />
              <span>Tags</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="trending">
            {filteredPosts.length === 0 ? (
              <Card className="text-center py-12 rounded-2xl">
                <CardContent>
                  <div className="text-gray-500 mb-4">
                    <Search className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No posts found</h3>
                    <p>Try a different search term or explore without filters</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 group rounded-2xl"
                    onClick={() => handlePostClick(post.id)}
                  >
                    <AspectRatio ratio={1} className="bg-gray-100">
                      <img
                        src={post.image || '/placeholder.svg'}
                        alt={post.title || ''}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </AspectRatio>

                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="text-white font-medium p-2 text-center">
                        <h3 className="text-lg line-clamp-2">{post.title || ''}</h3>
                        <div className="flex items-center justify-center gap-4 mt-2">
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center">
                              <Tag className="h-4 w-4 mr-1" />
                              <span>{post.tags.length}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="new">
            <div className="text-center py-12 text-gray-500">
              <h3 className="text-lg font-medium">New Posts</h3>
              <p>Latest posts from the community</p>
            </div>
          </TabsContent>
          <TabsContent value="nearby">
            <div className="text-center py-12 text-gray-500">
              <h3 className="text-lg font-medium">Nearby Posts</h3>
              <p>Posts from users in your area</p>
            </div>
          </TabsContent>
          <TabsContent value="tags">
            <div className="text-center py-12 text-gray-500">
              <h3 className="text-lg font-medium">Browse by Tags</h3>
              <p>Explore posts by popular tags</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Discover;
