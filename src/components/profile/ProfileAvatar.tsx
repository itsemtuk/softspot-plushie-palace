
import React from 'react';

interface ProfileAvatarProps {
  profileImage: string | null;
}

export function ProfileAvatar({ profileImage }: ProfileAvatarProps) {
  return (
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
  );
}
