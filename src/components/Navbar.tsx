
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, ShoppingBag, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClerk, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    signOut(() => navigate("/"));
  };

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="mr-2 h-4 w-4" /> },
    { name: "Feed", path: "/feed", icon: <Users className="mr-2 h-4 w-4" /> },
    { name: "Marketplace", path: "/marketplace", icon: <ShoppingBag className="mr-2 h-4 w-4" /> },
    { name: "Profile", path: "/profile", icon: <User className="mr-2 h-4 w-4" /> },
  ];

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
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                to={link.path}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-softspot-700 hover:bg-softspot-100 hover:text-softspot-500 transition-colors"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <SignedIn>
              <div className="ml-4 flex items-center">
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
                <Button className="ml-4 bg-softspot-400 hover:bg-softspot-500 text-white">
                  Sign In
                </Button>
              </Link>
            </SignedOut>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-softspot-500 hover:text-white hover:bg-softspot-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-softspot-300"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-softspot-100">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-softspot-700 hover:bg-softspot-100 hover:text-softspot-500"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          
          <SignedIn>
            <div className="flex items-center justify-between px-3 py-2">
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9"
                  }
                }}
              />
              <Button 
                variant="outline" 
                className="border-softspot-200 text-softspot-500"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </SignedIn>
          
          <SignedOut>
            <Link 
              to="/sign-in"
              onClick={() => setIsMenuOpen(false)}
            >
              <Button 
                className="w-full mt-4 bg-softspot-400 hover:bg-softspot-500 text-white"
              >
                Sign In
              </Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
