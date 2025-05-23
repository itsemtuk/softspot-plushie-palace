
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, LockKeyhole } from "lucide-react";

export function PrivacySecurityTab({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Privacy & Security</h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="privateProfile"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Private Profile</FormLabel>
                <FormDescription>
                  Make your profile visible only to your followers
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="bg-gray-200 data-[state=checked]:bg-softspot-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="showActivity"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Show Activity Status</FormLabel>
                <FormDescription>
                  Let others see when you're online or recently active
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="bg-gray-200 data-[state=checked]:bg-softspot-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="twoFactorAuth"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-white">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                <FormDescription>
                  Add an extra layer of security to your account
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="bg-gray-200 data-[state=checked]:bg-softspot-500"
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="rounded-lg border p-4 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-softspot-500" />
            <h4 className="font-medium">Security Settings</h4>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-white hover:bg-gray-50">
              <LockKeyhole className="h-4 w-4 mr-2" /> 
              Change Password
            </Button>
            
            <FormField
              control={form.control}
              name="receiveLoginAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Login Alerts</FormLabel>
                    <FormDescription>
                      Get notified about new logins to your account
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="bg-gray-200 data-[state=checked]:bg-softspot-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
