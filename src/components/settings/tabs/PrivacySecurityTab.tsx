
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

interface PrivacySecurityTabProps {
  form: UseFormReturn<any>;
}

export const PrivacySecurityTab = ({ form }: PrivacySecurityTabProps) => {
  return (
    <>
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Account Privacy</h3>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">Private Account</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    Only approved followers can see your profile and activity
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="hideFromSearch"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">Hide from search engines</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    Prevent search engines from indexing your profile
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="showActivityStatus"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">Activity Status</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    Show when you're active on the platform
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Data & Security</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-700">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <Button variant="link" className="text-sm text-softspot-500 font-medium">
              Enable
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-700">Login History</h4>
              <p className="text-sm text-gray-500">Review recent account activity</p>
            </div>
            <Button variant="link" className="text-sm text-softspot-500 font-medium">
              View
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-700">Download Your Data</h4>
              <p className="text-sm text-gray-500">Request a copy of your data</p>
            </div>
            <Button variant="link" className="text-sm text-softspot-500 font-medium">
              Request
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-700">Delete Account</h4>
              <p className="text-sm text-gray-500">Permanently delete your account</p>
            </div>
            <Button variant="link" className="text-sm text-red-500 font-medium">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
