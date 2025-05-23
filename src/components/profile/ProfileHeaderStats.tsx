
import React, { useState } from 'react';

interface ProfileHeaderStatsProps {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export function ProfileHeaderStats({ 
  postsCount, 
  followersCount, 
  followingCount 
}: ProfileHeaderStatsProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'collections' | 'sales'>('posts');

  return (
    <div className="mt-4 border-b border-gray-100">
      <div className="flex justify-around mb-4">
        <div className="text-center">
          <p className="font-semibold">{postsCount}</p>
          <p className="text-xs text-gray-600">Posts</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{followersCount}</p>
          <p className="text-xs text-gray-600">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-semibold">{followingCount}</p>
          <p className="text-xs text-gray-600">Following</p>
        </div>
      </div>
    </div>
  );
}
