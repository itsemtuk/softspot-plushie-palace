
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
import { cleanupStorage, getCurrentUserId, updateSyncTimestamp } from "@/utils/storage/localStorageUtils";
import { isSupabaseConfigured } from "@/utils/supabase/client";
import { UserSearch } from "@/components/user/UserSearch";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

const Feed = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<ExtendedPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCloudSyncEnabled] = useState(isSupabaseConfigured());
  const [showUserSearch, setShowUserSearch] = useState(false);
  const isMobile = useIsMobile();
  
  // Store current username in localStorage for comments
  useEffect(() => {
    if (user) {
      const username = user.username || user.firstName || "Anonymous";
      localStorage.setItem('currentUsername', username);
      localStorage.setItem('currentUserId', user.id);
    }
  }, [user]);
  
  // Load posts on component mount or when refresh is triggered
  const loadPosts = async () => {
    setIsLoading(prev => isRefreshing ? prev : true);
    setIsRefreshing(true);
    
    try {
      // Clean up storage to remove duplicates
      cleanupStorage();
      
      // Get posts from storage (Supabase or localStorage)
      const fetchedPosts = await getPosts();
      
      // Filter out any obvious duplicates again (by ID)
      const uniquePostMap = new Map<string, ExtendedPost>();
      fetchedPosts.forEach(post => {
        if (!uniquePostMap.has(post.id) || 
            (post.timestamp && uniquePostMap.get(post.id)!.timestamp && 
             new Date(post.timestamp) > new Date(uniquePostMap.get(post.id)!.timestamp!))) {
          uniquePostMap.set(post.id, post);
        }
      });
      
      const uniquePosts = Array.from(uniquePostMap.values());
      
      setPosts(uniquePosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        variant: "destructive",
        title: "Error loading posts",
        description: isCloudSyncEnabled 
          ? "Could not connect to the cloud server. Please try again later."
          : "Posts are currently stored locally on this device. Login to sync to the cloud."
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    loadPosts();
    
    // Add an interval to check for updates every minute
    const intervalId = setInterval(() => {
      loadPosts();
    }, 60000); // Check for updates every minute
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  const filteredPosts = posts.filter(post => 
    (post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (post.username?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreatePost = async (postData: PostCreationData) => {
    const userId = user?.id || localStorage.getItem('currentUserId');
    
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create posts."
      });
      return;
    }
    
    const username = user?.username || user?.firstName || localStorage.getItem('currentUsername') || "Anonymous";
    
    // Create the new post with all required properties
    const newPost: ExtendedPost = {
      id: `post-${Date.now()}`,
      userId: userId,
      image: postData.image,
      title: postData.title,
      username: username,
      likes: 0,
      comments: 0,
      description: postData.description || "",
      tags: postData.tags || [],
      timestamp: new Date().toISOString(),
      price: 0, // Default price
      forSale: false, // Not for sale by default
      condition: "New", // Default condition
      color: "", // Default color
      material: "", // Default material
      location: postData.location // Include location
    };
    
    try {
      // Add the post to storage
      const result = await addPost(newPost);
      
      if (result.success) {
        // Update the local state with the new post at the top
        setPosts(prevPosts => [newPost, ...prevPosts]);
        
        // Update timestamp to prevent duplication
        updateSyncTimestamp();
        
        // Close the post creation dialog
        setIsPostCreationOpen(false);
        
        toast({
          title: "Post created successfully!",
          description: isCloudSyncEnabled 
            ? "Your post has been saved to the cloud and is now visible in your profile and feed."
            : "Your post has been saved locally. Sign in to sync to the cloud."
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
      {isMobile ? <MobileNav /> : <Navbar />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FeedHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCreatePost={() => setIsPostCreationOpen(true)}
          onRefresh={loadPosts}
          isRefreshing={isRefreshing}
          onToggleUserSearch={() => setShowUserSearch(!showUserSearch)}
        />
        
        {showUserSearch && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <UserSearch />
          </div>
        )}
        
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
