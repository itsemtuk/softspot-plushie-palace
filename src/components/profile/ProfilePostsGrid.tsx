
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/marketplace";
import { PlusSquare, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/use-create-post";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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

  if (posts.length === 0 && isOwnProfile) {
    return (
      <div className="text-center py-16 space-y-6">
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
  }

  if (posts.length === 0) {
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
    <div>
      {isOwnProfile && !isMobile && (
        <div className="mb-6 flex justify-end space-x-3">
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
      
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="aspect-square cursor-pointer overflow-hidden relative group"
          >
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
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
    </div>
  );
}
