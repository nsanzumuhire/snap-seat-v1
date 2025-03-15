import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { UtensilsCrossed, Star, MapPin, Clock, Phone, Mail } from "lucide-react";
import MenuSection from "@/components/sections/dining/menu-section";
import TableOrder from "@/components/sections/dining/table-order";
import { Separator } from "@/components/ui/separator";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  available: boolean;
  prepTime: number;
  totalRating: string;
  totalReviews: number;
  restaurantId: string;
}

interface RestaurantData {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  priceRange: string;
  address: string;
  phone: string;
  email: string;
  imageUrl: string;
  openingHours: string;
  rating: string;
  totalReviews: number;
}

export default function Menu() {
  // @ts-ignore - Workaround for the useParams typing issue
  const [, params] = useParams();
  const restaurantId = params?.id;

  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery < RestaurantData > ({
    queryKey: [`/api/restaurants/${restaurantId}`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/restaurants/${restaurantId}`);
      return response.json();
    },
    enabled: !!restaurantId
  });

  const { data: menuItems = [], isLoading: isLoadingMenu, error } = useQuery < MenuItem[] > ({
    queryKey: [`/api/restaurants/${restaurantId}/menu`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/restaurants/${restaurantId}/menu`);
      return response.json();
    },
    enabled: !!restaurantId
  });

  const isLoading = isLoadingRestaurant || isLoadingMenu;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading menu: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {restaurant && (
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden h-48 md:h-64 mb-6">
              {restaurant.imageUrl ? (
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <UtensilsCrossed className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating} ({restaurant.totalReviews} reviews)</span>
                  </div>
                  <span>•</span>
                  <span>{restaurant.cuisine}</span>
                  <span>•</span>
                  <span>{restaurant.priceRange}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Address</div>
                    <div className="text-sm text-gray-500">{restaurant.address}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Opening Hours</div>
                    <div className="text-sm text-gray-500">{restaurant.openingHours}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">Contact</div>
                    <div className="text-sm text-gray-500">{restaurant.phone}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-gray-600 mb-6">{restaurant.description}</p>
            <Separator className="mb-6" />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MenuSection items={menuItems} restaurantName={restaurant?.name} />
          </div>
          <div className="md:col-span-1">
            <TableOrder embedded={true} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
