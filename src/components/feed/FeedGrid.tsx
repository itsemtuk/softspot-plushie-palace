
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tag } from "lucide-react";
import { ShareMenu } from "@/components/post/ShareMenu";
import { ExtendedPost } from "@/types/marketplace";
import { useNavigate } from "react-router-dom";

interface FeedGridProps {
  posts: ExtendedPost[];
  onPostClick: (post: ExtendedPost) => void;
}

export const FeedGrid = ({ posts, onPostClick }: FeedGridProps) => {
  const navigate = useNavigate();

  const handlePostClick = (post: ExtendedPost) => {
    onPostClick(post);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 md:gap-3">
      {posts.map((post) => (
        <div 
          key={post.id}
          className="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div 
            className="cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <AspectRatio ratio={1} className="bg-gray-100">
              <img
                src={post.image}
                alt={post.title || "Post"}
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

          {/* Share button with semi-transparent background */}
          <div className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1 shadow-sm">
            <ShareMenu postId={post.id} title={post.title || ''} />
          </div>
        </div>
      ))}
    </div>
  );
}
