
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { SellItemFormWrapper } from "@/components/marketplace/sell/SellItemFormWrapper";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SellItemPage = () => {
  const { user, isLoaded } = useUser();
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      setIsReady(true);
    }
  }, [isLoaded]);

  if (!isLoaded || !isReady) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-6">
          <Card className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100 dark:from-purple-900 dark:to-softspot-900">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Sell Your Plushie</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center p-8">
                <Spinner size="lg" />
                <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">Loading...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-6">
          <Card className="rounded-2xl bg-white dark:bg-gray-800 shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-softspot-100 dark:from-purple-900 dark:to-softspot-900">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Sell Your Plushie</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You need to be signed in to sell items. Please sign in and try again.
                </AlertDescription>
              </Alert>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => navigate("/sign-in")} className="bg-softspot-500 hover:bg-softspot-600">
                  Sign In
                </Button>
                <Button variant="outline" onClick={() => navigate("/marketplace")}>
                  Back to Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <EnhancedErrorBoundary>
        <div className="max-w-2xl mx-auto py-6">
          <SellItemFormWrapper supabaseUserId={user.id} />
        </div>
      </EnhancedErrorBoundary>
    </MainLayout>
  );
};

export default SellItemPage;
