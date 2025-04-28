
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

const Feed = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<ExtendedPost | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  
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
  
  const handleCreatePost = (postData: PostCreationData) => {
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
    
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    
    const storedPosts = localStorage.getItem('userPosts');
    const existingUserPosts = storedPosts ? JSON.parse(storedPosts) : [];
    const updatedUserPosts = [newPost, ...existingUserPosts];
    localStorage.setItem('userPosts', JSON.stringify(updatedUserPosts));
    
    toast({
      title: "Post created successfully!",
      description: "Your post is now visible in your profile and feed."
    });
    
    setIsPostCreationOpen(false);
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
        
        {filteredPosts.length > 0 ? (
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
