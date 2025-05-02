
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import OnboardingForm from "@/components/OnboardingForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isClerkConfigured = !!localStorage.getItem('usingClerk');
  const isLoggedIn = !!localStorage.getItem('currentUserId');

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      navigate('/sign-in');
      return;
    }
    
    // Check if onboarding is completed
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        const parsedProfile = JSON.parse(userProfile);
        const onboardingCompleted = parsedProfile.onboardingCompleted;
        
        // If we're coming from profile edit, set editing mode
        const params = new URLSearchParams(window.location.search);
        if (params.get('edit') === 'true') {
          setIsEditing(true);
          setIsReady(true);
          return;
        }
        
        if (onboardingCompleted && !isEditing) {
          // Only redirect to feed if this is actually onboarding, not profile editing
          navigate('/feed');
        } else {
          // Delay setting ready to ensure all components are loaded first
          setTimeout(() => {
            setIsReady(true);
          }, 300);
        }
      } catch (error) {
        console.error("Error parsing user profile:", error);
        setIsReady(true);
      }
    } else {
      setIsReady(true);
    }
    
    // If Clerk is configured, handle that separately
    if (isClerkConfigured) {
      import('@clerk/clerk-react').then(({ useUser, useAuth }) => {
        const ClerkComponent = () => {
          const { isLoaded, userId } = useAuth();
          const { user } = useUser();
          
          useEffect(() => {
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
          }, [isLoaded, user, userId]);
          
          return null;
        };
        
        // Create a temporary element to mount the Clerk component
        const div = document.createElement('div');
        const root = document.getElementById('root');
        if (root) {
          root.appendChild(div);
          
          import('react-dom/client').then(({ createRoot }) => {
            const clerkRoot = createRoot(div);
            clerkRoot.render(<ClerkComponent />);
            
            return () => {
              clerkRoot.unmount();
              if (root.contains(div)) {
                root.removeChild(div);
              }
            };
          });
        }
      }).catch(error => {
        console.error("Error loading Clerk:", error);
      });
    }
  }, [navigate, isEditing, isLoggedIn, isClerkConfigured]);

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

export default Onboarding;
