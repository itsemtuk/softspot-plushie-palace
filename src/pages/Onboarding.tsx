
import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate, Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import OnboardingForm from "@/components/OnboardingForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Onboarding = () => {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if user is loaded and if they've already completed onboarding
    if (isLoaded && user) {
      const onboardingCompleted = user.unsafeMetadata.onboardingCompleted;
      
      // If we're coming from profile edit, set editing mode
      const params = new URLSearchParams(window.location.search);
      if (params.get('edit') === 'true') {
        setIsEditing(true);
        setIsReady(true);
        return;
      }
      
      if (onboardingCompleted && !isEditing) {
        // Only redirect to feed if this is actually onboarding, not profile editing
        // and onboarding is already completed
        navigate('/feed');
      } else {
        // Delay setting ready to ensure all components are loaded first
        setTimeout(() => {
          setIsReady(true);
        }, 300);
      }
    } else if (isLoaded && !userId) {
      // If not logged in, redirect to sign in
      navigate('/sign-in');
    }
  }, [isLoaded, user, userId, navigate, isEditing]);

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-bounce">
            <div className="h-16 w-16 rounded-full bg-softspot-200 flex items-center justify-center">
              <span className="text-3xl">🧸</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-8 pb-24 px-4">
        {isEditing && (
          <div className="max-w-2xl mx-auto mb-4">
            <Button 
              variant="ghost" 
              className="flex items-center text-gray-500"
              onClick={handleBackToProfile}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </div>
        )}
        <OnboardingForm />
      </div>
    </div>
  );
};

// Create OnboardingRoute component to restrict access
// This component will check if onboarding is complete and redirect accordingly
export const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, user } = useUser();
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-bounce">
          <div className="h-16 w-16 rounded-full bg-softspot-200 flex items-center justify-center">
            <span className="text-3xl">🧸</span>
          </div>
        </div>
      </div>
    );
  }
  
  const onboardingCompleted = user?.unsafeMetadata.onboardingCompleted as boolean;
  
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  
  if (!onboardingCompleted && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

export default Onboarding;
