
import React from 'react';

interface Badge {
  id: string;
  name: string;
  image: string;
}

export interface ProfileBadgesProps {
  badges: Badge[];
}

export function ProfileBadges({ badges }: ProfileBadgesProps) {
  if (!badges || badges.length === 0) return null;
  
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Badges</h3>
      <div className="flex flex-wrap gap-2">
        {badges.map(badge => (
          <div 
            key={badge.id} 
            className="flex flex-col items-center justify-center"
            title={badge.name}
          >
            <img 
              src={badge.image} 
              alt={badge.name} 
              className="w-8 h-8 object-cover rounded-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
