
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
import { useCreatePost } from "@/hooks/use-create-post";
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from "@/components/ui/use-toast";
import { QuickPostForm } from "@/components/feed/QuickPostForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Feed = () => {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [postText, setPostText] = useState(""); 
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { openPostDialog } = usePostDialog();
  const { onCreatePost, isPostCreationOpen, setIsPostCreationOpen } = useCreatePost();
  
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
    
    setLoading(true);
    getPosts()
      .then(fetchedPosts => {
        // Filter out private posts if needed (for now showing all posts)
        setPosts(fetchedPosts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, [navigate]);
  
  const handleCreatePostClick = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts."
      });
      navigate('/sign-in');
      return;
    }
    
    onCreatePost();
  };
  
  const handleRefresh = () => {
    setLoading(true);
    getPosts()
      .then(fetchedPosts => {
        setPosts(fetchedPosts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error refreshing posts:", error);
        setLoading(false);
      });
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
      
      <Footer />
    </div>
  );
};

export default Feed;
