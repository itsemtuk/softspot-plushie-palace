
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, ShoppingBag, Users, User, Search, PlusSquare, Bell, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClerk, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MobileNav } from "@/components/navigation/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";

export function Navbar() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(() => navigate("/"));
  };

  const handleCreatePost = (postData: PostCreationData) => {
    console.log("New post created:", postData);
    toast({
      title: "Post created successfully!",
      description: "Your post is now visible in your profile and feed."
    });
  };

  if (isMobile) {
    return <MobileNav />;
  }

  return (
    <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-softspot-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-extrabold text-softspot-500 mr-2">SoftSpot</span>
              <div className="h-8 w-8 rounded-full bg-softspot-200 flex items-center justify-center animate-float">
                <span className="text-lg">🧸</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/feed" className="nav-link">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Feed
              </Button>
            </Link>
            <Link to="/discover" className="nav-link">
              <Button variant="ghost" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Discover
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default" className="flex items-center gap-2 bg-softspot-500 hover:bg-softspot-600">
                  <PlusSquare className="h-4 w-4" />
                  Create
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Create New</SheetTitle>
                  <SheetDescription>Choose what you'd like to do</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 mt-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 justify-start"
                    onClick={() => {
                      setIsPostCreationOpen(true);
                    }}
                  >
                    <PlusSquare className="h-4 w-4" />
                    Create Post
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 justify-start"
                    disabled
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Sell Item (Coming Soon)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 justify-start"
                    onClick={() => {
                      navigate('/messages');
                    }}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Trade Request
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/marketplace" className="nav-link">
              <Button variant="ghost" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Shop
              </Button>
            </Link>
            
            <SignedIn>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
                <Link to="/messages">
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-9 h-9"
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </SignedIn>
            
            <SignedOut>
              <Link to="/sign-in">
                <Button className="bg-softspot-400 hover:bg-softspot-500 text-white">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
      
      {/* Post Creation Flow */}
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={() => setIsPostCreationOpen(false)}
        onPostCreated={handleCreatePost}
      />
    </nav>
  );
}

export default Navbar;
