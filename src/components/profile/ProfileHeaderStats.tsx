
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3X3, BookMarked, ShoppingCart } from "lucide-react";

interface ProfileHeaderStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export function ProfileHeaderStats({ 
  postsCount, 
  followersCount, 
  followingCount 
}: ProfileHeaderStatsProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'collections' | 'sales'>('posts');

  return (
    <div className="flex justify-center mt-4 border-b border-gray-100">
      <Tabs defaultValue="posts" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="posts" className="flex items-center">
            <Grid3X3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Posts</span>
          </TabsTrigger>
          
          <TabsTrigger value="collections" className="flex items-center">
            <BookMarked className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Collections</span>
          </TabsTrigger>
          
          <TabsTrigger value="sales" className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">For Sale</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
