import { useState, useEffect } from "react";

interface ProfileStatsProps {
  postsCount: number;
}

export const ProfileStats = ({ postsCount }: ProfileStatsProps) => {
  // This component is no longer used as the stats are now directly in UserProfileHeader
  // Keeping it for backward compatibility but it should be refactored out in a future update
  return null;
};
