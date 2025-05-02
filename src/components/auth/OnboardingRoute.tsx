
import { Navigate } from "react-router-dom";

export const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = !!localStorage.getItem('currentUserId');
  
  if (!isLoggedIn) {
    return <Navigate to="/sign-in" replace />;
  }
  
  // Check if onboarding is completed
  const userProfile = localStorage.getItem('userProfile');
  let onboardingCompleted = false;
  
  if (userProfile) {
    try {
      const parsedProfile = JSON.parse(userProfile);
      onboardingCompleted = parsedProfile.onboardingCompleted;
    } catch (error) {
      console.error("Error parsing user profile:", error);
    }
  }
  
  if (!onboardingCompleted && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};
