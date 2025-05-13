
import { ShoppingBag } from "lucide-react";

interface StoreLink {
  platform: string;
  url: string;
}

interface ProfileStoreLinksProps {
  storeLinks: StoreLink[];
}

export const ProfileStoreLinks = ({ storeLinks }: ProfileStoreLinksProps) => {
  if (!storeLinks || storeLinks.length === 0) return null;
  
  return (
    <div className="mb-4">
      <h2 className="font-semibold text-gray-800 mb-2">My Stores</h2>
      <div className="flex flex-wrap gap-2">
        {storeLinks.map((link: StoreLink, index: number) => (
          <a 
            key={index}
            href={link.url}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-softspot-100 text-softspot-700 px-3 py-1 rounded-full text-xs hover:bg-softspot-200 transition-colors inline-flex items-center gap-1"
          >
            <ShoppingBag className="h-3 w-3" />
            {link.platform}
          </a>
        ))}
      </div>
    </div>
  );
};
