
import { useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { ArrowLeft, UserPlus, MessageSquare, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExtendedPost } from "@/types/core";
import MainLayout from "@/components/layout/MainLayout";
import UserProfileHeader from "@/components/UserProfileHeader";
import { ProfilePostsGrid } from "@/components/profile/ProfilePostsGrid";
import { usePostDialog } from "@/hooks/use-post-dialog";
import { toast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { PostCreationData } from "@/types/core";
import { addPost } from "@/utils/posts/postManagement";
import { useUserData } from "@/hooks/useUserData";
import { useUserPosts } from "@/hooks/useUserPosts";

const UserProfilePage = () => {
  const { user } = useUser();
  const { username } = useParams<{ username: string }>();
  
  // Redirect to /profile if this is the current logged-in user
  if (user && (user.username === username || user.id === username)) {
    return <Navigate to="/profile" replace />;
  }
  
  const navigate = useNavigate();
  const { userData, profileData, isLoading, error } = useUserData(username);
  const { posts: userPosts, marketplacePosts } = useUserPosts(userData?.id);
  const { openPostDialog } = usePostDialog();

  // Data fetching is now handled by the custom hooks

  const handlePostClick = (post: ExtendedPost) => {
    openPostDialog(post);
  };

  const handlePostCreated = async (postData: PostCreationData) => {
    if (!userData) return;
    
    try {
      const newPost: ExtendedPost = {
        ...postData,
        id: `post-${Date.now()}`,
        userId: userData.id,
        user_id: userData.id,
        username: userData.username || userData.first_name || 'User',
        likes: 0,
        comments: 0,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: '',
        forSale: false,
        tags: [],
        sold: false
      };

      const result = await addPost(newPost);
      if (result.success) {
        // Since this is not the user's own profile, we don't modify posts
        toast({
          title: "Post created!",
          description: "Your post has been added successfully."
        });
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (!userData) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            User not found
          </h2>
          <Button onClick={() => navigate('/users')}>
            Browse Users
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout includeFooter={true}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <UserProfileHeader
          username={userData.username || userData.first_name || 'User'}
          isOwnProfile={false}
          profileData={profileData}
          userId={userData.id}
        />

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="bg-white shadow-sm mb-6 rounded-full w-full flex justify-center p-1">
            <TabsTrigger value="posts" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              Posts ({userPosts.length})
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              Market
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              Badges
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <Card className="overflow-hidden bg-transparent shadow-none">
              {userPosts.length > 0 || true ? (
                <ProfilePostsGrid
                  posts={userPosts}
                  onPostClick={handlePostClick}
                  isOwnProfile={false}
                  showCreateButton={false}
                  onPostCreated={handlePostCreated}
                />
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Posts Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    This user hasn't shared any posts yet.
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="market">
            <Card className="overflow-hidden bg-transparent shadow-none">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Marketplace Items
                </h3>
                <span className="text-sm text-gray-500">{marketplacePosts.length} items for sale</span>
              </div>
              
              {marketplacePosts.length > 0 ? (
                <ProfilePostsGrid
                  posts={marketplacePosts}
                  onPostClick={handlePostClick}
                  isOwnProfile={false}
                  showCreateButton={false}
                  onPostCreated={handlePostCreated}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No items for sale
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400">
                    {userData.username || userData.first_name} hasn't listed any items for sale yet.
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Reviews & Ratings
              </h3>
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No reviews available for this user yet.
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="badges">
            <Card className="shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Achievement Badges
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No badges earned yet
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                About {userData.username || userData.first_name}
              </h3>
              <div className="space-y-4">
                {profileData?.bio ? (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Bio</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{profileData.bio}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    This user hasn't added a bio yet.
                  </p>
                )}
                
                {/* Social Media Links */}
                {(profileData?.instagram || profileData?.twitter || profileData?.youtube || profileData?.website) && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Social Links</h4>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {profileData?.instagram && (
                        <a 
                          href={`https://instagram.com/${profileData.instagram}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          @{profileData.instagram}
                        </a>
                      )}
                      {profileData?.twitter && (
                        <a 
                          href={`https://twitter.com/${profileData.twitter}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          @{profileData.twitter}
                        </a>
                      )}
                      {profileData?.youtube && (
                        <a 
                          href={`https://youtube.com/@${profileData.youtube}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                          {profileData.youtube}
                        </a>
                      )}
                      {profileData?.website && (
                        <a 
                          href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                          </svg>
                          Website
                        </a>
                      )}
                    </div>
                  </div>
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
                  <h4 className="font-medium text-gray-900 dark:text-white">Member Since</h4>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">2024</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UserProfilePage;
