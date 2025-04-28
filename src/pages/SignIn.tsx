
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Navbar } from '@/components/Navbar';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto pt-16 pb-24 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-softspot-600">SoftSpot</span>
            <div className="h-8 w-8 rounded-full bg-softspot-200 flex items-center justify-center ml-2">
              <span className="text-lg">🧸</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-softspot-600 mb-8">Sign In to SoftSpot</h1>
          <ClerkSignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none p-0",
                footer: "text-softspot-500",
                formButtonPrimary: "bg-softspot-500 hover:bg-softspot-600",
                formFieldInput: "border-softspot-200 focus:border-softspot-400 focus:ring-softspot-300",
                footerActionLink: "text-softspot-500 hover:text-softspot-600"
              },
              variables: {
                colorPrimary: "#7e69ab",
                colorText: "#333333",
              }
            }}
            redirectUrl="/feed"
            signUpUrl="/sign-up"
          />
        </div>
        
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Join our community of plushie enthusiasts</p>
          <p className="mt-1">Share, trade, and discover adorable collectibles</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
