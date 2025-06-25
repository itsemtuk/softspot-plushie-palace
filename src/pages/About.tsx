
import { useIsMobile } from "@/hooks/use-mobile";
import { Navbar } from "@/components/Navbar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, ShoppingBag, Star } from "lucide-react";
import Footer from "@/components/Footer";

const About = () => {
  const isMobile = useIsMobile();
  
  const features = [
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Share Your Collection",
      description: "Showcase your beloved plushie collection with fellow enthusiasts"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500" />,
      title: "Connect with Community",
      description: "Follow other collectors and discover amazing plushie collections"
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-green-500" />,
      title: "Marketplace",
      description: "Buy and sell plushies safely within our trusted community"
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: "Reviews & Ratings",
      description: "Rate and review sellers to build a trustworthy marketplace"
    }
  ];

  const stats = [
    { label: "Active Users", value: "10,000+", color: "text-softspot-600" },
    { label: "Plushies Shared", value: "50,000+", color: "text-purple-600" },
    { label: "Marketplace Items", value: "5,000+", color: "text-green-600" },
    { label: "Community Posts", value: "25,000+", color: "text-blue-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {isMobile ? <MobileNav /> : <Navbar />}
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About SoftSpot
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-3xl mx-auto">
              The ultimate destination for plushie lovers to connect, share, and trade their beloved collections.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="text-sm">Community</Badge>
              <Badge variant="secondary" className="text-sm">Marketplace</Badge>
              <Badge variant="secondary" className="text-sm">Collection</Badge>
              <Badge variant="secondary" className="text-sm">Social</Badge>
            </div>
          </div>

          {/* Mission Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="h-6 w-6 text-softspot-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                We believe that plushies bring joy, comfort, and happiness to people of all ages. 
                SoftSpot was created to build a warm, welcoming community where plushie enthusiasts 
                can share their collections, discover new favorites, and connect with like-minded collectors 
                from around the world.
              </p>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
              What Makes Us Special
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    🤝 Community First
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We prioritize building meaningful connections and fostering a supportive environment 
                    where everyone feels welcome to share their passion for plushies.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    🔒 Safety & Trust
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your safety is our priority. We maintain strict guidelines and verification 
                    processes to ensure secure transactions and genuine community interactions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    🌈 Inclusivity
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We celebrate diversity and welcome collectors from all backgrounds, ages, 
                    and experience levels to join our growing community.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Get in Touch
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Have questions, suggestions, or just want to say hello? We'd love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Email:</strong> hello@softspot.com
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Support:</strong> support@softspot.com
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
