
import { Instagram, Facebook, Twitter, Heart, Users, Sparkles, Shield } from 'lucide-react';
import { FooterWithSocialMedia } from '@/components/FooterWithSocialMedia';

export default function AboutWithSocialMedia() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-softspot-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-softspot-600 via-purple-600 to-pink-600 py-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About SoftSpot
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            The world's most beloved community for plushie enthusiasts, collectors, and dreamers.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe everyone deserves to find their perfect plushie companion. SoftSpot connects collectors, 
              enthusiasts, and newcomers in a safe, welcoming community where magic happens every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-softspot-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-softspot-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Community First</h3>
              <p className="text-gray-600">
                Building meaningful connections between plushie lovers worldwide through shared passion and experiences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Joy & Wonder</h3>
              <p className="text-gray-600">
                Spreading happiness through the simple magic of plushies and the stories they inspire.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-10 w-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Trust & Safety</h3>
              <p className="text-gray-600">
                Creating a secure environment where everyone can buy, sell, and share with complete confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
          </div>
          
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-xl leading-relaxed mb-8">
              SoftSpot was born from a simple idea: plushies bring people together. What started as a small community 
              of collectors sharing their favorite finds has grown into the world's premier destination for plushie enthusiasts.
            </p>
            
            <p className="text-lg leading-relaxed mb-8">
              We've seen incredible stories unfold on our platform - childhood toys reunited with their owners, 
              rare collectibles finding their way to passionate collectors, and friendships formed over shared love 
              for these soft companions.
            </p>
            
            <p className="text-lg leading-relaxed">
              Today, SoftSpot serves thousands of users worldwide, facilitating millions of dollars in transactions 
              while maintaining the warmth and authenticity of our original community spirit.
            </p>
          </div>
        </div>
      </div>

      {/* Connect Section */}
      <div className="bg-gradient-to-r from-softspot-500 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Connect With Us</h2>
          <p className="text-xl text-white/90 mb-8">
            Follow our journey and join the conversation on social media
          </p>
          
          <div className="flex justify-center space-x-8">
            <a
              href="https://instagram.com/softspotweb"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-8 w-8 text-white" />
            </a>
            <a
              href="https://facebook.com/softspotweb"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="h-8 w-8 text-white" />
            </a>
            <a
              href="https://twitter.com/softspotweb"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors"
              aria-label="Follow us on Twitter"
            >
              <Twitter className="h-8 w-8 text-white" />
            </a>
          </div>
        </div>
      </div>

      <FooterWithSocialMedia />
    </div>
  );
}
