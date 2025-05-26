
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface RobustImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  showLoadingSpinner?: boolean;
}

export const RobustImage = ({ 
  src, 
  fallbackSrc = '/placeholder.svg', 
  alt, 
  className,
  showLoadingSpinner = false,
  ...props 
}: RobustImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(showLoadingSpinner);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      console.warn(`Failed to load image: ${currentSrc}, falling back to: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="w-4 h-4 border-2 border-softspot-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          "transition-opacity duration-200",
          isLoading ? "opacity-0" : "opacity-100",
          hasError ? "filter grayscale" : "",
          className
        )}
      />
      {hasError && (
        <div className="absolute bottom-1 right-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded">
          Fallback
        </div>
      )}
    </div>
  );
};
