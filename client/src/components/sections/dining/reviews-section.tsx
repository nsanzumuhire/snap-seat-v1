import { useState, useEffect } from "react";
import { Review } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  StarHalf,
  ThumbsUp,
  MessageCircle,
  Filter,
  ChevronDown,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Update the interface to match the Review schema from the database
interface ExtendedReview extends Omit<Review, 'id'> {
  id: string | number;
  helpfulVotes?: number;
  avatarUrl?: string;
}

interface ReviewsSectionProps {
  reviews: ExtendedReview[];
  restaurantId?: string | number;
}

// Sample review comments
const samplePositiveComments = [
  "Amazing experience! The food was delicious and the service was impeccable.",
  "Fantastic place! I'll definitely be coming back. The staff was very friendly.",
  "Great atmosphere and even better food. Highly recommend the chef's special.",
  "One of the best dining experiences I've had. Everything was perfect!",
  "Absolutely loved the food and ambiance. A hidden gem in the city.",
  "Excellent food and service. The prices are reasonable for the quality.",
  "The best meal I've had in a long time. Worth every penny!",
  "Incredible flavors and presentation. The chef is truly talented.",
  "A wonderful place for a special occasion. We had a memorable evening.",
  "The food exceeded my expectations. Will definitely return soon!"
];

const sampleNeutralComments = [
  "Good food but the service was a bit slow. Would give it another try.",
  "Nice place, reasonable prices. Nothing extraordinary but solid food.",
  "Decent experience overall. The appetizers were better than the main course.",
  "The food was good but not amazing. Service was friendly though.",
  "Average experience. Some dishes were great, others were just okay.",
  "Food was tasty but the portions were small for the price.",
  "Good atmosphere but the menu is limited. Would like to see more options.",
  "Solid place for a casual meal. Don't expect anything fancy.",
  "Service was excellent but the food was just okay. Mixed feelings.",
  "Not bad, but not outstanding either. Might come back to try other dishes."
];

const sampleCriticalComments = [
  "Disappointed with the quality of food for the price we paid.",
  "Service was extremely slow and the food was barely warm when served.",
  "Overpriced for what you get. There are better options nearby.",
  "The place was too noisy and crowded. Hard to enjoy the meal.",
  "Food was mediocre at best. Expected much more from the reviews.",
  "Not worth the hype. The flavors were bland and uninspiring.",
  "Poor service ruined what could have been a good experience.",
  "Too expensive for such small portions. Left feeling hungry.",
  "The place needs better ventilation. Could smell the kitchen the whole time.",
  "Food was inconsistent - some dishes good, others terrible."
];

// Common names for fake reviews
const firstNames = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Susan", "Richard", "Jessica", "Joseph", "Sarah",
  "Thomas", "Karen", "Charles", "Nancy", "Daniel", "Lisa", "Matthew", "Emma", "Anthony",
  "Olivia", "Mark", "Sophia", "Alex", "Isabella", "Ryan", "Mia", "Eric", "Emily",
  "Stephen", "Ella"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
  "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
  "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee",
  "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill",
  "Scott", "Green", "Adams"
];

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getTimeSince(date: Date) {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

  let interval = seconds / 31536000; // seconds in a year
  if (interval > 1) return Math.floor(interval) + " years ago";

  interval = seconds / 2592000; // seconds in a month
  if (interval > 1) return Math.floor(interval) + " months ago";

  interval = seconds / 86400; // seconds in a day
  if (interval > 1) return Math.floor(interval) + " days ago";

  interval = seconds / 3600; // seconds in an hour
  if (interval > 1) return Math.floor(interval) + " hours ago";

  interval = seconds / 60; // seconds in a minute
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return Math.floor(seconds) + " seconds ago";
}

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
}

