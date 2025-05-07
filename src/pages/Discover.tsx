
import React, { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, Search, Heart, MessageSquare, LayoutGrid, ShoppingBag, Layers, Users, Play } from "lucide-react";
import { MarketplacePlushie } from '@/types/marketplace';
import { getAllUserPosts } from '@/utils/postStorage';
import { getMarketplaceListings } from '@/utils/storage/localStorageUtils';
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/navigation/MobileNav";
import { PlushieDetailDialog } from "@/components/marketplace/PlushieDetailDialog";
import { ExtendedPost } from "@/types/marketplace";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Discover = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'products' | 'collections' | 'people'>('feed');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('relevance');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedItem, setSelectedItem] = useState<MarketplacePlushie | ExtendedPost | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [listings, setListings] = useState<MarketplacePlushie[]>([]);
  const [posts, setPosts] = useState<ExtendedPost[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Load data
  useEffect(() => {
    // Load marketplace listings
    const storedListings = getMarketplaceListings();
    setListings(storedListings || []);

    // Load posts from all users
    const loadPosts = async () => {
      try {
        const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        let allPosts: ExtendedPost[] = [];
        
        for (const userId of allUsers) {
          const userPosts = await getAllUserPosts(userId);
          allPosts = [...allPosts, ...userPosts];
        }
        
        // If no posts found, try to get demo posts
        if (allPosts.length === 0) {
          const demoPosts = await getAllUserPosts('demo-user-id');
          allPosts = [...allPosts, ...demoPosts];
        }
        
        setPosts(allPosts);
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    
    // Generate mock users if needed
    const generateMockUsers = () => {
      return [
        {
          id: 'user1',
          username: 'PlushQueen',
          bio: 'Jellycat enthusiast',
          avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
          followers: 1200,
          plushies: 245,
          isVerified: true,
          isFollowing: false
        },
        {
          id: 'user2',
          username: 'TeddyMaster',
          bio: 'Vintage collector',
          avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
          followers: 856,
          plushies: 189,
          isVerified: false,
          isFollowing: true
        },
        {
          id: 'user3',
          username: 'SanrioLuv',
          bio: 'Hello Kitty fanatic',
          avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          followers: 2400,
          plushies: 312,
          isVerified: true,
          isFollowing: false
        },
        {
          id: 'user4',
          username: 'PokeCollector',
          bio: 'Pokémon trainer',
          avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
          followers: 3100,
          plushies: 428,
          isVerified: false,
          isFollowing: true
        },
        {
          id: 'user5',
          username: 'VintagePlush',
          bio: 'Antique plush expert',
          avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          followers: 723,
          plushies: 156,
          isVerified: true,
          isFollowing: false
        }
      ];
    };
    
    // Generate mock collections
    const generateMockCollections = () => {
      return [
        {
          id: 'coll1',
          name: 'Jellycat Bashful',
          creator: 'PlushQueen',
          image: 'https://m.media-amazon.com/images/I/71hUxP0U0QL._AC_UF1000,1000_QL80_.jpg',
          items: 12,
          likes: 1200,
          views: 3400
        },
        {
          id: 'coll2',
          name: 'Sanrio Cuties',
          creator: 'HelloKittyFan',
          image: 'https://m.media-amazon.com/images/I/71ZxHjwXmVL._AC_UF1000,1000_QL80_.jpg',
          items: 8,
          likes: 890,
          views: 2100
        },
        {
          id: 'coll3',
          name: 'Vintage Steiff',
          creator: 'TeddyCollector',
          image: 'https://i.pinimg.com/originals/7b/3a/2e/7b3a2e9d1a4d0b8e8e3a3b8e8e3a3b8e.jpg',
          items: 5,
          likes: 756,
          views: 1800
        }
      ];
    };
    
    setUsers(generateMockUsers());
    setCollections(generateMockCollections());
    loadPosts();
  }, []);

  // Handler for item click (product, post, collection, person)
  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  // Handler for following a user
  const handleFollowToggle = (userId: string) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? {...user, isFollowing: !user.isFollowing} : user
      )
    );
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleTabChange = (tab: 'feed' | 'products' | 'collections' | 'people') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Content Type Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button 
            className={`px-4 py-3 font-medium mr-2 flex items-center whitespace-nowrap ${activeTab === 'feed' ? 'text-softspot-500 border-b-2 border-softspot-500' : 'text-gray-700 hover:text-softspot-400'}`}
            onClick={() => handleTabChange('feed')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Feed
          </button>
          <button 
            className={`px-4 py-3 font-medium mr-2 flex items-center whitespace-nowrap ${activeTab === 'products' ? 'text-softspot-500 border-b-2 border-softspot-500' : 'text-gray-700 hover:text-softspot-400'}`}
            onClick={() => handleTabChange('products')}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Products
          </button>
          <button 
            className={`px-4 py-3 font-medium mr-2 flex items-center whitespace-nowrap ${activeTab === 'collections' ? 'text-softspot-500 border-b-2 border-softspot-500' : 'text-gray-700 hover:text-softspot-400'}`}
            onClick={() => handleTabChange('collections')}
          >
            <Layers className="w-4 h-4 mr-2" />
            Collections
          </button>
          <button 
            className={`px-4 py-3 font-medium flex items-center whitespace-nowrap ${activeTab === 'people' ? 'text-softspot-500 border-b-2 border-softspot-500' : 'text-gray-700 hover:text-softspot-400'}`}
            onClick={() => handleTabChange('people')}
          >
            <Users className="w-4 h-4 mr-2" />
            People
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 md:mb-0">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'all' ? 'bg-softspot-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-softspot-100'}`}
                onClick={() => handleFilterChange('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'trending' ? 'bg-softspot-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-softspot-100'}`}
                onClick={() => handleFilterChange('trending')}
              >
                Trending
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'new' ? 'bg-softspot-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-softspot-100'}`}
                onClick={() => handleFilterChange('new')}
              >
                New
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'popular' ? 'bg-softspot-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-softspot-100'}`}
                onClick={() => handleFilterChange('popular')}
              >
                Popular
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'nearby' ? 'bg-softspot-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-softspot-100'}`}
                onClick={() => handleFilterChange('nearby')}
              >
                Nearby
              </button>
            </div>
            
            <div className="flex items-center w-full md:w-auto">
              <div className="relative w-full md:w-auto mr-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-9 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px] h-10 border border-gray-300">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Feed Content */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 6).map((post, index) => (
              <Card key={post.id || index} className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => handleItemClick(post)}>
                <div className="relative h-48 bg-gradient-to-r from-softspot-100 to-softspot-400">
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title || "Post image"}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2 left-2 flex items-center">
                    <Avatar className="w-8 h-8 border-2 border-white">
                      <AvatarImage src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${(index * 10) % 99}.jpg`} />
                      <AvatarFallback>U{index}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-white text-sm font-medium drop-shadow-md">@{post.username || "user" + index}</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2">{post.title || `Awesome plushie post #${index+1}`}</h3>
                  <p className="text-sm text-gray-600 mb-3">{post.description || "Check out my latest addition to my collection!"}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500 flex items-center"><Heart className="h-4 w-4 mr-1" /> {Math.floor(Math.random() * 200) + 50}</span>
                      <span className="text-gray-500 flex items-center"><MessageSquare className="h-4 w-4 mr-1" /> {Math.floor(Math.random() * 50) + 5}</span>
                    </div>
                    <span className="text-gray-400">{Math.floor(Math.random() * 12) + 1}h ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {posts.length === 0 && listings.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="bg-softspot-100 p-6 rounded-full mb-4">
                  <Heart className="h-12 w-12 text-softspot-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
                <p className="text-gray-600 text-center max-w-md">
                  Start creating posts or follow more users to see their content here.
                </p>
                <Button className="mt-4 bg-softspot-500 hover:bg-softspot-600">
                  Create a Post
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Products Content */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {listings.map((listing, index) => (
              <Card key={listing.id} className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => handleItemClick(listing)}>
                <div className="relative pt-[100%]">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  <button 
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-softspot-500 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle favoriting
                    }}
                  >
                    <Heart className="h-4 w-4 text-gray-400" />
                  </button>
                  {listing.discount && (
                    <span className="absolute top-2 left-2 bg-softspot-500 text-white text-xs px-2 py-1 rounded">
                      -{listing.discount}%
                    </span>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm truncate">{listing.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">{listing.brand || "Brand"}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-sm text-softspot-500">${listing.price?.toFixed(2)}</span>
                      {listing.originalPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1">
                          ${listing.originalPrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span>4.{Math.floor(Math.random() * 10)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {listings.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="bg-softspot-100 p-6 rounded-full mb-4">
                  <ShoppingBag className="h-12 w-12 text-softspot-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No products available</h3>
                <p className="text-gray-600 text-center max-w-md">
                  Check back later or be the first to list a plushie for sale!
                </p>
                <Button className="mt-4 bg-softspot-500 hover:bg-softspot-600">
                  Sell a Plushie
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Collections Content */}
        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <Card key={collection.id} className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => handleItemClick(collection)}>
                <div className="relative h-64 bg-gradient-to-r from-softspot-100 to-softspot-400">
                  <img 
                    src={collection.image} 
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded-md">
                    <span className="text-xs font-bold text-gray-800">{collection.items} items</span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1">{collection.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">By @{collection.creator}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Heart className="h-4 w-4 text-softspot-500 mr-1" />
                    <span className="mr-3">{formatNumber(collection.likes)}</span>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <span>{formatNumber(collection.views)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {collections.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="bg-softspot-100 p-6 rounded-full mb-4">
                  <Layers className="h-12 w-12 text-softspot-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No collections yet</h3>
                <p className="text-gray-600 text-center max-w-md">
                  Create your first plushie collection to organize and showcase your favorites!
                </p>
                <Button className="mt-4 bg-softspot-500 hover:bg-softspot-600">
                  Create Collection
                </Button>
              </div>
            )}
          </div>
        )}

        {/* People Content */}
        {activeTab === 'people' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {users.map((user) => (
              <Card key={user.id} className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-center p-4">
                <div className="relative mx-auto w-20 h-20 mb-3">
                  <img 
                    src={user.avatar} 
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover border-2 border-softspot-500 p-1"
                  />
                  {user.isVerified && (
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-200">
                      <svg className="h-4 w-4 text-softspot-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-800">@{user.username}</h3>
                <p className="text-xs text-gray-600 mb-3">{user.bio}</p>
                <div className="flex justify-center space-x-2 text-xs mb-3">
                  <span className="text-gray-700"><strong>{formatNumber(user.followers)}</strong> followers</span>
                  <span className="text-gray-700"><strong>{user.plushies}</strong> plushies</span>
                </div>
                <Button 
                  className={user.isFollowing 
                    ? "w-full bg-gray-200 text-gray-800 hover:bg-gray-300" 
                    : "w-full bg-softspot-500 text-white hover:bg-softspot-600"
                  }
                  onClick={() => handleFollowToggle(user.id)}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </Button>
              </Card>
            ))}
            
            {users.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="bg-softspot-100 p-6 rounded-full mb-4">
                  <Users className="h-12 w-12 text-softspot-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No users found</h3>
                <p className="text-gray-600 text-center max-w-md">
                  Adjust your search to find plushie enthusiasts to follow.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Detail dialog for selected item */}
      {selectedItem && activeTab === 'products' && (
        <PlushieDetailDialog 
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          plushie={selectedItem as MarketplacePlushie}
        />
      )}

      {/* Mobile Bottom Navigation - already provided by MobileNav component */}
    </div>
  );
};

export default Discover;
