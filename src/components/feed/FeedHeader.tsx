
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, RefreshCw } from "lucide-react";

interface FeedHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreatePost: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const FeedHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  onCreatePost,
  onRefresh,
  isRefreshing = false
}: FeedHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="ml-2"
            title="Refresh feed"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search posts or #tags..."
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          className="bg-softspot-400 hover:bg-softspot-500 text-white whitespace-nowrap"
          onClick={onCreatePost}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>
    </div>
  );
};
