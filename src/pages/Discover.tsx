
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Filter, Search, Heart, MessageSquare, Users, ShoppingBag } from "lucide-react";
import { MarketplacePlushie, ExtendedPost } from '@/types/marketplace';
import { getPosts } from '@/utils/posts/postFetch';
import { getMarketplaceListings } from '@/utils/storage/localStorageUtils';
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { UserSearchResults } from "@/components/user/UserSearchResults";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { PostCard } from "@/components/post/PostCard";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { toast } from "@/components/ui/use-toast";

const Discover = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"all" | "users" | "products" | "hashtags">("all");
  const [trendingPosts, setTrendingPosts] = useState<ExtendedPost[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplacePlushie[]>([]);
  const [hashtagResults, setHashtagResults] = useState<string[]>([]);
  const [productResults, setProductResults] = useState<MarketplacePlushie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load trending posts
        const allPosts = await getPosts();
        const sortedPosts = allPosts.sort((a, b) => b.likes - a.likes).slice(0, 5);
        setTrendingPosts(sortedPosts);

        // Load marketplace items
        const items = getMarketplaceListings().slice(0, 5);
        setMarketplaceItems(items);
      } catch (error) {
        console.error("Error loading discover data:", error);
        toast({
          title: "Error",
          description: "Failed to load content. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm && searchTerm.length > 1) {
      setIsSearching(true);
      
      // Search for products
      const items = getMarketplaceListings();
      const filteredItems = items.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setProductResults(filteredItems);
      
      // Search for hashtags
      if (searchTerm && searchTerm.startsWith('#')) {
        const tag = searchTerm.substring(1).toLowerCase();
        const fetchPosts = async () => {
          try {
            const allPosts = await getPosts();
            const allTags = new Set<string>();
            
            allPosts.forEach((post) => {
              if (post.tags) {
                post.tags.forEach((postTag: string) => {
                  if (postTag.toLowerCase().includes(tag)) {
                    allTags.add(postTag);
                  }
                });
              }
            });
            
            setHashtagResults(Array.from(allTags));
          } catch (error) {
            console.error("Error fetching posts for hashtags:", error);
            setHashtagResults([]);
          }
        };
        
        fetchPosts();
      } else {
        setHashtagResults([]);
      }
      
    } else {
      setIsSearching(false);
      setProductResults([]);
      setHashtagResults([]);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleProductClick = (product: MarketplacePlushie) => {
    navigate(`/marketplace/product/${product.id}`);
  };

  const handleWishlistToggle = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Implementation would go here - but for now just show a toast
    toast({
      title: "Feature coming soon",
      description: "Wishlist functionality will be available soon!",
    });
  };

  const handlePostLike = (postId: string) => {
    // Implementation would go here
    console.log("Liking post:", postId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {isMobile ? <MobileNav /> : <Navbar />}
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Discover</h1>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search users, plushies, or #tags..."
                className="sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}><Search className="h-4 w-4" /></Button>
            </div>
          </div>
          
          {/* Search type selector */}
          {searchTerm && (
            <div className="flex space-x-2">
              <Button
                variant={searchType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("all")}
              >
                All
              </Button>
              <Button
                variant={searchType === "users" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("users")}
              >
                <Users className="h-3.5 w-3.5 mr-1" />
                Users
              </Button>
              <Button
                variant={searchType === "products" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("products")}
              >
                <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                Products
              </Button>
              <Button
                variant={searchType === "hashtags" ? "default" : "outline"}
                size="sm"
                onClick={() => setSearchType("hashtags")}
              >
                #Tags
              </Button>
            </div>
          )}
          
          {/* Show search results when searching */}
          {searchTerm && (
            <div className="mb-4">
              {(searchType === "users" || searchType === "all") && (
                <UserSearchResults searchTerm={searchTerm} />
              )}
              
              {(searchType === "products" || searchType === "all") && productResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Products</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productResults.slice(0, 6).map(item => (
                      <ProductCard 
                        key={item.id}
                        product={item}
                        onProductClick={handleProductClick}
                        onWishlistToggle={handleWishlistToggle}
                      />
                    ))}
                  </div>
                  {productResults.length > 6 && (
                    <div className="text-center mt-2">
                      <Button 
                        variant="link"
                        onClick={() => navigate(`/search?q=${encodeURIComponent(searchTerm)}&type=products`)}
                      >
                        See all {productResults.length} results
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {(searchType === "hashtags" || searchType === "all") && hashtagResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {hashtagResults.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate(`/feed?tag=${encodeURIComponent(tag)}`)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {searchType === "all" && !productResults.length && !hashtagResults.length && searchTerm.length >= 2 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">No products or hashtags found matching "{searchTerm}"</p>
                </div>
              )}
              
              {searchType === "products" && !productResults.length && searchTerm.length >= 2 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">No products found matching "{searchTerm}"</p>
                </div>
              )}
              
              {searchType === "hashtags" && !hashtagResults.length && searchTerm.length >= 2 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">No hashtags found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          )}

          {/* Only show tabs when not searching or search is empty */}
          {!isSearching && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="bg-white border">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="community" disabled>Community</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trending" className="space-y-4">
                <h2 className="text-xl font-semibold">Trending Posts</h2>
                {trendingPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trendingPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onLike={handlePostLike} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg text-center">
                    <p className="text-gray-500">No trending posts found. Check back later!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="marketplace" className="space-y-4">
                <h2 className="text-xl font-semibold">Popular Marketplace Items</h2>
                {marketplaceItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marketplaceItems.map((item) => (
                      <ProductCard 
                        key={item.id}
                        product={item}
                        onProductClick={handleProductClick}
                        onWishlistToggle={handleWishlistToggle}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-lg text-center">
                    <p className="text-gray-500">No marketplace items found. Check back later!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="community" className="space-y-4">
                <h2 className="text-xl font-semibold">Explore Communities</h2>
                <div className="bg-white p-8 rounded-lg text-center">
                  <p className="text-gray-500">Community features coming soon!</p>
                </div>
              </TabsContent>
            
              <TabsContent value="people" className="space-y-4">
                <h2 className="text-xl font-semibold">Popular Users</h2>
                <UserSearchResults />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
