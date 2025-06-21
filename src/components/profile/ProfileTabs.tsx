
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Award, MessageSquare } from 'lucide-react';

const ProfileTabs = () => {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="bg-white shadow-sm mb-6 rounded-full w-full flex justify-center p-1">
        <TabsTrigger value="posts" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
          Posts
        </TabsTrigger>
        <TabsTrigger value="about" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
          About
        </TabsTrigger>
        <TabsTrigger value="badges" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
          Badges
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
          Reviews
        </TabsTrigger>
        <TabsTrigger value="collections" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
          Collections
        </TabsTrigger>
        <TabsTrigger value="marketplace" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
          Marketplace
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts">
        <Card className="shadow-sm">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Posts Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Posts will appear here once you start sharing your plushie collection.
            </p>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="about">
        <Card className="shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            About
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Bio</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                No bio added yet. Share something about yourself and your plushie collection!
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Favorite Brands</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">Add your favorite brands</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Member Since</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-1">2024</p>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="badges">
        <Card className="shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Badges & Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Award className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">First Post</h4>
              <p className="text-xs text-gray-500 mt-1">Create your first post</p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg opacity-50">
              <Award className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Collection Master</h4>
              <p className="text-xs text-gray-500 mt-1">Share 10+ plushies</p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg opacity-50">
              <Award className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">Social Butterfly</h4>
              <p className="text-xs text-gray-500 mt-1">Get 100 followers</p>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="reviews">
        <Card className="shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Reviews & Ratings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Seller Rating</h4>
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">5.0 (0 reviews)</span>
                </div>
              </div>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No reviews yet. Start selling to receive your first review!
              </p>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="collections">
        <Card className="shadow-sm">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Collections Coming Soon</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              This feature will be available in a future update.
            </p>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="marketplace">
        <Card className="shadow-sm">
          <div className="text-center py-16">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Marketplace Items</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Items you list for sale will appear here.
            </p>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
