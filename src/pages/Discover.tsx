
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Heart, MessageSquare, Share, Bookmark } from "lucide-react";
import { Post, ExtendedPost } from "@/types/marketplace";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { formatTimeAgo } from "@/lib/utils";

export default function Discover() {
  const [activeTab, setActiveTab] = useState("for-you");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const [posts, setPosts] = useState<ExtendedPost[]>([]);

  useEffect(() => {
    // Get posts from localStorage
    const getPosts = () => {
      const stored = localStorage.getItem('posts');
      return stored ? JSON.parse(stored) : [];
    };
    
    const loadedPosts = getPosts();
    if (loadedPosts.length > 0) {
      setPosts(loadedPosts);
    }
  }, []);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {!isMobile ? <Navbar /> : <MobileNav />}
      
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Discover</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search posts, hashtags..."
                className="pl-10 w-full md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="for-you" className="flex-1">For You</TabsTrigger>
            <TabsTrigger value="following" className="flex-1">Following</TabsTrigger>
            <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="for-you" className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>No posts found. Follow more users or create your own posts!</p>
                <Button className="mt-4 bg-softspot-500 hover:bg-softspot-600">
                  Create a Post
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="following" className="space-y-4">
            <div className="text-center py-10 text-gray-500">
              <p>Follow more users to see their content here!</p>
              <Button className="mt-4 bg-softspot-500 hover:bg-softspot-600">
                Discover Users
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-4">
            {filteredPosts.length > 0 ? (
              [...filteredPosts]
                .sort((a, b) => (typeof a.likes === 'number' && typeof b.likes === 'number') ? 
                  b.likes - a.likes : 0)
                .map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <p>No trending posts available. Create content to get started!</p>
                <Button className="mt-4 bg-softspot-500 hover:bg-softspot-600">
                  Create a Post
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Add padding at the bottom for mobile */}
      {isMobile && <div className="h-16" />}
    </div>
  );
}

interface PostCardProps {
  post: ExtendedPost;
}

function PostCard({ post }: PostCardProps) {
  // Handle both number and array types for likes and comments
  const likeCount = typeof post.likes === 'number' ? post.likes : (Array.isArray(post.likes) ? post.likes.length : 0);
  const commentCount = typeof post.comments === 'number' ? post.comments : (Array.isArray(post.comments) ? post.comments.length : 0);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://i.pravatar.cc/150?u=${post.username}`} alt={post.username} />
            <AvatarFallback>{post.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{post.username}</div>
            <div className="text-sm text-gray-500">{formatTimeAgo(post.timestamp)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-square relative">
          <img
            src={post.image}
            alt={post.title}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold">{post.title}</h3>
          {post.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-sm text-blue-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0 pb-2">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{commentCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center">
            <Share className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="sm">
          <Bookmark className="h-4 w-4" />
        </Button>
      </CardFooter>
      <Separator />
    </Card>
  );
}
