
import { Instagram, Facebook, Twitter, Heart } from 'lucide-react';

export const FooterWithSocialMedia = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-softspot-400 mb-4">SoftSpot</h3>
            <p className="text-gray-300 mb-4">
              The ultimate destination for plushie lovers. Buy, sell, and discover amazing plushies from collectors worldwide.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/softspotweb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-softspot-400 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://facebook.com/softspotweb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-softspot-400 transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/softspotweb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-softspot-400 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/marketplace" className="text-gray-300 hover:text-softspot-400 transition-colors">Marketplace</a></li>
              <li><a href="/feed" className="text-gray-300 hover:text-softspot-400 transition-colors">Community</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-softspot-400 transition-colors">About Us</a></li>
              <li><a href="/sell" className="text-gray-300 hover:text-softspot-400 transition-colors">Sell Items</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/help" className="text-gray-300 hover:text-softspot-400 transition-colors">Help Center</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-softspot-400 transition-colors">Contact Us</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-softspot-400 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-softspot-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-softspot-400" /> for plushie lovers everywhere
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 SoftSpot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
