import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Star,
  Clock,
  DollarSign,
  MapPin
} from "lucide-react";

interface RestaurantCard {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  priceRange: string;
  address: string;
  imageUrl: string;
  rating: string;
  totalReviews: number;
  openingHours: string;
}

const API_URL = 'http://localhost:5000';

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: restaurants = [], isLoading, error } = useQuery < RestaurantCard[] > ({
    queryKey: ["/api/restaurants"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/restaurants");
      return response.json();
    }
  });

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading restaurants: {error.message}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Dining Spot
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            Discover amazing restaurants and bars using SnapSeat
          </p>
          <div className="w-full max-w-xl relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by restaurant name or cuisine..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {restaurant.rating} ({restaurant.totalReviews})
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                  <span className="text-primary font-medium">
                    {restaurant.priceRange}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {restaurant.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {restaurant.address}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {restaurant.openingHours}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-0 flex gap-4">
                <Button asChild className="flex-1">
                  <Link href={`/restaurants/${restaurant.id}/menu`}>
                    View Menu
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/restaurants/${restaurant.id}/book`}>
                    Book Table
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
