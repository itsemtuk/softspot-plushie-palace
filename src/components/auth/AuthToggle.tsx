
import { useState } from 'react';

interface AuthToggleProps {
  isUsingClerk: boolean;
  onToggle: (useClerk: boolean) => void;
}

export const AuthToggle = ({ isUsingClerk, onToggle }: AuthToggleProps) => {
  return (
    <button 
      onClick={() => onToggle(!isUsingClerk)}
      className="text-xs text-softspot-500 hover:text-softspot-700 mt-2"
    >
      Switch to {isUsingClerk ? 'Supabase' : 'Clerk'} authentication
    </button>
  );
};
