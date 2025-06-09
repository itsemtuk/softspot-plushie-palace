
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@clerk/clerk-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ImprovedSellItemForm } from "@/components/marketplace/sell/ImprovedSellItemForm";

const SellItemPage = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();

  useEffect(() => {
    if (isClerkLoaded) {
      if (!clerkUser) {
        navigate('/sign-in');
        return;
      }
      setIsReady(true);
    }
  }, [isClerkLoaded, clerkUser, navigate]);

  const handleSellSuccess = () => {
    navigate('/marketplace');
  };

  // Loading state
  if (!isClerkLoaded || !isReady) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <Spinner size="lg" />
          <p className="ml-3 text-gray-600 dark:text-gray-400 mt-4">
            Loading...
          </p>
        </div>
      </MainLayout>
    );
  }

  // Not authenticated
  if (!clerkUser) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh] flex-col">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center max-w-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Authentication Required</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-400">Please sign in to list your items for sale.</p>
            <button 
              className="bg-softspot-500 text-white px-4 py-2 rounded-md hover:bg-softspot-600 transition-colors"
              onClick={() => navigate('/sign-in')}
            >
              Sign In
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-6 px-4">
        <ImprovedSellItemForm onSuccess={handleSellSuccess} />
      </div>
    </MainLayout>
  );
};

export default SellItemPage;
