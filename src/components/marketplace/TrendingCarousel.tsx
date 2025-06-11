
import { useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlushieCard } from "@/components/PlushieCard";
import { marketplacePlushies } from "@/data/plushies";

export function TrendingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;
  const maxIndex = Math.max(0, marketplacePlushies.length - itemsToShow);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const visibleItems = marketplacePlushies.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-softspot-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Trending Plushies
          </h2>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleItems.map((plushie) => (
          <PlushieCard
            key={plushie.id}
            id={plushie.id}
            image={plushie.image}
            title={plushie.title}
            username={plushie.username}
            likes={plushie.likes}
            comments={plushie.comments}
            price={plushie.price}
            forSale={plushie.forSale}
            variant="marketplace"
          />
        ))}
      </div>

      {marketplacePlushies.length > itemsToShow && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-1">
            {Array.from({ length: Math.ceil(marketplacePlushies.length / itemsToShow) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * itemsToShow)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / itemsToShow) === index
                    ? "bg-softspot-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
