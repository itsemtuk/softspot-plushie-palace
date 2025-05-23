
import React from 'react';
import { User, Award, MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  return (
    <div className="mt-4 mb-6">
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
      
      {/* About/Badges/Reviews tabs */}
      <div className="mt-4">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-100 rounded-full mb-6">
            <TabsTrigger 
              value="about" 
              className="rounded-full data-[state=active]:bg-softspot-100"
            >
              About
            </TabsTrigger>
            <TabsTrigger 
              value="badges" 
              className="rounded-full data-[state=active]:bg-softspot-100"
            >
              <Award className="h-4 w-4 mr-2" />
              <span>Badges</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-full data-[state=active]:bg-softspot-100"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Reviews</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="animate-fade-in">
            {/* About content will be rendered by parent */}
          </TabsContent>
          
          <TabsContent value="badges" className="animate-fade-in">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Badges</h2>
              
              {/* Profile completion progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span>Profile completion</span>
                  <span>23%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-softspot-400 h-2.5 rounded-full" style={{ width: '23%' }}></div>
                </div>
              </div>
              
              {/* Badges grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Earned badges */}
                <div className="p-4 bg-white border border-gray-100 rounded-lg text-center">
                  <span className="text-center font-medium">Profile Photo</span>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-lg text-center">
                  <span className="text-center font-medium">Plushie Preferences</span>
                </div>
                <div className="p-4 bg-white border border-gray-100 rounded-lg text-center">
                  <span className="text-center font-medium">Complete Profile</span>
                </div>
                
                {/* Locked badges */}
                <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg text-center opacity-80">
                  <span className="text-center text-gray-500 font-medium">First Post</span>
                  <div className="flex justify-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
                <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg text-center opacity-80">
                  <span className="text-center text-gray-500 font-medium">Marketplace Vendor</span>
                  <div className="flex justify-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
                <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg text-center opacity-80">
                  <span className="text-center text-gray-500 font-medium">First Sale</span>
                  <div className="flex justify-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
                
                {/* Additional locked badges */}
                <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg text-center opacity-80">
                  <span className="text-center text-gray-500 font-medium">Wishlist Creator</span>
                  <div className="flex justify-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
                <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg text-center opacity-80">
                  <span className="text-center text-gray-500 font-medium">First Followers</span>
                  <div className="flex justify-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                </div>
              </div>
              
              {/* Special badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg text-center opacity-80">
                  <img 
                    src="/assets/Badges/Alpha_Tester.PNG" 
                    alt="Alpha Tester" 
                    className="mx-auto w-16 h-16 object-contain"
                  />
                  <span className="block mt-2 text-center text-gray-500 font-medium">Alpha Tester</span>
                </div>
                <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg text-center opacity-80">
                  <img 
                    src="/assets/Badges/Beta_Tester.PNG" 
                    alt="Beta Tester" 
                    className="mx-auto w-16 h-16 object-contain"
                  />
                  <span className="block mt-2 text-center text-gray-500 font-medium">Beta Tester</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="animate-fade-in">
            <div className="bg-white p-6 rounded-lg text-center">
              <h2 className="text-lg font-semibold mb-2">Reviews</h2>
              <p className="text-gray-500">No reviews yet. When other users review your activity, they'll appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
