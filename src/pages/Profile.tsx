
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { TabsContent } from "@/components/ui/tabs";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { useState, useEffect } from "react";
import { ExtendedPost } from "@/types/core";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { getPosts } from "@/utils/postStorage";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  console.log("Profile page: Rendering");
  const { user } = useUser();
  const [userPosts, setUserPosts] = useState<ExtendedPost[]>([]);
  const [marketplacePosts, setMarketplacePosts] = useState<ExtendedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const { openPostDialog } = usePostDialog();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        // Fetch user data from Supabase
        const { data: supabaseUser } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', user.id)
          .maybeSingle();

        if (supabaseUser) {
          setUserData(supabaseUser);

          // Fetch profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_uuid', supabaseUser.id)
            .maybeSingle();

          if (profile) {
            setProfileData({
              bio: profile.bio || '',
              interests: profile.favorite_brands || [],
              isPrivate: profile.is_private || false
            });
          }

          // Fetch user posts
          const { data: posts } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', supabaseUser.id)
            .order('created_at', { ascending: false });

          if (posts) {
            const formattedPosts: ExtendedPost[] = posts.map(post => ({
              ...post,
              userId: post.user_id,
              user_id: post.user_id,
              username: supabaseUser.username || supabaseUser.first_name || 'User',
              likes: 0,
              comments: 0,
              timestamp: post.created_at,
              createdAt: post.created_at,
              created_at: post.created_at,
              updatedAt: post.created_at,
              location: '',
              forSale: post.for_sale || false,
              tags: [],
              sold: false
            }));
            
            // Separate regular posts from marketplace items
            const regularPosts = formattedPosts.filter(post => !post.forSale);
            const marketplaceItems = formattedPosts.filter(post => post.forSale);
            
            setUserPosts(regularPosts);
            setMarketplacePosts(marketplaceItems);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-softspot-500"></div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <TabsContent value="posts" className="mt-6">
        <ProfilePostsGrid
          posts={userPosts}
          onPostClick={handlePostClick}
          isOwnProfile={true}
          showCreateButton={true}
          onPostCreated={() => {}}
        />
      </TabsContent>
      
      <TabsContent value="marketplace" className="mt-6">
        <ProfilePostsGrid
          posts={marketplacePosts}
          onPostClick={handlePostClick}
          isOwnProfile={true}
          showCreateButton={false}
          onPostCreated={() => {}}
        />
      </TabsContent>
      
      <TabsContent value="about" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              About You
            </h3>
            <div className="space-y-4">
              {profileData?.bio ? (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Bio</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData.bio}</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Add a bio in your profile settings to tell others about yourself.
                </p>
              )}
              
              {profileData?.interests && profileData.interests.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Favorite Brands</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profileData.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary">{interest}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Stats</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-softspot-500">{userPosts.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-softspot-500">{marketplacePosts.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Marketplace Items</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </ProfileLayout>
  );
};

export default Profile;
