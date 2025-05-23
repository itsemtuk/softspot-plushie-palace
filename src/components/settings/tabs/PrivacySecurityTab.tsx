
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react";

export function PrivacySecurityTab({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-softspot-500" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="isPrivate"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Private Profile</FormLabel>
                  <FormDescription>
                    Only approved followers can see your posts and collections.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-softspot-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hideFromSearch"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Hide from Search</FormLabel>
                  <FormDescription>
                    Don't show your profile in search results.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-softspot-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showActivityStatus"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show Activity Status</FormLabel>
                  <FormDescription>
                    Show others when you're actively using SoftSpot.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-softspot-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Security Card */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <KeyRound className="h-5 w-5 mr-2 text-softspot-500" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 2FA section moved here from Delivery & Payment */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="twoFactorAuth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                    <FormDescription>
                      Add an extra layer of security to your account.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-softspot-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="text-base font-medium">Change Password</h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <FormLabel>Current Password</FormLabel>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <FormLabel>New Password</FormLabel>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <FormLabel>Confirm New Password</FormLabel>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button className="bg-softspot-500 hover:bg-softspot-600 text-white">
                Update Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
