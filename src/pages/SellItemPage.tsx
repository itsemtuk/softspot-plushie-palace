
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { SimpleSellForm } from "@/components/marketplace/sell/SimpleSellForm";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SellItemPage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto py-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-center items-center p-8">
                <Spinner size="lg" />
                <span className="ml-3">Loading...</span>
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
          <Card>
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You need to be signed in to sell items.
                </AlertDescription>
              </Alert>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => navigate("/sign-in")}>
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
        <div className="max-w-4xl mx-auto py-6 px-4">
          <SimpleSellForm />
        </div>
      </EnhancedErrorBoundary>
    </MainLayout>
  );
};

export default SellItemPage;
