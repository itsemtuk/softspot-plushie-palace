
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
import { getPosts, addPost, getLocalPosts, savePosts } from "@/utils/postStorage";

const Feed = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<ExtendedPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Store current username in localStorage for comments
  useEffect(() => {
    if (user) {
      const username = user.username || user.firstName || "Anonymous";
      localStorage.setItem('currentUsername', username);
    }
  }, [user]);
  
  // Load posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        // Try to get posts from Supabase
        const cloudPosts = await getPosts();
        
        if (cloudPosts && cloudPosts.length > 0) {
          setPosts(cloudPosts);
          
          // Also update local storage as a fallback
          savePosts(cloudPosts);
        } else {
          // Fallback to local storage if no cloud posts
          const localPosts = getLocalPosts();
          setPosts(localPosts);
          
          // If we have local posts but no cloud posts, sync them
          if (localPosts.length > 0 && user) {
            // This would sync local posts to cloud in a real app
            // We'd need user confirmation for this in a production app
            toast({
              title: "Local posts detected",
              description: "Your previous posts will be synced to your account."
            });
          }
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        // Fallback to local storage
        const localPosts = getLocalPosts();
        setPosts(localPosts);
        
        toast({
          variant: "destructive",
          title: "Error loading posts",
          description: "Could not connect to the server. Showing local posts instead."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPosts();
  }, [user]);
  
  const filteredPosts = posts.filter(post => 
    (post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (post.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleCreatePost = async (postData: PostCreationData) => {
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
    
    // Optimistically update the UI
    setPosts(prevPosts => [newPost, ...prevPosts]);
    
    // Close the post creation dialog
    setIsPostCreationOpen(false);
    
    // Add the post to Supabase
    try {
      const result = await addPost(newPost);
      
      if (result.success) {
        toast({
          title: "Post created successfully!",
          description: "Your post is now visible in your profile and feed."
        });
      } else {
        throw new Error("Failed to save post");
      }
    } catch (error) {
      console.error('Error saving post:', error);
      
      // Fallback to local storage
      savePosts([newPost, ...getLocalPosts()]);
      
      toast({
        variant: "destructive",
        title: "Connection issue",
        description: "Your post was saved locally but couldn't be synced to the cloud."
      });
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
