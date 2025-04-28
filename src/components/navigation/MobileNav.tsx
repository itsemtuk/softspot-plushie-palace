import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, Search, PlusSquare, ShoppingBag, User, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn } from "@clerk/clerk-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function MobileNav() {
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const navigate = useNavigate();

  // Mock notifications data
  const notifications = [
    {
      id: "notif-1",
      content: "Sarah started following you",
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
      user: {
        name: "Sarah",
        avatar: "https://i.pravatar.cc/150?img=5"
      }
    },
    {
      id: "notif-2",
      content: "Mike liked your post",
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: false,
      user: {
        name: "Mike",
        avatar: "https://i.pravatar.cc/150?img=12"
      }
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Updated to return a Promise
  const handleCreatePost = async (postData: PostCreationData): Promise<void> => {
    console.log("New post created:", postData);
    toast({
      title: "Post created successfully!",
      description: "Your post is now visible in your profile and feed."
    });
    setIsSheetOpen(false);
    navigate('/feed');
    
    // Return a resolved promise to satisfy the TypeScript requirement
    return Promise.resolve();
  };

  return (
    <>
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-softspot-100">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-softspot-500">SoftSpot</span>
            <div className="h-6 w-6 rounded-full bg-softspot-200 flex items-center justify-center ml-2">
              <span className="text-sm">🧸</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <SignedIn>
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-softspot-500"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="p-3 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                  </div>
                  <ScrollArea className="h-80">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-3 border-b flex items-start gap-3 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-softspot-50' : ''
                        }`}
                      >
                        <Avatar>
                          <AvatarImage src={notification.user.avatar} />
                          <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">{notification.content}</p>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                  <div className="p-2 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full text-softspot-500 text-sm"
                      onClick={() => navigate('/settings?tab=notifications')}
                    >
                      See all notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-softspot-100">
        <div className="flex items-center justify-around h-16">
          <Link to="/feed">
            <Button variant="ghost" size="icon">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/discover">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="icon" className="rounded-full bg-softspot-500 hover:bg-softspot-600">
                <PlusSquare className="h-5 w-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[40vh]">
              <SheetHeader>
                <SheetTitle>Create New</SheetTitle>
                <SheetDescription>Choose what you'd like to do</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => {
                    setIsSheetOpen(false);
                    setIsPostCreationOpen(true);
                  }}
                >
                  <PlusSquare className="h-6 w-6" />
                  <span>Post</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  disabled
                >
                  <ShoppingBag className="h-6 w-6" />
                  <span>Sell</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => {
                    setIsSheetOpen(false);
                    navigate('/messages');
                  }}
                >
                  <MessageSquare className="h-6 w-6" />
                  <span>Trade</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/marketplace">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Spacers for fixed navbars */}
      <div className="h-16" /> {/* Top spacer */}
      <div className="h-16" /> {/* Bottom spacer */}
      
      {/* Post Creation Flow */}
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={() => setIsPostCreationOpen(false)}
        onPostCreated={handleCreatePost}
      />
    </>
  );
}
