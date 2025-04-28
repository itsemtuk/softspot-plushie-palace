
import { useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import PostCreationFlow from "@/components/post/PostCreationFlow";
import { PostCreationData } from "@/types/marketplace";
import { toast } from "@/components/ui/use-toast";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Logo } from "@/components/navigation/Logo";
import { NavLinks } from "@/components/navigation/NavLinks";
import { SearchBar } from "@/components/navigation/SearchBar";
import { CreateButton } from "@/components/navigation/CreateButton";
import { NotificationsButton } from "@/components/navigation/NotificationsButton";
import { UserMenu } from "@/components/navigation/UserMenu";

export function Navbar() {
  const isMobile = useIsMobile();
  const [isPostCreationOpen, setIsPostCreationOpen] = useState(false);

  // Updated to return a Promise
  const handleCreatePost = async (postData: PostCreationData): Promise<void> => {
    console.log("New post created:", postData);
    toast({
      title: "Post created successfully!",
      description: "Your post is now visible in your profile and feed."
    });
    // Return a resolved promise to satisfy the TypeScript requirement
    return Promise.resolve();
  };

  if (isMobile) {
    return <MobileNav />;
  }

  return (
    <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-softspot-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Logo />
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <NavLinks />
            <SearchBar />
            <CreateButton onCreatePost={() => setIsPostCreationOpen(true)} />
            
            <SignedIn>
              <div className="flex items-center space-x-2">
                <NotificationsButton />
                <UserMenu />
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
      
      <PostCreationFlow
        isOpen={isPostCreationOpen}
        onClose={() => setIsPostCreationOpen(false)}
        onPostCreated={handleCreatePost}
      />
    </nav>
  );
}

export default Navbar;
