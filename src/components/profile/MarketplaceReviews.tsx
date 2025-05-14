
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export interface Review {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  buyerImage?: string;
  sellerId: string;
  rating: number;
  content: string;
  date: string;
  isVerifiedPurchase: boolean;
}

interface MarketplaceReviewsProps {
  userId: string;
}

export function MarketplaceReviews({ userId }: MarketplaceReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"received" | "given">("received");

  // Fetch user reviews
  useEffect(() => {
    setLoading(true);
    
    // Simulated reviews data for demo
    const mockReviews: Review[] = [
      {
        id: "1",
        productId: "prod1",
        productName: "Squishmallow Dragon",
        buyerId: "buyer1",
        buyerName: "PlushieLover22",
        buyerImage: "https://api.dicebear.com/6.x/initials/svg?seed=PL22",
        sellerId: userId,
        rating: 5,
        content: "Great seller, fast shipping and item was exactly as described!",
        date: "2025-05-01",
        isVerifiedPurchase: true
      },
      {
        id: "2",
        productId: "prod2",
        productName: "Jellycat Bunny",
        buyerId: "buyer2",
        buyerName: "BunnyCollector",
        buyerImage: "https://api.dicebear.com/6.x/initials/svg?seed=BC",
        sellerId: userId,
        rating: 4,
        content: "Love the plushie! Shipping took a bit longer than expected but seller was communicative.",
        date: "2025-04-23",
        isVerifiedPurchase: true
      }
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setReviews(mockReviews);
      setLoading(false);
    }, 800);
  }, [userId]);

  const receivedReviews = reviews.filter(review => review.sellerId === userId);
  const givenReviews = reviews.filter(review => review.buyerId === userId);
  
  const averageRating = receivedReviews.length > 0 
    ? receivedReviews.reduce((sum, review) => sum + review.rating, 0) / receivedReviews.length
    : 0;
    
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const renderReviewList = (reviewList: Review[]) => {
    if (reviewList.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet.</p>
        </div>
      );
    }

    return reviewList.map((review) => (
      <div key={review.id} className="border-b border-gray-100 py-4 last:border-0">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={review.buyerImage} />
            <AvatarFallback>
              {review.buyerName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-medium">{review.buyerName}</p>
              <p className="text-xs text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center mt-1">
              {renderStars(review.rating)}
              {review.isVerifiedPurchase && (
                <span className="text-xs ml-2 text-green-600">Verified Purchase</span>
              )}
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-700">{review.content}</p>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Product: {review.productName}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marketplace Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Marketplace Reviews</CardTitle>
          {receivedReviews.length > 0 && (
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
              <span className="text-lg font-bold mr-1">{averageRating.toFixed(1)}</span>
              {renderStars(Math.round(averageRating))}
              <span className="text-sm text-gray-600 ml-1">({receivedReviews.length})</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="received">Received ({receivedReviews.length})</TabsTrigger>
            <TabsTrigger value="given">Given ({givenReviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="received" className="mt-4">
            {renderReviewList(receivedReviews)}
          </TabsContent>
          <TabsContent value="given" className="mt-4">
            {renderReviewList(givenReviews)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default MarketplaceReviews;
