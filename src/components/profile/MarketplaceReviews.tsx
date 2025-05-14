
import { useState } from 'react';
import { MarketplaceReview, UserReviewSummary } from '@/types/marketplace';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Star, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MarketplaceReviewsProps {
  reviews: MarketplaceReview[];
  summary: UserReviewSummary;
  showWriteReview?: boolean;
  onWriteReview?: () => void;
}

export const MarketplaceReviews = ({
  reviews,
  summary,
  showWriteReview = false,
  onWriteReview
}: MarketplaceReviewsProps) => {
  const [filter, setFilter] = useState<number | null>(null);

  // Filter reviews based on selected rating
  const filteredReviews = filter ? reviews.filter(r => r.rating === filter) : reviews;

  const renderStars = (count: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left - Overall rating */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold">{summary.averageRating.toFixed(1)}</h3>
            <div className="flex my-1">
              {renderStars(Math.round(summary.averageRating))}
            </div>
            <p className="text-sm text-gray-500">Based on {summary.totalReviews} reviews</p>
          </div>
          
          {/* Center - Rating breakdown */}
          <div className="col-span-2">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = rating === 5 ? summary.fiveStarCount :
                             rating === 4 ? summary.fourStarCount :
                             rating === 3 ? summary.threeStarCount :
                             rating === 2 ? summary.twoStarCount :
                             summary.oneStarCount;
                const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-2">
                    <button 
                      onClick={() => setFilter(filter === rating ? null : rating)}
                      className={`text-xs font-medium flex items-center ${filter === rating ? 'text-softspot-600' : 'text-gray-600'}`}
                    >
                      {rating} <Star className="h-3 w-3 ml-0.5" />
                    </button>
                    <Progress value={percentage} className="h-2 flex-1" />
                    <span className="text-xs text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {showWriteReview && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <button 
              onClick={onWriteReview}
              className="text-softspot-500 hover:text-softspot-600 font-medium text-sm"
            >
              Write a review
            </button>
          </div>
        )}
      </Card>
      
      {/* Filter indicator */}
      {filter !== null && (
        <div className="flex justify-between items-center px-1">
          <p className="text-sm">
            Showing {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'} with {filter} {filter === 1 ? 'star' : 'stars'}
          </p>
          <button 
            onClick={() => setFilter(null)}
            className="text-xs text-softspot-500 hover:text-softspot-600"
          >
            Clear filter
          </button>
        </div>
      )}
      
      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/assets/avatars/PLUSH_${Math.floor(Math.random() * 7) + 1}.PNG`} />
                    <AvatarFallback>{review.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <p className="font-medium text-sm">{review.username}</p>
                    <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <p className="mt-3 text-gray-700">{review.text}</p>
              
              {review.itemName && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Purchased: <span className="font-medium">{review.itemName}</span>
                  </p>
                </div>
              )}
              
              {review.verified && (
                <div className="flex items-center mt-2 text-green-600">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  <span className="text-xs">Verified Purchase</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-gray-100 rounded-lg">
          <p className="text-gray-500">No reviews found</p>
        </div>
      )}
    </div>
  );
};
