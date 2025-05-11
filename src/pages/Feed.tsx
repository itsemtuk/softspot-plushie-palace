
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { FeedContent } from "@/components/feed/FeedContent";
import { EmptyFeed } from "@/components/feed/EmptyFeed";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCurrentUserId } from "@/utils/storage/localStorageUtils";
import { getAllPublicPosts } from "@/utils/posts/postFetch";
import { ExtendedPost } from "@/types/marketplace";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { Spinner } from "@/components/ui/spinner";
import Footer from "@/components/Footer";

const Feed = () => {
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { openPostDialog } = usePostDialog();
  
  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      navigate('/sign-in');
      return;
    }
    
    setLoading(true);
    getAllPublicPosts()
      .then(fetchedPosts => {
        setPosts(fetchedPosts);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, [navigate]);

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <FeedHeader />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : posts.length > 0 ? (
          <FeedContent posts={posts} onPostClick={handlePostClick} />
        ) : (
          <EmptyFeed />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Feed;
