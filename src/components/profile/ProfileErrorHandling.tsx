
import { ReactNode } from 'react';
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ProfileErrorBoundaryProps {
  children: ReactNode;
  error?: string | null;
}

export const ProfileErrorDisplay = ({ error }: { error: string }) => {
  return (
    <Card className="p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-softspot-500 text-white px-4 py-2 rounded-md hover:bg-softspot-600"
      >
        Try Again
      </button>
    </Card>
  );
};

export const ProfileLoadingState = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-softspot-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your profile...</p>
      </div>
    </div>
  );
};
