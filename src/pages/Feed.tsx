
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PostDialog } from "@/components/PostDialog";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData, ExtendedPost } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/clerk-react";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { EmptyFeed } from "@/components/feed/EmptyFeed";
import { getPosts, addPost } from "@/utils/postStorage";
import { cleanupStorage, getCurrentUserId, updateSyncTimestamp } from "@/utils/storage/localStorageUtils";
import { isSupabaseConfigured } from "@/utils/supabase/client";
import { UserSearch } from "@/components/user/UserSearch";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share2, MoreHorizontal, ImageIcon, Tag, BarChart2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

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
  const [newPostText, setNewPostText] = useState("");
  
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
  
  // Handle quick post creation
  const handleQuickPost = () => {
    if (!newPostText.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something or add an image to create a post.",
      });
      return;
    }
    
    setIsPostCreationOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {/* Create Post Section */}
        <Card className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage 
                src={user?.imageUrl || `https://api.dicebear.com/6.x/initials/svg?seed=${user?.firstName || 'User'}`} 
                alt="Profile" 
              />
              <AvatarFallback>{user?.firstName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <input 
              type="text"
              placeholder="Share your plushie news..." 
              className="flex-1 py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-softspot-400 focus:bg-white"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              onClick={() => setIsPostCreationOpen(true)}
            />
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-gray-600 hover:text-softspot-500"
              onClick={() => setIsPostCreationOpen(true)}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              <span>Photo</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-gray-600 hover:text-softspot-500"
              onClick={() => setIsPostCreationOpen(true)}
            >
              <Tag className="mr-2 h-4 w-4" />
              <span>Sell</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-gray-600 hover:text-softspot-500"
              onClick={() => setIsPostCreationOpen(true)}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              <span>Poll</span>
            </Button>
          </div>
        </Card>

        {/* Feed Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-softspot-500"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="flex items-center p-4">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage 
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.username}`}
                      alt={post.username} 
                    />
                    <AvatarFallback>{post.username?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-medium">{post.username}</h3>
                    <p className="text-xs text-gray-500">
                      {post.timestamp ? new Date(post.timestamp).toLocaleString('en-US', { 
                        hour: 'numeric',
                        minute: 'numeric',
                        day: 'numeric',
                        month: 'short'
                      }) : 'Recently'}
                      {post.forSale && <span className="text-softspot-500 ml-2">• Selling</span>}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-softspot-500">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="px-4 pb-2">
                  <p>{post.description || post.title}</p>
                </div>
                
                {post.image && (
                  <div 
                    className="w-full bg-gray-100"
                    onClick={() => {
                      setSelectedPost(post);
                      setDialogOpen(true);
                    }}
                  >
                    <img 
                      src={post.image} 
                      alt={post.title || "Post"} 
                      className="w-full object-cover max-h-96 cursor-pointer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Error';
                      }}
                    />
                  </div>
                )}
                
                {post.forSale ? (
                  <div className="p-4 border-t">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-bold text-softspot-500 text-lg">
                          ${post.price?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <Button 
                        className="bg-softspot-500 hover:bg-softspot-600 text-white"
                        onClick={() => {
                          setSelectedPost(post);
                          setDialogOpen(true);
                        }}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 flex justify-between">
                    <Button variant="ghost" size="sm" className="flex items-center text-gray-600 hover:text-softspot-500">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>{post.likes || 0}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center text-gray-600 hover:text-softspot-500"
                      onClick={() => {
                        setSelectedPost(post);
                        setDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>{post.comments || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center text-gray-600 hover:text-softspot-500">
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>Share</span>
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
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
          onClose={() => {
            setIsPostCreationOpen(false);
            setNewPostText("");
          }}
          onPostCreated={handleCreatePost}
          initialText={newPostText}
        />
      </div>
    </div>
  );
};

export default Feed;
