
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, RefreshCw, Users } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/use-create-post";

interface FeedHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreatePost: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onToggleUserSearch?: () => void;
}

export const FeedHeader = ({ 
  searchQuery, 
  setSearchQuery, 
  onCreatePost,
  onRefresh,
  isRefreshing = false,
  onToggleUserSearch
}: FeedHeaderProps) => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { setIsPostCreationOpen } = useCreatePost();
  
  const handleCreatePost = () => {
    console.log("FeedHeader: Create post button clicked");
    
    if (!isLoaded) {
      toast({
        title: "Loading...",
        description: "Please wait while we load your account information."
      });
      return;
    }
    
    if (!user?.id) {
      console.log("User not authenticated, redirecting to sign in");
      toast({
        title: "Authentication Required",
        description: "Please sign in to create posts."
      });
      navigate('/sign-in');
      return;
    }
    
    console.log("FeedHeader: Opening post creation dialog");
    setIsPostCreationOpen(true);
    onCreatePost();
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Feed</h1>
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
            className="pl-9 bg-white dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {onToggleUserSearch && (
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleUserSearch}
            title="Find users to follow"
          >
            <Users className="h-4 w-4" />
          </Button>
        )}
        <Button 
          className="bg-softspot-500 hover:bg-softspot-600 text-white whitespace-nowrap"
          onClick={handleCreatePost}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>
    </div>
  );
};
