import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { PlusCircle, ImagePlus, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { PostDialog } from "@/components/PostDialog";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { ShareMenu } from "@/components/post/ShareMenu";
import { PostCreationData, Post } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";

interface ExtendedPost extends Post {
  description?: string;
  tags?: string[];
  timestamp: string; // Add this to enforce timestamp as a required field
}

const Feed = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<ExtendedPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  
  // Load user posts from localStorage on component mount
  useEffect(() => {
    const storedPosts = localStorage.getItem('userPosts');
    if (storedPosts) {
      const userPosts = JSON.parse(storedPosts);
      setPosts(userPosts);
    }
  }, []);
  
  const filteredPosts = posts.filter(post => 
    (post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (post.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const openPostDialog = (post: ExtendedPost) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const closePostDialog = () => {
    setDialogOpen(false);
  };

  const handleCreatePost = (postData: PostCreationData) => {
    const username = user?.username || user?.firstName || "Anonymous";
    
    // Create new post with user data
    const newPost: ExtendedPost = {
      id: `post-${Date.now()}`,
      userId: user?.id || 'anonymous',
      image: postData.image,
      title: postData.title,
      username: username,
      likes: 0,
      comments: 0,
      description: postData.description || "",
      tags: postData.tags || [],
      timestamp: new Date().toISOString(),
    };
    
    // Add new post to the beginning of the list
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    
    // Store user's posts in localStorage
    const storedPosts = localStorage.getItem('userPosts');
    const existingUserPosts = storedPosts ? JSON.parse(storedPosts) : [];
    const updatedUserPosts = [newPost, ...existingUserPosts];
    localStorage.setItem('userPosts', JSON.stringify(updatedUserPosts));
    
    toast({
      title: "Post created successfully!",
      description: "Your post is now visible in your profile and feed."
    });
    
    // Close the dialog
    setIsPostCreationOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search posts or #tags..."
                className="pl-9 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              className="bg-softspot-400 hover:bg-softspot-500 text-white whitespace-nowrap"
              onClick={() => setIsPostCreationOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>
        
        {/* Instagram-style grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 md:gap-3">
            {filteredPosts.map((post) => (
              <div 
                key={post.id}
                className="relative group"
              >
                <div 
                  className="cursor-pointer"
                  onClick={() => openPostDialog(post)}
                >
                  <AspectRatio ratio={1} className="bg-gray-100">
                    <img
                      src={post.image}
                      alt={post.title || "Post"}
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <div className="text-white font-medium p-2 text-center">
                      <h3 className="text-lg line-clamp-2">{post.title}</h3>
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

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ShareMenu postId={post.id} title={post.title || ''} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex justify-center">
                <ImagePlus className="h-12 w-12 text-softspot-300" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
              <p className="mt-2 text-gray-500">Try a different search or create a new post.</p>
              <Button 
                className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white"
                onClick={() => setIsPostCreationOpen(true)}
              >
                Create Post
              </Button>
            </div>
          </div>
        )}

        {/* Post Dialog */}
        <PostDialog 
          isOpen={dialogOpen} 
          onClose={closePostDialog} 
          post={selectedPost} 
        />

        {/* Post Creation Flow */}
        <PostCreationFlow
          isOpen={isPostCreationOpen}
          onClose={() => setIsPostCreationOpen(false)}
          onPostCreated={handleCreatePost}
        />
      </div>
    </div>
  );
};

export default Feed;
