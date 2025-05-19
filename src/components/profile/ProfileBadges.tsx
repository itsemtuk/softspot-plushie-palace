
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Badge {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface ProfileBadgesProps {
  badges: Badge[];
}

export function ProfileBadges({ badges }: ProfileBadgesProps) {
  if (!badges || badges.length === 0) return null;
  
  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Badges & Achievements</h3>
      <div className="flex flex-wrap gap-3">
        {badges.map(badge => (
          <TooltipProvider key={badge.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                >
                  <img 
                    src={badge.image} 
                    alt={badge.name} 
                    className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-sm"
                  />
                  <span className="text-xs text-gray-600 mt-1 text-center">{badge.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="font-medium">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.description || `Earned for being awesome!`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
