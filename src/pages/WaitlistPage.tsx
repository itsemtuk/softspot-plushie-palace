
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoaded, signUp } = useSignUp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    try {
      setIsSubmitting(true);
      
      // Add to waitlist (this would connect to your database in production)
      // For now, we'll simulate adding to waitlist and then attempt to pre-register with Clerk
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      // Pre-register email with Clerk (optional)
      await signUp.create({
        emailAddress: email,
      });
      
      // Successful submission
      setIsSubmitted(true);
      toast({
        title: "Thank you for joining our waitlist!",
        description: "We'll notify you when Plushie Palace launches.",
      });
      
    } catch (error) {
      console.error("Waitlist submission error:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-50 p-4">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-50 blur-2xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-100 rounded-full opacity-60 blur-xl"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-md w-full bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Plushie Palace</h1>
          <p className="text-lg text-gray-600">The social marketplace for plushie lovers</p>
        </div>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Your name" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="your@email.com" 
                required
              />
            </div>
            
            <Button 
              className="w-full bg-softspot-500 hover:bg-softspot-600 text-white font-medium py-2 px-4 rounded-lg"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              Be the first to know when we launch! Join our exclusive waitlist for early access.
            </p>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="mb-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">You're on the list!</h2>
            <p className="text-gray-600">
              Thanks for your interest! We'll notify you at <span className="font-medium">{email}</span> when we're ready to launch.
            </p>
          </div>
        )}
      </div>
      
      {/* Features preview */}
      <div className="relative z-10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-softspot-500 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">Safe Marketplace</h3>
          <p className="text-gray-600 text-sm">Buy, sell, and trade plushies securely with integrated payment options.</p>
        </div>
        
        <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-softspot-500 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">Social Community</h3>
          <p className="text-gray-600 text-sm">Connect with fellow collectors, share your collection, and discover new favorites.</p>
        </div>
        
        <div className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="text-softspot-500 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg mb-2">Global Shipping</h3>
          <p className="text-gray-600 text-sm">Ship and receive plushies from around the world with integrated shipping options.</p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-xs">
        <p>© {new Date().getFullYear()} Plushie Palace. All rights reserved.</p>
      </div>
    </div>
  );
};

export default WaitlistPage;
