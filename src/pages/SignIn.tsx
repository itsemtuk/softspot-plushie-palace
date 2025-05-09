
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { isAuthenticated } from '@/utils/auth/authState';
import { supabase } from '@/utils/supabase/client';

const SignIn = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isUsingClerk = localStorage.getItem('usingClerk') === 'true';
  
  // Check if already authenticated and redirect if needed
  useEffect(() => {
    const checkAuthAndRedirect = () => {
      if (isAuthenticated()) {
        console.log("User is already authenticated, redirecting to home");
        navigate('/');
        return true;
      }
      return false;
    };
    
    // Don't show loading if already redirecting
    if (!checkAuthAndRedirect()) {
      // Small delay to ensure authentication providers have time to initialize
      setTimeout(() => {
        setIsLoading(false);
        console.log("SignIn page - showing authentication UI");
      }, 500);
    }
    
    // Set up Supabase auth listener
    if (!isUsingClerk) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log("Supabase auth state change:", event);
        if (event === 'SIGNED_IN' && session) {
          // Redirect after successful sign-in
          navigate('/');
        }
      });
      
      return () => {
        // Clean up subscription when component unmounts
        subscription.unsubscribe();
      };
    }
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuthAndRedirect();
    };
    
    window.addEventListener('clerk-auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('clerk-auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [navigate, isUsingClerk]);

  const cardStyles = isMobile ? "border-softspot-200 shadow-lg mx-4" : "border-softspot-200 shadow-lg";
  
  // Show loading state while checking auth systems
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-md mx-auto pt-16 pb-24 px-4 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-softspot-600"></div>
        </div>
      </div>
    );
  }
  
  // Handle Supabase sign-in with Google
  const handleSupabaseGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google via Supabase:", error);
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "There was a problem signing in with Google. Please try again.",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className={`max-w-md mx-auto pt-16 pb-24 ${isMobile ? 'px-0' : 'px-4'}`}>
        <Card className={cardStyles}>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-softspot-600">SoftSpot</span>
              <div className="h-8 w-8 rounded-full bg-softspot-200 flex items-center justify-center ml-2">
                <span className="text-lg">🧸</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-softspot-600">Welcome Back</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Sign in to continue your plushie journey
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isUsingClerk ? (
              <ClerkSignIn 
                routing="path"
                path="/sign-in"
                signUpUrl="/sign-up"
                afterSignInUrl="/"
                appearance={{
                  elements: {
                    rootBox: "mx-auto w-full",
                    card: "shadow-none p-0",
                    footer: "text-softspot-500",
                    formButtonPrimary: "bg-softspot-500 hover:bg-softspot-600",
                    formFieldInput: "border-softspot-200 focus:border-softspot-400 focus:ring-softspot-300",
                    footerActionLink: "text-softspot-500 hover:text-softspot-600",
                    socialButtonsBlockButton: "border border-gray-300 text-gray-700 hover:bg-gray-50",
                    socialButtonsIconButton: "border border-gray-300 hover:bg-gray-50 w-14 h-14 flex items-center justify-center m-2", 
                    socialButtonsProviderIcon: "w-8 h-8", // Larger icons
                    socialButtonsBlockButtonText: "text-base font-medium",
                    formField: "mb-6" // Add more spacing between fields
                  },
                  variables: {
                    colorPrimary: "#7e69ab",
                    colorText: "#333333",
                  },
                  layout: {
                    socialButtonsVariant: "iconButton",
                    socialButtonsPlacement: "bottom"
                  }
                }}
              />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={handleSupabaseGoogleSignIn}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-50 transition-colors"
                >
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
                  Sign in with Google
                </button>
                <div className="text-center text-sm text-gray-500 mt-4">
                  Using Supabase Authentication
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col items-center gap-4 border-t pt-6">
            <p className="text-sm text-gray-500">Don't have an account?</p>
            <Link 
              to="/sign-up"
              className="inline-flex h-9 items-center justify-center rounded-md bg-softspot-100 px-4 py-2 text-sm font-medium text-softspot-700 transition-colors hover:bg-softspot-200 hover:text-softspot-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-softspot-400"
            >
              Sign up for free
            </Link>
          </CardFooter>
        </Card>
        
        <div className="mt-8 space-y-4">
          <div className="bg-card p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-foreground mb-2">Join our community</h3>
            <p className="text-sm text-muted-foreground">
              Connect with plushie enthusiasts, trade collectibles, and show off your collection.
            </p>
          </div>
          
          <div className="bg-card p-5 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-foreground mb-2">Find rare plushies</h3>
            <p className="text-sm text-muted-foreground">
              Browse our marketplace for limited edition and hard-to-find plushies from collectors worldwide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
