
import { UserCog } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

const AccountSettings = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Account Settings</h2>
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10"
            }
          }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2 mb-4">
        Manage your account settings using the profile menu
      </p>
      
      <div className="flex items-center gap-2 text-gray-500">
        <UserCog className="h-5 w-5" />
        <span>Click your profile picture to access account settings</span>
      </div>
    </div>
  );
};

export default AccountSettings;
