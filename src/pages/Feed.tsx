import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { FeedContent } from "@/components/feed/FeedContent";
import { EmptyFeed } from "@/components/feed/EmptyFeed";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCurrentUserId } from "@/utils/storage/localStorageUtils";
import { getPosts } from "@/utils/posts/postFetch";
import { ExtendedPost } from "@/types/marketplace";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { Spinner } from "@/components/ui/spinner";
import Footer from "@/components/Footer";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";
import { QuickPostForm } from "@/components/feed/QuickPostForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { savePost } from "@/utils/posts/postManagement";
import { PostCreationData } from "@/types/marketplace";
import { useUser } from '@clerk/clerk-react';

const Feed = () => {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [postText, setPostText] = useState(""); 
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { openPostDialog } = usePostDialog();
  const { user } = useUser();
  
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getPosts();
      console.log("Fetched posts:", fetchedPosts.length);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error",
        description: "Failed to load posts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view the feed."
      });
      navigate('/sign-in');
      return;
    }
    
    fetchPosts();
  }, [navigate]);
  
  const handleCreatePostClick = () => {
    console.log("Create post button clicked on Feed page");
    
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts."
      });
      navigate('/sign-in');
      return;
    }
    
    setIsPostCreationOpen(true);
  };

  const handlePostCreated = async (data: PostCreationData) => {
    try {
      console.log("Creating post with data:", data);
      setIsSubmitting(true);
      
      const username = user?.username || user?.firstName || "Anonymous";
      const userId = user?.id || getCurrentUserId();
      
      if (!userId) {
        throw new Error("User ID not found");
      }

      const newPost: ExtendedPost = {
        ...data,
        id: `post-${Date.now()}`,
        userId: userId,
        user_id: userId,
        username: username,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        content: data.description,
        forSale: false
      };

      console.log("Saving new post:", newPost);
      const result = await savePost(newPost, userId);
      
      if (result.success) {
        toast({
          title: "Success!",
          description: "Your post has been created."
        });
        
        setIsPostCreationOpen(false);
        
        // Immediately add the post to the feed and then refresh
        setPosts(prevPosts => [newPost, ...prevPosts]);
        
        // Also refresh the posts to ensure we have the latest data
        setTimeout(() => {
          fetchPosts();
        }, 1000);
      } else {
        throw new Error(result.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSellPlushie = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to sell items."
      });
      navigate('/sign-in');
      return;
    }
    
    navigate('/sell');
  };
  
  const handleRefresh = () => {
    fetchPosts();
  };

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };

  // Filter posts based on search query
  const filteredPosts = searchQuery
    ? posts.filter(post => 
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : posts;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <FeedHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onCreatePost={handleCreatePostClick}
          onRefresh={handleRefresh}
          isRefreshing={loading} 
        />
        
        <QuickPostForm 
          onCreatePost={handleCreatePostClick} 
          value={postText} 
          onChange={setPostText} 
        />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <FeedContent posts={filteredPosts} onPostClick={handlePostClick} />
        ) : (
          <EmptyFeed onCreatePost={handleCreatePostClick} />
        )}
      </main>
      
      {/* Mobile create post button */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-50">
          <Button 
            onClick={handleCreatePostClick} 
            className="bg-softspot-500 hover:bg-softspot-600 text-white h-14 w-14 rounded-full shadow-lg p-0"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Post Creation Flow */}
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={() => setIsPostCreationOpen(false)}
        onPostCreated={handlePostCreated}
        isSubmitting={isSubmitting}
      />
      
      <Footer />
    </div>
  );
};

export default Feed;
