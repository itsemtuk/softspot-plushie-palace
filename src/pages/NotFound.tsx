
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-softspot-50">
      <div className="w-full max-w-lg px-8 py-16 text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Custom SVG plushie illustration */}
            <svg 
              width="150" 
              height="150" 
              viewBox="0 0 200 200" 
              className="text-softspot-300 animate-bounce-slow"
            >
              {/* Simple plushie bear silhouette */}
              <circle cx="100" cy="100" r="50" fill="currentColor" />
              <circle cx="70" cy="80" r="10" fill="#FFF" />
              <circle cx="130" cy="80" r="10" fill="#FFF" />
              <circle cx="70" cy="80" r="5" fill="#000" />
              <circle cx="130" cy="80" r="5" fill="#000" />
              <ellipse cx="100" cy="110" rx="10" ry="5" fill="#FFF" />
              <circle cx="80" cy="60" r="15" fill="currentColor" />
              <circle cx="120" cy="60" r="15" fill="currentColor" />
            </svg>
            
            <div className="absolute -bottom-4 text-5xl animate-pulse">💭</div>
            <div className="absolute top-0 -right-4 text-5xl animate-pulse delay-300">❓</div>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-softspot-500 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">
          Oops! This plushie seems to have wandered off...
        </p>
        
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved to a new home.
          Perhaps it's cuddling with other plushies elsewhere!
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-medium mb-4 text-gray-700">Maybe you're looking for:</h2>
          <div className="space-y-2 text-left">
            <Link to="/marketplace" className="block p-2 hover:bg-softspot-50 rounded-md text-gray-700">
              🛍️ Marketplace - Find new plushie friends
            </Link>
            <Link to="/discover" className="block p-2 hover:bg-softspot-50 rounded-md text-gray-700">
              🔍 Discover - Explore plushie collections
            </Link>
            <Link to="/profile" className="block p-2 hover:bg-softspot-50 rounded-md text-gray-700">
              👤 Profile - Your plushie collection
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="default"
            className="flex items-center gap-2 bg-softspot-500 hover:bg-softspot-600"
            asChild
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            asChild
          >
            <Link to="/discover">
              <Search className="h-4 w-4" />
              Search Plushies
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
