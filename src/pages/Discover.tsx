import { useState, useEffect } from "react";
import { Search, Filter, TrendingUp, Users, MapPin, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { ExtendedPost } from "@/types/core";
import { getAllPosts } from "@/utils/postStorage";
import { PostCard } from "@/components/post/PostCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useNavigate } from "react-router-dom";

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [sortTerm, setSortTerm] = useState("");
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await getAllPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Discover</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="search"
                  placeholder="Search for posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Button className="w-full">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="relative cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => handlePostClick(post.id)}
                >
                  <AspectRatio ratio={1} className="bg-gray-100">
                    <img
                      src={post.image || ''}
                      alt={post.title || ''}
                      className="object-cover w-full h-full"
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
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="new">
            <div>New content</div>
          </TabsContent>
          <TabsContent value="nearby">
            <div>Nearby content</div>
          </TabsContent>
          <TabsContent value="tags">
            <div>Tags content</div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Discover;
