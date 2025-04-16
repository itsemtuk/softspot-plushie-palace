
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Navbar } from '@/components/Navbar';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto pt-16 pb-24 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-softspot-600 mb-8">Sign In to SoftSpot</h1>
          <ClerkSignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none p-0",
                footer: "text-softspot-500"
              },
              variables: {
                colorPrimary: "#7e69ab",
                colorText: "#333333",
              }
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
