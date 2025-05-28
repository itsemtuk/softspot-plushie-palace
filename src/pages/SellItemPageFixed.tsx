
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { SimpleConnectionStatus } from "@/components/ui/simple-connection-status";
import { SellItemAuthGuard } from "@/components/marketplace/sell/SellItemAuthGuard";
import { SellItemFormWrapper } from "@/components/marketplace/sell/SellItemFormWrapper";
import { SellItemAuthLoading, SellItemFormLoading } from "@/components/marketplace/sell/SellItemLoadingStates";
import { useUser } from "@clerk/clerk-react";
import { useClerkSupabaseUser } from "@/hooks/useClerkSupabaseUser";

const SellItemPageFixed = () => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);
  
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { supabaseUserId, isLoading: isUserSyncLoading } = useClerkSupabaseUser(clerkUser);

  const handleAuthReady = () => {
    setIsAuthReady(true);
    // Small delay to ensure form is properly initialized
    setTimeout(() => setIsFormReady(true), 200);
  };

  return (
    <MainLayout>
      <EnhancedErrorBoundary>
        <div className="max-w-2xl mx-auto py-6">
          <SimpleConnectionStatus />
          
          <SellItemAuthGuard onAuthReady={handleAuthReady}>
            {!isAuthReady || isUserSyncLoading || !isClerkLoaded ? (
              <SellItemAuthLoading message="Preparing your account..." />
            ) : !isFormReady ? (
              <SellItemFormLoading />
            ) : (
              <SellItemFormWrapper supabaseUserId={supabaseUserId} />
            )}
          </SellItemAuthGuard>
        </div>
      </EnhancedErrorBoundary>
    </MainLayout>
  );
};

export default SellItemPageFixed;
