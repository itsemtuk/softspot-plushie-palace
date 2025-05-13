
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

interface NotificationsTabProps {
  form: UseFormReturn<any>;
}

export const NotificationsTab = ({ form }: NotificationsTabProps) => {
  return (
    <>
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Email Notifications</h3>
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="receiveEmailUpdates"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">Product updates</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    News about new features and improvements
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
            name="receiveMarketingEmails"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">Marketing emails</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    Promotions, special offers, and news
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
            name="newReleaseAlerts"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">New release alerts</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    Get notified about new plushie releases from your favorite brands
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="receiveWishlistAlerts"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div>
                  <FormLabel className="font-medium text-gray-700">Wishlist alerts</FormLabel>
                  <FormDescription className="text-sm text-gray-500">
                    When items on your wishlist go on sale or are restocked
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
};
