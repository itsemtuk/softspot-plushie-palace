
import React from 'react';

interface BrandLogoProps {
  brandName: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ brandName, className = "w-6 h-6" }) => {
  // Map of brand names to their logo files
  const brandLogoMap: Record<string, string> = {
    "Jellycat": "/assets/brands/jellycat-logo.png",
    "jellycat": "/assets/brands/jellycat-logo.png",
    "Build-A-Bear": "/assets/brands/build-a-bear-logo.png",
    "build-a-bear": "/assets/brands/build-a-bear-logo.png",
    "Squishmallow": "/assets/brands/squishmallow-logo.png",
    "squishmallow": "/assets/brands/squishmallow-logo.png",
    "Pokémon": "/assets/brands/pokemon-logo.png",
    "pokemon": "/assets/brands/pokemon-logo.png",
    "Pokemon": "/assets/brands/pokemon-logo.png",
    "Sanrio": "/assets/brands/sanrio-logo.png",
    "sanrio": "/assets/brands/sanrio-logo.png",
    "Disney": "/assets/brands/disney-logo.png",
    "disney": "/assets/brands/disney-logo.png",
    "Ty": "/assets/brands/ty-logo.png",
    "ty": "/assets/brands/ty-logo.png",
    "Gund": "/assets/brands/gund-logo.png",
    "gund": "/assets/brands/gund-logo.png",
    "Steiff": "/assets/brands/steiff-logo.png",
    "steiff": "/assets/brands/steiff-logo.png",
    "Aurora World": "/assets/brands/aurora-logo.png",
    "aurora": "/assets/brands/aurora-logo.png",
    "Other": "/assets/brands/generic-plushie-icon.png"
  };
  
  // Get the logo path or use a default
  const logoPath = brandLogoMap[brandName] || "/assets/brands/generic-plushie-icon.png";
  
  // Generate a color based on brand name if no logo available
  const generateBrandColor = (name: string): string => {
    const colors = [
      "bg-red-100 text-red-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800"
    ];
    
    // Use the sum of character codes as a simple hash
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  // Create initials as fallback
  const getInitials = (name: string): string => {
    return name.split(/\s+/).map(word => word[0].toUpperCase()).join('').slice(0, 2);
  };

  return (
    <div className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}>
      <img 
        src={logoPath} 
        alt={`${brandName} logo`}
        className="w-full h-full object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null; // Prevent infinite loop
          
          // Replace with initials in a colored circle
          const parent = target.parentNode as HTMLElement;
          if (parent) {
            const brandColor = generateBrandColor(brandName);
            parent.className = `${className} ${brandColor} flex items-center justify-center`;
            parent.innerHTML = `<span class="text-xs font-bold">${getInitials(brandName)}</span>`;
          }
        }}
      />
    </div>
  );
};
