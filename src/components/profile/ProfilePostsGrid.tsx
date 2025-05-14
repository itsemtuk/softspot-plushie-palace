
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/marketplace";
import { PlusSquare, ShoppingBag, Trash2, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/use-create-post";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ProfilePostsGridProps {
  posts: ExtendedPost[];
  onPostClick: (post: ExtendedPost) => void;
  onDeletePost?: (postId: string) => Promise<void>;
  isOwnProfile?: boolean;
  showCreateButton?: boolean;
}

export function ProfilePostsGrid({ 
  posts, 
  onPostClick, 
  onDeletePost, 
  isOwnProfile = true,
  showCreateButton = true
}: ProfilePostsGridProps) {
  const navigate = useNavigate();
  const { setIsPostCreationOpen } = useCreatePost();
  const isMobile = useIsMobile();

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
      {!isMobile && showCreateButton && (
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

  // If no posts for own profile
  if (posts.length === 0) {
    return renderEmptyState();
  }

  return (
    <div>
      {isOwnProfile && !isMobile && showCreateButton && posts.length > 0 && (
        <div className="px-4 py-2 flex justify-end space-x-3">
          <Button
            onClick={() => setIsPostCreationOpen(true)}
            className="bg-softspot-500 hover:bg-softspot-600 text-white"
            size="sm"
          >
            <PlusSquare className="mr-2 h-4 w-4" />
            Create Post
          </Button>
          {!posts.some(post => post.forSale) && (
            <Button 
              variant="outline"
              onClick={() => navigate('/sell')}
              size="sm"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              List Item for Sale
            </Button>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-px">
        {posts.map((post) => (
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
            
            {post.forSale && (
              <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                ${post.price}
              </div>
            )}
            
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
                    <AlertDialogTitle>Delete {post.forSale ? 'Listing' : 'Post'}</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this {post.forSale ? 'listing' : 'post'}? This action cannot be undone.
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
    </div>
  );
}
