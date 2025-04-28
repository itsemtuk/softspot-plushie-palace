
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface PostImageProps {
  imageUrl: string;
  altText: string;
}

export function PostImage({ imageUrl, altText }: PostImageProps) {
  return (
    <div className="bg-black flex items-center justify-center">
      <AspectRatio ratio={1} className="w-full">
        <img 
          src={imageUrl} 
          alt={altText} 
          className="object-cover w-full h-full" 
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
            console.error("Failed to load image:", imageUrl);
          }}
        />
      </AspectRatio>
    </div>
  );
}
