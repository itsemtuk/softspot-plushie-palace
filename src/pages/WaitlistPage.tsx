
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
      {/* Animated decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-50 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-40 blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-100 rounded-full opacity-60 blur-xl animate-pulse" style={{animationDelay: "2s"}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-36 h-36 bg-yellow-100 rounded-full opacity-30 blur-2xl animate-pulse" style={{animationDelay: "1.5s"}}></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-lg w-full bg-white bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2 tracking-tight">Plushie Palace</h1>
          <p className="text-xl text-gray-600">The social marketplace for plushie lovers</p>
          
          <div className="mt-4 flex items-center justify-center">
            <span className="bg-softspot-500 text-white text-xs px-3 py-1 rounded-full">Coming Soon</span>
          </div>
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
                className="backdrop-blur-lg bg-white/50"
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
                className="backdrop-blur-lg bg-white/50"
              />
            </div>
            
            <Button 
              className="w-full bg-softspot-500 hover:bg-softspot-600 text-white font-medium py-2 px-4 rounded-lg"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
            
            <p className="text-sm text-center text-gray-500 mt-6">
              Be the first to know when we launch! Join our exclusive waitlist for early access.
            </p>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="mb-4 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">You're on the list!</h2>
            <p className="text-gray-600 mb-6">
              Thanks for your interest! We'll notify you at <span className="font-medium">{email}</span> when we're ready to launch.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
                setName("");
              }}
            >
              Join with another email
            </Button>
          </div>
        )}
      </div>
      
      {/* Features preview with tabs */}
      <div className="relative z-10 mt-12 max-w-4xl w-full">
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="payments">Secure Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketplace" className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-xl mb-3">Global Plushie Marketplace</h3>
                <p className="text-gray-600">
                  Buy, sell, and trade plushies with collectors from around the world. Our secure marketplace handles 
                  payments with multiple methods including cards, PayPal, Apple Pay, and Google Pay.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Secure transactions with buyer protection
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    International shipping options
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Multiple payment methods
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-48">
                  <div className="absolute inset-0 bg-softspot-100 rounded-full blur-xl opacity-50"></div>
                  <div className="relative z-10 h-full w-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-softspot-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="community" className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-xl mb-3">Connect with Fellow Collectors</h3>
                <p className="text-gray-600">
                  Share your collection, discover new favorites, and connect with plushie enthusiasts 
                  around the world through our social community features.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Create a profile and showcase your collection
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Engage with posts and comments
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Follow collectors with similar interests
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-48">
                  <div className="absolute inset-0 bg-softspot-100 rounded-full blur-xl opacity-50"></div>
                  <div className="relative z-10 h-full w-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-softspot-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payments" className="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-xl mb-3">Secure Payment Options</h3>
                <p className="text-gray-600">
                  Your transactions are always secure with our multiple payment options and industry-standard encryption.
                  Choose from various payment methods to buy and sell with confidence.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Credit/Debit Cards (SSL encrypted)
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    PayPal, Apple Pay, Google Pay
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Two-factor authentication (2FA)
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-48">
                  <div className="absolute inset-0 bg-softspot-100 rounded-full blur-xl opacity-50"></div>
                  <div className="relative z-10 h-full w-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-softspot-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Newsletter signup (alternative if they're not ready to join waitlist) */}
      <div className="relative z-10 mt-12 max-w-lg w-full bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Stay Updated</h2>
          <p className="text-gray-600 text-sm">Get the latest news about our launch and features</p>
        </div>
        
        <div className="flex gap-2">
          <Input 
            placeholder="Enter your email" 
            type="email"
            className="backdrop-blur-lg bg-white/50"
          />
          <Button>Subscribe</Button>
        </div>
        
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <a href="#" className="text-sm text-gray-500 hover:text-softspot-500 transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-gray-500 hover:text-softspot-500 transition-colors">Terms of Service</a>
          <a href="#" className="text-sm text-gray-500 hover:text-softspot-500 transition-colors">Contact Us</a>
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
