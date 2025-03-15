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
  MapPin,
  Utensils,
  CalendarDays
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
      try {
        const response = await apiRequest("GET", "/api/restaurants");
        const data = await response.json();
        return data;
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        throw err;
      }
    }
  });

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          Loading restaurants...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading restaurants: {error.message}
      </div>
    );
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
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold truncate flex-1 pr-2">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 text-xs whitespace-nowrap">
                    <Star className="h-3 w-3 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                    <span>{Number(restaurant.rating || 0).toFixed(1)}</span>
                    <span className="text-gray-400">({restaurant.totalReviews || 0})</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
                  {restaurant.description}
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate flex-1">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate flex-1">{restaurant.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span>{restaurant.priceRange}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-0 flex gap-2">
                <Button asChild size="sm" className="h-8">
                  <Link href={`/restaurants/${restaurant.id}/menu`}>
                    <Utensils className="h-4 w-4 mr-1" />
                    Menu
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="h-8">
                  <Link href={`/restaurants/${restaurant.id}/book`}>
                    <CalendarDays className="h-4 w-4 mr-1" />
                    Make Reservation
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}

          {filteredRestaurants.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No restaurants found matching your search.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
