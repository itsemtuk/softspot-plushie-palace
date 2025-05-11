
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/marketplace";
import { PlusSquare, ShoppingBag, Trash2, Image, Grid3X3, BookMarked } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/use-create-post";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ProfilePostsGridProps {
  posts: ExtendedPost[];
  onPostClick: (post: ExtendedPost) => void;
  onDeletePost?: (postId: string) => Promise<void>;
  isOwnProfile?: boolean;
}

export function ProfilePostsGrid({ posts, onPostClick, onDeletePost, isOwnProfile = true }: ProfilePostsGridProps) {
  const navigate = useNavigate();
  const { setIsPostCreationOpen } = useCreatePost();
  const isMobile = useIsMobile();

  // Get for sale posts
  const forSalePosts = posts.filter(post => post.forSale === true);
  
  // Regular posts (not for sale)
  const regularPosts = posts.filter(post => !post.forSale);

  // Function to render empty state
  const renderEmptyState = () => (
    <div className="text-center py-16 space-y-6">
      <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
        <Image className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold">No posts yet</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Share your plushie collection with the community or sell items in the marketplace.
      </p>
      {!isMobile && (
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <Button
            onClick={() => setIsPostCreationOpen(true)}
            className="bg-softspot-500 hover:bg-softspot-600 text-white"
          >
            <PlusSquare className="mr-2 h-4 w-4" />
            Create Post
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/sell')}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            List Item for Sale
          </Button>
        </div>
      )}
    </div>
  );
  
  // If no posts and viewing someone else's profile
  if (posts.length === 0 && !isOwnProfile) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold">No posts yet</h3>
        <p className="text-gray-500 mt-2">
          This user hasn't shared any posts.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-4">
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="posts" className="data-[state=active]:border-b-2 data-[state=active]:border-softspot-500 data-[state=active]:text-softspot-500">
            <Grid3X3 className="h-4 w-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="collection" className="data-[state=active]:border-b-2 data-[state=active]:border-softspot-500 data-[state=active]:text-softspot-500">
            <BookMarked className="h-4 w-4 mr-2" />
            Collection
          </TabsTrigger>
          <TabsTrigger value="forsale" className="data-[state=active]:border-b-2 data-[state=active]:border-softspot-500 data-[state=active]:text-softspot-500">
            <ShoppingBag className="h-4 w-4 mr-2" />
            For Sale
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {isOwnProfile && !isMobile && regularPosts.length > 0 && (
            <div className="px-4 py-2 flex justify-end space-x-3">
              <Button
                onClick={() => setIsPostCreationOpen(true)}
                className="bg-softspot-500 hover:bg-softspot-600 text-white"
                size="sm"
              >
                <PlusSquare className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </div>
          )}
          
          {regularPosts.length === 0 && renderEmptyState()}
          
          {regularPosts.length > 0 && (
            <div className="grid grid-cols-3 gap-px">
              {regularPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square cursor-pointer overflow-hidden relative group"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    onClick={() => onPostClick(post)}
                  />
                  
                  {/* Delete button - only show for own profile if onDeletePost is provided */}
                  {isOwnProfile && onDeletePost && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeletePost(post.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="collection">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium">Collection Coming Soon</h3>
            <p className="text-gray-500 mt-2">
              This feature will be available in a future update.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="forsale">
          {forSalePosts.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-lg font-medium">Items For Sale</h3>
              <p className="text-gray-500 mt-2">
                No items listed for sale yet.
              </p>
              {isOwnProfile && (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/sell')}
                  className="mt-4"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  List Item for Sale
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-px">
              {forSalePosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square cursor-pointer overflow-hidden relative group"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    onClick={() => onPostClick(post)}
                  />
                  
                  {/* Price tag */}
                  <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                    ${post.price}
                  </div>
                  
                  {/* Delete button - only show for own profile if onDeletePost is provided */}
                  {isOwnProfile && onDeletePost && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this listing? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDeletePost(post.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
