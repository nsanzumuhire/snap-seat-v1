import { Review } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

interface ReviewsSectionProps {
  reviews: Review[];
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-primary text-primary" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <RatingStars rating={averageRating} />
          <span className="text-lg font-semibold">
            {averageRating.toFixed(1)} ({reviews.length} reviews)
          </span>
        </div>
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{review.customerName}</h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </p>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
                {review.comment && (
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
