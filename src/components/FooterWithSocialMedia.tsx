
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const FooterWithSocialMedia = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-softspot-400">SoftSpot</h3>
            <p className="text-gray-300 mb-4">
              The ultimate community for plushie collectors. Buy, sell, trade, and connect with fellow enthusiasts in our cozy corner of the internet.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/softspotweb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-softspot-400 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com/softspotweb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-softspot-400 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://instagram.com/softspotweb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-softspot-400 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="mailto:hello@softspot.com" 
                className="text-gray-400 hover:text-softspot-400 transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-softspot-400">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/about" className="hover:text-softspot-400 transition-colors">About Us</a></li>
              <li><a href="/marketplace" className="hover:text-softspot-400 transition-colors">Marketplace</a></li>
              <li><a href="/feed" className="hover:text-softspot-400 transition-colors">Community</a></li>
              <li><a href="/help" className="hover:text-softspot-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-softspot-400">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/contact" className="hover:text-softspot-400 transition-colors">Contact Us</a></li>
              <li><a href="/privacy" className="hover:text-softspot-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-softspot-400 transition-colors">Terms of Service</a></li>
              <li><a href="/guidelines" className="hover:text-softspot-400 transition-colors">Community Guidelines</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SoftSpot. All rights reserved. Built with ❤️ for plushie lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterWithSocialMedia;
