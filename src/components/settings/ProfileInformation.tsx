
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UsernameInput from "@/components/settings/UsernameInput";
import BioInput from "@/components/settings/BioInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfileSettings } from "@/hooks/useProfileSettings";

const ProfileInformation = () => {
  const { 
    form, 
    isSubmitting, 
    isSynced, 
    saveProfile,
    user 
  } = useProfileSettings();
  
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.imageUrl || "");
  const { register, handleSubmit, formState: { errors } } = form;
  
  const onSubmit = handleSubmit(async (data) => {
    await saveProfile(data);
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 flex-1">
                  <Label htmlFor="avatarUrl">Profile Picture</Label>
                  <Input
                    id="avatarUrl"
                    {...register("avatarUrl")}
                    placeholder="https://example.com/avatar.jpg"
                    onChange={(e) => setAvatarUrl(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Enter a URL for your profile picture
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...register("username")}
                  placeholder="Your username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message?.toString()}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message?.toString()}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  {...register("bio")}
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio.message?.toString()}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-medium">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    {...register("twitter")}
                    placeholder="@username"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    {...register("instagram")}
                    placeholder="@username"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    {...register("youtube")}
                    placeholder="Channel name"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-softspot-500 hover:bg-softspot-600"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInformation;