function generateRandomReview(daysAgo = 30): ExtendedReview {
  const rating = Math.floor(Math.random() * 5) + 1;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const initial = lastName[0];

  let comment;
  if (rating >= 4) {
    comment = samplePositiveComments[Math.floor(Math.random() * samplePositiveComments.length)];
  } else if (rating >= 3) {
    comment = sampleNeutralComments[Math.floor(Math.random() * sampleNeutralComments.length)];
  } else {
    comment = sampleCriticalComments[Math.floor(Math.random() * sampleCriticalComments.length)];
  }

  // Generate a random date within the last X days
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));

  return {
    id: Math.random().toString(36).substring(2, 15),
    customerName: `${firstName} ${initial}.`,
    rating,
    comment,
    date,
    helpfulVotes: Math.floor(Math.random() * 20),
    restaurantId: 1, // Placeholder as a number
    menuItemId: null,
    bookingId: null,
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}`
  };
}

export default function ReviewsSection({ reviews: initialReviews, restaurantId }: ReviewsSectionProps) {
  const [filter, setFilter] = useState("all");
  const [reviewsShown, setReviewsShown] = useState(5);
  const [likedReviews, setLikedReviews] = useState < Record < string, boolean>> ({});
  const [reviews, setReviews] = useState < ExtendedReview[] > ([]);

  // Generate random reviews if none are provided
  useEffect(() => {
    if (initialReviews && initialReviews.length > 0) {
      setReviews(initialReviews);
    } else {
      // Generate 20 random reviews
      const randomReviews = Array.from({ length: 20 }, () => generateRandomReview());
      setReviews(randomReviews);
    }
  }, [initialReviews]);

  const handleLike = (reviewId: string | number) => {
    setLikedReviews(prev => ({
      ...prev,
      [String(reviewId)]: !prev[String(reviewId)]
    }));
  };

  const handleShowMore = () => {
    setReviewsShown(prev => Math.min(prev + 5, reviews.length));
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === "all") return true;
    if (filter === "positive") return review.rating >= 4;
    if (filter === "neutral") return review.rating === 3;
    if (filter === "critical") return review.rating <= 2;
    return true;
  });

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  // Calculate rating breakdown
  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="mb-8">
      <div className="mb-8 bg-white rounded-xl p-6 border shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">Guest Reviews</h2>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center bg-primary text-primary-foreground rounded-full w-14 h-14">
                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
              </div>
              <div>
                <RatingStars rating={averageRating} />
                <p className="text-sm text-gray-500 mt-1">Based on {reviews.length} reviews</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm w-3">{rating}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        rating >= 4 ? "bg-green-500" :
                          rating === 3 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{
                        width: `${(ratingCounts[rating] || 0) / reviews.length * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">
                    {Math.round((ratingCounts[rating] || 0) / reviews.length * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:border-l md:pl-6 flex-1">
            <h3 className="text-lg font-semibold mb-3">Review Highlights</h3>
            <div className="grid gap-3">
              {reviews.filter(r => r.rating >= 4).slice(0, 2).map(review => (
                <Card key={review.id} className="bg-gray-50 border-none">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Star className="w-4 h-4 mt-1 fill-yellow-400 text-yellow-400" />
                      <div>
                        <p className="text-sm italic text-gray-600">"{review.comment}"</p>
                        <p className="text-xs text-gray-500 mt-1">{review.customerName}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger
              value="all"
              onClick={() => setFilter("all")}
              className="text-xs sm:text-sm"
            >
              All Reviews ({reviews.length})
            </TabsTrigger>
            <TabsTrigger
              value="positive"
              onClick={() => setFilter("positive")}
              className="text-xs sm:text-sm"
            >
              Positive ({reviews.filter(r => r.rating >= 4).length})
            </TabsTrigger>
            <TabsTrigger
              value="neutral"
              onClick={() => setFilter("neutral")}
              className="text-xs sm:text-sm"
            >
              Neutral ({reviews.filter(r => r.rating === 3).length})
            </TabsTrigger>
            <TabsTrigger
              value="critical"
              onClick={() => setFilter("critical")}
              className="text-xs sm:text-sm"
            >
              Critical ({reviews.filter(r => r.rating <= 2).length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="w-3 h-3 mr-1" />
              <span>Sort by: </span>
              <span className="font-medium ml-1">Recent</span>
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          <div className="space-y-4">
            {filteredReviews.slice(0, reviewsShown).map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={review.avatarUrl} alt={review.customerName} />
                          <AvatarFallback>{review.customerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                            <h3 className="font-semibold">{review.customerName}</h3>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>{getTimeSince(review.date)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <RatingStars rating={review.rating} />
                          </div>

                          <p className="text-gray-700 mb-4">{review.comment}</p>

                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "h-8 gap-1 text-xs",
                                likedReviews[String(review.id)] && "text-primary"
                              )}
                              onClick={() => handleLike(review.id)}
                            >
                              <ThumbsUp className={cn(
                                "h-3 w-3",
                                likedReviews[String(review.id)] && "fill-primary"
                              )} />
                              <span>Helpful ({(review.helpfulVotes || 0) + (likedReviews[String(review.id)] ? 1 : 0)})</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                              <MessageCircle className="h-3 w-3" />
                              <span>Reply</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filteredReviews.length > reviewsShown && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={handleShowMore}
              className="gap-1"
            >
              Show More Reviews
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}

        {filteredReviews.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No reviews found with the current filter.</p>
          </div>
        )}
      </Tabs>
    </div>
  );
}
