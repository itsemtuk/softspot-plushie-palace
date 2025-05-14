
import { useEffect, useState } from "react";

interface BrandLogoProps {
  brandName: string;
  className?: string;
}

export const BrandLogo = ({ brandName, className = "w-16 h-16" }: BrandLogoProps) => {
  const [logoSrc, setLogoSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    const loadImage = async () => {
      try {
        // Try to load the image dynamically
        let imagePath = "";
        
        switch(brandName.toLowerCase()) {
          case "build a bear":
          case "build-a-bear":
            imagePath = "/assets/Brand_Logos/Build a Bear.JPG";
            break;
          case "disney":
            imagePath = "/assets/Brand_Logos/Disney.JPG";
            break;
          case "jellycat":
            imagePath = "/assets/Brand_Logos/Jellycat.JPG";
            break;
          case "pokemon":
            imagePath = "/assets/Brand_Logos/Pokemon.PNG";
            break;
          case "sanrio":
            imagePath = "/assets/Brand_Logos/Sanrio.PNG";
            break;
          case "squishmallows":
            imagePath = "/assets/Brand_Logos/Squishmallows.JPG";
            break;
          default:
            // If no exact match, try to find a partial match
            const brandNameLower = brandName.toLowerCase();
            if (brandNameLower.includes("build") && brandNameLower.includes("bear")) {
              imagePath = "/assets/Brand_Logos/Build a Bear.JPG";
            } else if (brandNameLower.includes("disney")) {
              imagePath = "/assets/Brand_Logos/Disney.JPG";
            } else if (brandNameLower.includes("jellycat")) {
              imagePath = "/assets/Brand_Logos/Jellycat.JPG";
            } else if (brandNameLower.includes("pokemon")) {
              imagePath = "/assets/Brand_Logos/Pokemon.PNG";
            } else if (brandNameLower.includes("sanrio")) {
              imagePath = "/assets/Brand_Logos/Sanrio.PNG";
            } else if (brandNameLower.includes("squishmallow")) {
              imagePath = "/assets/Brand_Logos/Squishmallows.JPG";
            }
            break;
        }
        
        if (imagePath) {
          setLogoSrc(imagePath);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error("Error loading brand logo:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadImage();
  }, [brandName]);
  
  if (loading) {
    return (
      <div className={`${className} bg-gray-200 rounded-md animate-pulse`}></div>
    );
  }
  
  if (error || !logoSrc) {
    return (
      <div className={`${className} bg-gray-100 rounded-md flex items-center justify-center`}>
        <span className="text-sm font-medium text-gray-500">{brandName}</span>
      </div>
    );
  }
  
  return (
    <img 
      src={logoSrc}
      alt={`${brandName} logo`}
      className={`${className} object-contain rounded-md`}
    />
  );
};
