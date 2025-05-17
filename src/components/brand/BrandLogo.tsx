
import React from 'react';

interface BrandLogoProps {
  brandName: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ brandName, className = "w-6 h-6" }) => {
  // Map of brand names to their logo files - handle case variations
  const normalizedBrandName = brandName.toLowerCase().trim();
  
  const brandLogoMap: Record<string, string> = {
    "jellycat": "/assets/Brand_Logos/Jellycat.JPG",
    "build a bear": "/assets/Brand_Logos/Build a Bear.JPG",
    "build-a-bear": "/assets/Brand_Logos/Build a Bear.JPG",
    "squishmallow": "/assets/Brand_Logos/Squishmallows.JPG",
    "squishmallows": "/assets/Brand_Logos/Squishmallows.JPG",
    "pokémon": "/assets/Brand_Logos/Pokemon.PNG",
    "pokemon": "/assets/Brand_Logos/Pokemon.PNG",
    "sanrio": "/assets/Brand_Logos/Sanrio.PNG",
    "disney": "/assets/Brand_Logos/Disney.JPG",
    "ty": "/assets/brands/ty-logo.png",
    "gund": "/assets/brands/gund-logo.png",
    "steiff": "/assets/brands/steiff-logo.png",
    "aurora world": "/assets/brands/aurora-logo.png",
    "aurora": "/assets/brands/aurora-logo.png",
  };
  
  // Get the logo path by checking the normalized brand name
  let logoPath = "/assets/brands/generic-plushie-icon.png"; // Default fallback
  
  // Try to find a match in our map
  for (const [key, value] of Object.entries(brandLogoMap)) {
    if (normalizedBrandName.includes(key)) {
      logoPath = value;
      break;
    }
  }
  
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
