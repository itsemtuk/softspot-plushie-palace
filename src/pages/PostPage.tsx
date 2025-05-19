
import { useState, useEffect } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { PostDialog } from "@/components/PostDialog";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/marketplace";
import { getPostById } from "@/utils/postStorage";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import MainLayout from "@/components/layout/MainLayout";

const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<ExtendedPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  
  // Prevent body scrolling when dialog is open on mobile
  useEffect(() => {
    if (dialogOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [dialogOpen]);
  
  useEffect(() => {
    const loadPost = async () => {
      if (!postId) {
        setNotFound(true);
        return;
      }

      try {
        setIsLoading(true);
        const foundPost = await getPostById(postId);
        
        if (foundPost) {
          setPost(foundPost);
          // Open dialog after short delay to ensure smooth transition
          setTimeout(() => {
            setDialogOpen(isSignedIn || false);
          }, 100);
        } else {
          setNotFound(true);
          toast({
            variant: "destructive",
            title: "Post not found",
            description: "The post you're looking for doesn't exist or has been removed."
          });
        }
      } catch (error) {
        console.error('Error loading post:', error);
        toast({
          variant: "destructive",
          title: "Error loading post",
          description: "There was a problem loading this post."
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [postId, isSignedIn]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    
    // Use timeout to let dialog animation complete before navigating
    setTimeout(() => {
      // Navigate back to previous page or home
      window.history.length > 2 ? navigate(-1) : navigate('/');
    }, 300);
  };

  if (notFound) {
    return <Navigate to="/404" replace />;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : post ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
              <p className="text-gray-500 mt-1">Shared by @{post.username}</p>
            </div>

            {/* Main post content */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="md:flex">
                {/* Image on left for md+ screens, top for mobile */}
                <div className="md:w-1/2 bg-black flex items-center justify-center">
                  <img 
                    src={post.image} 
                    alt={post.title || "Post"} 
                    className="w-full h-auto object-contain md:max-h-[600px]"
                    onError={(e) => {
                      // Fallback for image loading errors
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>

                {/* Content on right for md+ screens, bottom for mobile */}
                <div className="md:w-1/2 p-6">
                  {/* Display post content */}
                  {post.description && (
                    <div className="my-4">
                      <p className="text-gray-700">{post.description}</p>
                    </div>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 my-4">
                      {post.tags.map(tag => (
                        <div key={tag} className="bg-softspot-100 text-softspot-700 px-2 py-1 rounded-full text-xs flex items-center">
                          <span className="mr-1">#</span>
                          {tag}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Guest-specific call to action */}
                  <SignedOut>
                    <div className="mt-8 bg-softspot-50 border border-softspot-100 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-softspot-800">Join SoftSpot</h3>
                      <p className="text-softspot-600 mt-1">Create an account to like, comment, and share more plushies!</p>
                      <div className="mt-4 space-x-2">
                        <Link to="/sign-up">
                          <Button className="bg-softspot-500 hover:bg-softspot-600">Sign Up</Button>
                        </Link>
                        <Link to="/sign-in">
                          <Button variant="outline">Log In</Button>
                        </Link>
                      </div>
                    </div>
                  </SignedOut>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">Post not found</h2>
            <p className="mt-2 text-gray-500">The post you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="mt-4 inline-block">
              <Button>Back to Home</Button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Only show interactive dialog for signed-in users */}
      <SignedIn>
        <PostDialog 
          isOpen={dialogOpen} 
          onClose={handleDialogClose} 
          post={post}
          isLoading={isLoading}
        />
      </SignedIn>
    </MainLayout>
  );
};

export default PostPage;
