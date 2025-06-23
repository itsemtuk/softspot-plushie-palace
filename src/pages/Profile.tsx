
import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { TabsContent } from "@/components/ui/tabs";

const Profile = () => {
  console.log("Profile page: Rendering");
  return (
    <ProfileLayout>
      <TabsContent value="posts" className="mt-6">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Your posts will appear here</p>
        </div>
      </TabsContent>
      
      <TabsContent value="marketplace" className="mt-6">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Your marketplace items will appear here</p>
        </div>
      </TabsContent>
      
      <TabsContent value="about" className="mt-6">
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Profile information will appear here</p>
        </div>
      </TabsContent>
    </ProfileLayout>
  );
};

export default Profile;
