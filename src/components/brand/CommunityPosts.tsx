
import { ImagePlus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Post } from "@/types/marketplace";

interface CommunityPostsProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export const CommunityPosts = ({ posts, onPostClick }: CommunityPostsProps) => {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex justify-center">
            <ImagePlus className="h-12 w-12 text-softspot-300" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
          <p className="mt-2 text-gray-500">Try a different search or create a new post.</p>
          <Button className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white">
            Create Post
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {posts.map((post) => (
        <div 
          key={post.id}
          className="relative cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => onPostClick(post)}
        >
          <AspectRatio ratio={1} className="bg-gray-100">
            <img
              src={post.image}
              alt={post.title || ''}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="text-white font-medium p-2 text-center">
              <h3 className="text-lg line-clamp-2">{post.title}</h3>
              <div className="flex items-center justify-center gap-4 mt-2">
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{post.tags.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
