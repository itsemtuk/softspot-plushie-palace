import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PostDialog } from "@/components/PostDialog";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData, ExtendedPost } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { EmptyFeed } from "@/components/feed/EmptyFeed";
import { FeedGrid } from "@/components/feed/FeedGrid";
import { getPosts, addPost } from "@/utils/postStorage";

const Feed = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<ExtendedPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Store current username in localStorage for comments
  useEffect(() => {
    if (user) {
      const username = user.username || user.firstName || "Anonymous";
      localStorage.setItem('currentUsername', username);
    }
  }, [user]);
  
  // Load posts on component mount or when refresh is triggered
  const loadPosts = async () => {
    setIsLoading(prev => isRefreshing ? prev : true);
    setIsRefreshing(true);
    
    try {
      // Get posts from storage (Supabase or localStorage)
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        variant: "destructive",
        title: "Error loading posts",
        description: "Could not connect to the server. Please try again later."
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    loadPosts();
  }, [user]);
  
  const filteredPosts = posts.filter(post => 
    (post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (post.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleCreatePost = async (postData: PostCreationData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create posts."
      });
      return;
    }
    
    const username = user?.username || user?.firstName || "Anonymous";
    
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
    
    try {
      // Add the post to storage
      const result = await addPost(newPost);
      
      if (result.success) {
        // Update the local state with the new post at the top
        setPosts(prevPosts => [newPost, ...prevPosts]);
        
        // Close the post creation dialog
        setIsPostCreationOpen(false);
        
        toast({
          title: "Post created successfully!",
          description: "Your post is now visible in your profile and feed."
        });
      } else {
        throw new Error(result.error || "Failed to save post");
      }
    } catch (error) {
      console.error('Error saving post:', error);
      throw error; // Re-throw to be caught by the PostCreationFlow component
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeedHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreatePost={() => setIsPostCreationOpen(true)}
          onRefresh={loadPosts}
          isRefreshing={isRefreshing}
        />
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-softspot-500"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <FeedGrid 
            posts={filteredPosts} 
            onPostClick={(post) => {
              setSelectedPost(post);
              setDialogOpen(true);
            }}
          />
        ) : (
          <EmptyFeed onCreatePost={() => setIsPostCreationOpen(true)} />
        )}

        {/* Remove the onPostUpdate prop since it doesn't exist in PostDialog */}
        <PostDialog 
          isOpen={dialogOpen} 
          onClose={() => setDialogOpen(false)} 
          post={selectedPost}
        />

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
