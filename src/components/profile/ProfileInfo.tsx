
import React from 'react';

export interface ProfileInfoProps {
  bio: string;
  displayName: string;
  interests: string[];
}

export function ProfileInfo({ bio, displayName, interests }: ProfileInfoProps) {
  return (
    <div className="mt-3">
      <p className="text-gray-700">{bio}</p>
    </div>
  );
}
