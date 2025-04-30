
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface ProfileInfoProps {
  username?: string;
  displayName: string;
  bio?: string;
  interests: string[];
  isPrivate?: boolean;
}

export function ProfileInfo({
  username,
  displayName,
  bio,
  interests,
  isPrivate = false
}: ProfileInfoProps) {
  return (
    <div className="text-center md:text-left flex-grow">
      <h1 className="text-2xl font-bold text-gray-900">
        {displayName}
        {isPrivate && (
          <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
            Private
          </span>
        )}
      </h1>
      <p className="text-gray-500">@{username || "plushielover"}</p>
      <p className="mt-2 text-gray-700 max-w-2xl">
        {bio || "Passionate plushie collector"}
      </p>
      
      <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
        {interests.map((interest, index) => (
          <Badge key={index} variant="outline" className="bg-softspot-50 hover:bg-softspot-100 text-softspot-600 border-softspot-200">
            {interest}
          </Badge>
        ))}
      </div>
    </div>
  );
}
