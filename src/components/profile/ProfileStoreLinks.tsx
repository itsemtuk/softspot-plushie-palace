
import { ShoppingBag, Link } from "lucide-react";

interface StoreLink {
  platform: string;
  url: string;
}

interface ProfileStoreLinksProps {
  storeLinks: StoreLink[];
}

export const ProfileStoreLinks = ({ storeLinks }: ProfileStoreLinksProps) => {
  if (!storeLinks || storeLinks.length === 0) return null;
  
  // Store icon renderer
  const renderStoreIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'ebay':
        return <ShoppingBag size={16} />;
      case 'etsy':
        return <ShoppingBag size={16} />;
      default:
        return <Link size={16} />;
    }
  };
  
  return (
    <div className="mb-4">
      <h2 className="font-semibold text-gray-800 mb-2">My Stores</h2>
      <div className="flex flex-wrap justify-center md:justify-start gap-2">
        {storeLinks.map((link: StoreLink, index: number) => {
          // Ensure URL has proper format
          let url = link.url;
          if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
          }
          
          return (
            <a 
              key={index}
              href={url}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-softspot-100 text-softspot-700 px-3 py-1 rounded-full text-xs hover:bg-softspot-200 transition-colors inline-flex items-center gap-1"
            >
              {renderStoreIcon(link.platform)}
              {link.platform}
            </a>
          );
        })}
      </div>
    </div>
  );
};
