
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface EmptyFeedProps {
  onCreatePost: () => void;
}

export const EmptyFeed = ({ onCreatePost }: EmptyFeedProps) => {
  return (
    <div className="py-12 text-center">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="flex justify-center">
          <ImagePlus className="h-12 w-12 text-softspot-300" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
        <p className="mt-2 text-gray-500">Try a different search or create a new post.</p>
        <Button 
          className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white"
          onClick={onCreatePost}
        >
          Create Post
        </Button>
      </div>
    </div>
  );
};
