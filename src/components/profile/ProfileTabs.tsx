
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const ProfileTabs = () => {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="bg-white shadow-sm mb-6 rounded-full w-full flex justify-center p-1">
        <TabsTrigger value="posts" className="flex items-center data-[state=active]:bg-softspot-100 rounded-full data-[state=active]:shadow-none">
          Posts
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
