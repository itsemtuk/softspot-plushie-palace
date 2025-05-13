
import { Facebook, Instagram, Twitter as X, Youtube, Link } from "lucide-react";

interface ProfileSocialLinksProps {
  socialLinks: any[];
}

export const ProfileSocialLinks = ({ socialLinks }: ProfileSocialLinksProps) => {
  if (!socialLinks || socialLinks.length === 0) return null;

  // Social media icon renderer
  const renderSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram size={18} />;
      case 'twitter':
      case 'x':
        return <X size={18} />;
      case 'facebook':
        return <Facebook size={18} />;
      case 'youtube':
        return <Youtube size={18} />;
      default:
        return <Link size={18} />;
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {socialLinks.map((link: any, index: number) => (
        <a 
          key={index} 
          href={link.username.startsWith('http') ? link.username : 
            link.platform.toLowerCase() === 'x' ? 
              `https://x.com/${link.username}` :
              `https://${link.platform.toLowerCase()}.com/${link.username}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-softspot-500 transition-colors"
          title={`Visit ${link.platform}`}
        >
          {renderSocialIcon(link.platform)}
        </a>
      ))}
    </div>
  );
};
