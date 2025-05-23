
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Award, MessageSquare, User } from "lucide-react";

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
    <div className="mt-4 border-b border-gray-100">
      {/* Stats row */}
      <div className="flex justify-around mb-6">
        <div className="text-center">
          <p className="font-semibold">{postsCount}</p>
          <p className="text-xs text-gray-600">Posts</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{followersCount}</p>
          <p className="text-xs text-gray-600">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{followingCount}</p>
          <p className="text-xs text-gray-600">Following</p>
        </div>
      </div>
      
      {/* About/Badges/Reviews tabs (similar to the reference image) */}
      <div className="mt-6 mb-2">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-50 rounded-lg">
            <TabsTrigger 
              value="about" 
              className="flex items-center justify-center data-[state=active]:bg-white rounded-md data-[state=active]:shadow-sm"
            >
              <User className="h-4 w-4 mr-2" />
              <span>About</span>
            </TabsTrigger>
            <TabsTrigger 
              value="badges" 
              className="flex items-center justify-center data-[state=active]:bg-white rounded-md data-[state=active]:shadow-sm"
            >
              <Award className="h-4 w-4 mr-2" />
              <span>Badges</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="flex items-center justify-center data-[state=active]:bg-white rounded-md data-[state=active]:shadow-sm"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Reviews</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Tab content will be handled by parent component */}
        </Tabs>
      </div>
    </div>
  );
}
