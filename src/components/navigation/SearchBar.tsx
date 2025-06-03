
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, User, Hash, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchType, setSearchType] = useState<"all" | "users" | "posts">("all");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      if (searchType !== 'all') {
        params.set('type', searchType);
      }
      
      // Navigate to discover page with search params
      navigate(`/discover?${params.toString()}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const handleUserSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/users?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  const quickActions = [
    {
      title: "Search Posts",
      description: "Find posts and plushies",
      icon: Hash,
      action: () => setSearchType("posts")
    },
    {
      title: "Find Users",
      description: "Connect with collectors",
      icon: User,
      action: () => setSearchType("users")
    },
    {
      title: "Messages",
      description: "Go to messages",
      icon: MessageSquare,
      action: () => {
        navigate("/messages");
        setIsOpen(false);
      }
    }
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full" ref={inputRef}>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search SoftSpot..."
              className="pl-10 pr-12 w-full rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
            <Button
              size="sm"
              variant="ghost"
              type="submit"
              className="absolute right-0 top-0 h-full rounded-l-none rounded-r-full"
            >
              Search
            </Button>
          </form>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0 rounded-xl" align="start">
        <div className="p-4 space-y-4">
          {searchQuery ? (
            <div>
              <h3 className="text-sm font-medium mb-2">Search Results</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleSearch}
                >
                  <Hash className="h-4 w-4 mr-2" />
                  Search posts: "{searchQuery}"
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleUserSearch}
                >
                  <User className="h-4 w-4 mr-2" />
                  Find users: "{searchQuery}"
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                <div className="space-y-1">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3"
                      onClick={action.action}
                    >
                      <action.icon className="h-4 w-4 mr-3 text-gray-500" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3">
                <h3 className="text-sm font-medium mb-2">Trending</h3>
                <div className="flex flex-wrap gap-2">
                  {["Vintage Bears", "Rare Jellycat", "Limited Edition"].map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      className="text-xs rounded-full"
                      onClick={() => {
                        setSearchQuery(tag);
                        handleSearch(new Event('submit') as any);
                      }}
                    >
                      #{tag.replace(" ", "")}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
