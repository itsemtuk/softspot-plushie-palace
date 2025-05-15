import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Filter, Search, Heart, MessageSquare, LayoutGrid, ShoppingBag, Users, Play } from "lucide-react";
import { MarketplacePlushie } from '@/types/marketplace';
import { getAllUserPosts } from '@/utils/postStorage';
import { getMarketplaceListings } from '@/utils/storage/localStorageUtils';
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { UserSearchResults } from "@/components/user/UserSearchResults";

const Discover = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"all" | "users" | "products" | "hashtags">("all");
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplacePlushie[]>([]);
  const [hashtagResults, setHashtagResults] = useState<string[]>([]);
  const [productResults, setProductResults] = useState<MarketplacePlushie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadData = async () => {
      // Load trending posts
      const allPosts = await getAllUserPosts(''); // Fetch all posts
      const sortedPosts = allPosts.sort((a: any, b: any) => b.likes - a.likes).slice(0, 5); // Sort by likes and take top 5
      setTrendingPosts(sortedPosts);

      // Load marketplace items
      const items = getMarketplaceListings().slice(0, 5); // Take top 5
      setMarketplaceItems(items);
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
            const allPosts = await getAllUserPosts('');
            const allTags = new Set<string>();
            
            allPosts.forEach((post: any) => {
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
    console.log("Searching for:", searchTerm);
    // Already handled in the useEffect
  };

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
                      <Card key={item.id}>
                        <CardHeader className="p-4">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-md font-semibold truncate">{item.title}</h3>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="aspect-square w-full overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 flex justify-between">
                          <div className="text-sm font-semibold">${item.price.toFixed(2)}</div>
                          <Button size="sm" variant="outline">View</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  {productResults.length > 6 && (
                    <div className="text-center mt-2">
                      <Button variant="link">See all {productResults.length} results</Button>
                    </div>
                  )}
                </div>
              )}
              
              {(searchType === "hashtags" || searchType === "all") && hashtagResults.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {hashtagResults.map((tag, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
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
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trending" className="space-y-4">
                <h2 className="text-xl font-semibold">Trending Posts</h2>
                {trendingPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trendingPosts.map((post: any) => (
                      <Card key={post.id}>
                        <CardHeader>
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src="https://i.pravatar.cc/50" alt={post.username} />
                              <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-sm font-semibold">{post.username}</h3>
                              <p className="text-xs text-gray-500">@{post.username}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <img src={post.imageUrl} alt="Trending Post" className="w-full h-48 object-cover rounded-md mb-2" />
                          <p className="text-sm text-gray-700">{post.content?.substring(0, 100) || post.description?.substring(0, 100)}...</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4 mr-1" /> {post.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" /> {post.comments}
                            </Button>
                          </div>
                          <Badge variant="secondary">Trending</Badge>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No trending posts found.</p>
                )}
              </TabsContent>

              <TabsContent value="marketplace" className="space-y-4">
                <h2 className="text-xl font-semibold">Popular Marketplace Items</h2>
                {marketplaceItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {marketplaceItems.map((item) => (
                      <Card key={item.id}>
                        <CardHeader>
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={item.image} alt={item.title} />
                              <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-sm font-semibold">{item.title}</h3>
                              <p className="text-xs text-gray-500">@{item.username}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-md mb-2" />
                          <p className="text-sm text-gray-700">{item.description?.substring(0, 100)}...</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4 mr-1" /> {item.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" /> {item.comments}
                            </Button>
                          </div>
                          <Badge variant="outline">${item.price}</Badge>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No popular marketplace items found.</p>
                )}
              </TabsContent>

              <TabsContent value="community" className="space-y-4">
                <h2 className="text-xl font-semibold">Explore Communities</h2>
                <ScrollArea className="rounded-md border">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/50" alt="Plushie Lovers" />
                            <AvatarFallback>PL</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-sm font-semibold">Plushie Lovers</h3>
                            <p className="text-xs text-gray-500">12,345 Members</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">A community for plushie enthusiasts to share their collections and love for all things cuddly.</p>
                      </CardContent>
                      <CardFooter>
                        <Button>Join</Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/51" alt="Jellycat Collectors" />
                            <AvatarFallback>JC</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-sm font-semibold">Jellycat Collectors</h3>
                            <p className="text-xs text-gray-500">8,765 Members</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">A dedicated space for collectors of Jellycat plushies to showcase their rare finds and discuss new releases.</p>
                      </CardContent>
                      <CardFooter>
                        <Button>Join</Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/52" alt="Vintage Plushies" />
                            <AvatarFallback>VP</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-sm font-semibold">Vintage Plushies</h3>
                            <p className="text-xs text-gray-500">5,432 Members</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">A community for vintage plushie collectors to share their antique treasures and learn about the history of plush toys.</p>
                      </CardContent>
                      <CardFooter>
                        <Button>Join</Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src="https://i.pravatar.cc/53" alt="Squishmallow Squad" />
                            <AvatarFallback>SS</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-sm font-semibold">Squishmallow Squad</h3>
                            <p className="text-xs text-gray-500">15,876 Members</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">A group for Squishmallow enthusiasts to connect, trade, and share their love for these ultra-soft plushies.</p>
                      </CardContent>
                      <CardFooter>
                        <Button>Join</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            
              <TabsContent value="people" className="space-y-4">
                <h2 className="text-xl font-semibold">Popular Users</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/assets/avatars/PLUSH_Bear.PNG" alt="PlushieLover" />
                          <AvatarFallback>PL</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-semibold">PlushieLover</h3>
                          <p className="text-xs text-gray-500">@plushielover</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">
                        Hi! I'm a passionate plushie collector. I love Squishmallows and Jellycats!
                      </p>
                      <div className="flex gap-1 mt-2">
                        <Badge variant="outline">Jellycat</Badge>
                        <Badge variant="outline">Squishmallows</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Follow</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/assets/avatars/PLUSH_Panda.PNG" alt="PandaPal" />
                          <AvatarFallback>PP</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-semibold">PandaPal</h3>
                          <p className="text-xs text-gray-500">@pandapal</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">
                        Collector and trader of rare panda plushies! Looking to expand my collection.
                      </p>
                      <div className="flex gap-1 mt-2">
                        <Badge variant="outline">Pandas</Badge>
                        <Badge variant="outline">Trading</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Follow</Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/assets/avatars/PLUSH_Bunny.PNG" alt="BunnyLover" />
                          <AvatarFallback>BL</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-sm font-semibold">BunnyLover</h3>
                          <p className="text-xs text-gray-500">@bunnylover</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700">
                        Specializing in bunny plushies from all brands. Let's trade!
                      </p>
                      <div className="flex gap-1 mt-2">
                        <Badge variant="outline">Bunnies</Badge>
                        <Badge variant="outline">Jellycat</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">Follow</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;
