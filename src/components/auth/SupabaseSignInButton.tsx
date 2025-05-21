
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase, fetchWithRetry } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export const SupabaseSignInButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  
  // Check if Supabase is initialized
  useEffect(() => {
    const checkSupabase = () => {
      if (supabase) {
        setIsSupabaseReady(true);
      } else {
        console.error("Supabase client not initialized");
      }
    };
    
    checkSupabase();
    
    // Check again after a delay in case of async initialization
    const timeout = setTimeout(checkSupabase, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const handleSupabaseGoogleSignIn = async () => {
    if (!isSupabaseReady) {
      toast({
        variant: "destructive",
        title: "Service Unavailable",
        description: "Authentication service is not ready. Please try again later.",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Initiating Supabase Google sign-in...");
      
      // Use fetchWithRetry to handle potential network issues
      const result = await fetchWithRetry(() => 
        supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
          }
        })
      );
      
      if (result?.error) {
        console.error("Supabase OAuth error:", result.error);
        throw result.error;
      }
      
      // If we get here, the OAuth redirect should be happening
      console.log("Supabase OAuth redirect initiated");
    } catch (error: any) {
      console.error("Error signing in with Google via Supabase:", error);
      
      // Show appropriate error based on error message
      if (error?.message?.includes('CORS') || error?.message?.includes('network')) {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Unable to connect to authentication service. Please check your network and try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sign in failed",
          description: "There was a problem signing in with Google. Please try again.",
        });
      }
    } finally {
      // Reset loading state after a short delay (since redirect might happen)
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button 
        onClick={handleSupabaseGoogleSignIn}
        disabled={isLoading || !isSupabaseReady}
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors"
      >
        {isLoading ? (
          <Spinner className="mr-2 h-4 w-4" />
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        Sign in with Google
      </Button>
      <div className="text-center text-sm text-gray-500 mt-4">
        Using Supabase Authentication
      </div>
    </div>
  );
};
