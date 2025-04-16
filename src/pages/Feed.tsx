
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PlushieCard } from "@/components/PlushieCard";
import { feedPosts } from "@/data/plushies";
import { Button } from "@/components/ui/button";
import { PlusCircle, ImagePlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Feed = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPosts = feedPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Community Feed</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search posts..."
                className="pl-9 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-softspot-400 hover:bg-softspot-500 text-white whitespace-nowrap">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PlushieCard 
                key={post.id}
                id={post.id}
                image={post.image}
                title={post.title}
                username={post.username}
                likes={post.likes}
                comments={post.comments}
                variant="feed"
              />
            ))
          ) : (
            <div className="col-span-3 py-12 text-center">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="flex justify-center">
                  <ImagePlus className="h-12 w-12 text-softspot-300" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No posts found</h3>
                <p className="mt-2 text-gray-500">Try a different search or create a new post.</p>
                <Button className="mt-4 bg-softspot-400 hover:bg-softspot-500 text-white">
                  Create Post
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
