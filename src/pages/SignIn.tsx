
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Navbar } from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { isAuthenticated } from '@/utils/auth/authState';

const SignIn = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
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
      // Small delay to ensure Clerk has time to initialize
      setTimeout(() => {
        setIsLoading(false);
        console.log("SignIn page - showing Clerk UI");
      }, 500);
    }
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuthAndRedirect();
    };
    
    window.addEventListener('clerk-auth-change', handleAuthChange);
    return () => {
      window.removeEventListener('clerk-auth-change', handleAuthChange);
    };
  }, [navigate]);

  const cardStyles = isMobile ? "border-softspot-200 shadow-lg mx-4" : "border-softspot-200 shadow-lg";
  
  // Show loading state while checking Clerk
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
