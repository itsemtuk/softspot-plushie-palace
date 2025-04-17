
import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import OnboardingForm from "@/components/OnboardingForm";

const Onboarding = () => {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user is loaded and if they've already completed onboarding
    if (isLoaded && user) {
      const onboardingCompleted = user.publicMetadata.onboardingCompleted;
      
      if (onboardingCompleted) {
        navigate('/feed');
      } else {
        setIsReady(true);
      }
    } else if (isLoaded && !userId) {
      // If not logged in, redirect to sign in
      navigate('/sign-in');
    }
  }, [isLoaded, user, userId, navigate]);

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
        <OnboardingForm />
      </div>
    </div>
  );
};

export default Onboarding;
