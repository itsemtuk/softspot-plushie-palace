
import { useState } from "react";
import { Plus, Heart, MessageCircle, Edit, Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { ExtendedPost } from "@/types/core";
import { useCreatePost } from "@/hooks/use-create-post";
import { toast } from "@/components/ui/use-toast";
import { isAuthenticated } from "@/utils/auth/authState";
import { useNavigate } from "react-router-dom";

interface ProfilePostsGridProps {
  posts: ExtendedPost[];
  onPostClick: (post: ExtendedPost) => void;
  onDeletePost?: (postId: string) => void;
  isOwnProfile: boolean;
  showCreateButton: boolean;
}

export const ProfilePostsGrid = ({ 
  posts, 
  onPostClick, 
  onDeletePost,
  isOwnProfile, 
  showCreateButton 
}: ProfilePostsGridProps) => {
  const { setIsPostCreationOpen } = useCreatePost();
  const navigate = useNavigate();

  const handleCreatePost = () => {
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts."
      });
      navigate('/sign-in');
      return;
    }
    setIsPostCreationOpen(true);
  };

  const handleEditPost = (e: React.MouseEvent, post: ExtendedPost) => {
    e.stopPropagation();
    // Navigate to edit page or open edit modal
    navigate(`/edit-post/${post.id}`);
  };

  const handleDeletePost = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (onDeletePost && window.confirm('Are you sure you want to delete this post?')) {
      onDeletePost(postId);
    }
  };

  if (posts.length === 0 && showCreateButton) {
    return (
      <div className="text-center py-16">
        <div className="mb-4">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-500 mb-6">Share your first plushie moment!</p>
        <Button onClick={handleCreatePost} className="bg-softspot-500 hover:bg-softspot-600">
          <Plus className="mr-2 h-4 w-4" />
          Create your first post
        </Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-500">This user hasn't shared anything yet.</p>
      </div>
    );
  }

  return (
    <div>
      {showCreateButton && (
        <div className="mb-6">
          <Button 
            onClick={handleCreatePost}
            className="w-full bg-softspot-500 hover:bg-softspot-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card 
            key={post.id} 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
            onClick={() => onPostClick(post)}
          >
            {post.image ? (
              <AspectRatio ratio={1} className="bg-gray-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            ) : (
              <div className="bg-gradient-to-br from-softspot-100 to-softspot-200 p-6 min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-3">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-4">
                    {post.description}
                  </p>
                </div>
              </div>
            )}
            
            <CardContent className="p-4">
              {post.image && (
                <>
                  <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.description}</p>
                </>
              )}
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-gray-500">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-xs">{post.likes || 0}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">{post.comments || 0}</span>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleEditPost(e, post)}
                      className="p-1 h-auto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeletePost(e, post.id)}
                      className="p-1 h-auto text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
