
import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, UserPlus, UserMinus, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface UserProfileHeaderProps {
  username?: string;
  isOwnProfile: boolean;
  profileData?: {
    bio?: string;
    interests?: string[];
    isPrivate?: boolean;
  };
}

export default function UserProfileHeader({ 
  username, 
  isOwnProfile, 
  profileData 
}: UserProfileHeaderProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [followersCount, setFollowersCount] = useState(128); // Placeholder
  const [postsCount, setPostsCount] = useState(0);
  
  const isPrivate = profileData?.isPrivate ?? false;
  
  // Get profile data once user is loaded
  useEffect(() => {
    if (user && isOwnProfile) {
      // Get the profile picture from metadata
      const userProfilePicture = user.unsafeMetadata?.profilePicture as string;
      setProfileImage(userProfilePicture || user.imageUrl);
      
      // Check if we're following this user
      const following = user.unsafeMetadata?.following as string[] || [];
      if (username && following.includes(username)) {
        setIsFollowing(true);
      }
    }
  }, [user, isOwnProfile, username]);

  const handleEditProfile = () => {
    navigate('/settings');
  };

  const handleFollow = () => {
    if (isFollowing) {
      // Unfollow
      if (user) {
        const following = user.unsafeMetadata?.following as string[] || [];
        const updatedFollowing = following.filter(user => user !== username);
        
        user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            following: updatedFollowing,
          },
        }).then(() => {
          setIsFollowing(false);
          setFollowersCount(prev => prev - 1);
          toast({
            title: "Unfollowed",
            description: `You are no longer following ${username}`,
          });
        });
      }
    } else if (isPrivate) {
      // Send follow request for private account
      setIsPending(true);
      toast({
        title: "Follow request sent",
        description: `Your request to follow ${username} has been sent`,
      });
    } else {
      // Follow public account
      if (user) {
        const following = user.unsafeMetadata?.following as string[] || [];
        const updatedFollowing = [...following, username];
        
        user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            following: updatedFollowing,
          },
        }).then(() => {
          setIsFollowing(true);
          setFollowersCount(prev => prev + 1);
          toast({
            title: "Following",
            description: `You are now following ${username}`,
          });
        });
      }
    }
  };

  // Determine the button to display based on relationship
  const renderActionButton = () => {
    if (isOwnProfile) {
      return (
        <Button 
          variant="outline" 
          className="text-softspot-500 border-softspot-200"
          onClick={handleEditProfile}
        >
          <Edit2 className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      );
    } else if (isPending) {
      return (
        <Button 
          variant="outline" 
          className="text-gray-500 border-gray-200"
          disabled
        >
          <UserCheck className="mr-2 h-4 w-4" />
          Requested
        </Button>
      );
    } else if (isFollowing) {
      return (
        <Button 
          variant="outline" 
          className="text-softspot-500 border-softspot-200"
          onClick={handleFollow}
        >
          <UserMinus className="mr-2 h-4 w-4" />
          Unfollow
        </Button>
      );
    } else {
      return (
        <Button 
          className="bg-softspot-500 hover:bg-softspot-600 text-white"
          onClick={handleFollow}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {isPrivate ? "Request to Follow" : "Follow"}
        </Button>
      );
    }
  };

  // Placeholder plushie interests (from metadata or default)
  const plushieInterests = profileData?.interests || ["Teddy Bears", "Unicorns", "Vintage"];
  
  // Get following count
  const followingCount = user?.unsafeMetadata?.following 
    ? (user.unsafeMetadata.following as string[]).length 
    : 0;
  
  return (
    <div className="bg-gradient-to-b from-softspot-100 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-28 h-28 bg-softspot-200 rounded-full overflow-hidden border-4 border-white">
              <img 
                src={profileImage || "https://i.pravatar.cc/300"} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://i.pravatar.cc/300";
                }}
              />
            </div>
          </div>
          
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.firstName || username || "Plushie Lover"}
              {isPrivate && (
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  Private
                </span>
              )}
            </h1>
            <p className="text-gray-500">@{username || user?.username || "plushielover"}</p>
            <p className="mt-2 text-gray-700 max-w-2xl">
              {profileData?.bio || user?.unsafeMetadata?.bio as string || "Passionate plushie collector for over 10 years. I love cute and cuddly friends of all kinds!"}
            </p>
            
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {plushieInterests.map((interest, index) => (
                <Badge key={index} variant="outline" className="bg-softspot-50 hover:bg-softspot-100 text-softspot-600 border-softspot-200">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            {renderActionButton()}
          </div>
        </div>
        
        <div className="flex justify-center mt-6 border-b">
          <div className="flex space-x-8">
            <div className="text-center px-4 py-2 border-b-2 border-softspot-500">
              <span className="block font-medium text-softspot-500">{postsCount}</span>
              <span className="text-xs text-gray-500">Posts</span>
            </div>
            <div className="text-center px-4 py-2">
              <span className="block font-medium">{followersCount}</span>
              <span className="text-xs text-gray-500">Followers</span>
            </div>
            <div className="text-center px-4 py-2">
              <span className="block font-medium">{followingCount}</span>
              <span className="text-xs text-gray-500">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
