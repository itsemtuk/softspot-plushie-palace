
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useParams } from 'react-router-dom';
import { isAuthenticated } from "@/utils/auth/authState";
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserPosts } from '@/utils/posts/postFetch';
import { ExtendedPost } from '@/types/marketplace';
import { Spinner } from '@/components/ui/spinner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeedGrid } from '@/components/feed/FeedGrid';
import { usePostDialog } from '@/hooks/use-post-dialog';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);
  const [username, setUsername] = useState('');
  const { openPostDialog } = usePostDialog();

  useEffect(() => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to view user profiles."
      });
      navigate('/sign-in');
      return;
    }

    const loadUserData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const posts = await getUserPosts(userId);
        setUserPosts(posts);
        
        // Set username from the first post if available
        if (posts.length > 0 && posts[0].username) {
          setUsername(posts[0].username);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user profile data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, navigate]);

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-softspot-100">
                  <AvatarImage 
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${username}`}
                    alt={username} 
                  />
                  <AvatarFallback>{username?.charAt(0) || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{username}</h1>
                  <p className="text-gray-500">{userPosts.length} posts</p>
                </div>
              </div>
            </div>
            
            {/* Tabs for different content types */}
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="forSale">For Sale</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts">
                {userPosts.length > 0 ? (
                  <FeedGrid posts={userPosts} onPostClick={handlePostClick} />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500">This user hasn't posted anything yet.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="forSale">
                {userPosts.filter(post => post.forSale).length > 0 ? (
                  <FeedGrid posts={userPosts.filter(post => post.forSale)} onPostClick={handlePostClick} />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500">This user doesn't have any items for sale.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default UserProfile;
