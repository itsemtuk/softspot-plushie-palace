
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtendedPost } from "@/types/marketplace";
import { useNavigate } from "react-router-dom";

interface ProfilePostsGridProps {
  posts: ExtendedPost[];
  onPostClick: (post: ExtendedPost) => void;
}

export const ProfilePostsGrid = ({ posts, onPostClick }: ProfilePostsGridProps) => {
  const navigate = useNavigate();

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex justify-center">
            <ImagePlus className="h-12 w-12 text-softspot-300" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No posts yet</h3>
          <p className="mt-2 text-gray-500">Create your first post to share with the community.</p>
          <Button 
            className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white"
            onClick={() => navigate('/feed')}
          >
            Create Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => onPostClick(post)}
        >
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex flex-col justify-end p-4 transition-all duration-300">
            <h3 className="text-white font-medium opacity-0 hover:opacity-100">{post.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};
