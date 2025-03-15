import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { MenuItem, Review } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuSection from "@/components/sections/dining/menu-section";
import ReviewsSection from "@/components/sections/dining/reviews-section";
import TableOrder from "@/components/sections/dining/table-order";
import { useToast } from "@/hooks/use-toast";
import { TableOrderProvider } from "@/lib/tableOrderContext";
import { Loader2, Utensils, Star, Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";

// Restaurant structure for reference
// id, name, description, cuisine, priceRange, address, phone, email, openingHours, rating, totalReviews, imageUrl

export default function DiningPage() {
  const params = useParams();
  const restaurantId = params.id;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("menu");

  // Fetch restaurant data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch restaurant details
        const restaurantResponse = await apiRequest("GET", `/api/restaurants/${restaurantId}`);
        if (!restaurantResponse.ok) throw new Error("Failed to load restaurant data");
        const restaurantData = await restaurantResponse.json();

        // Fetch menu items
        const menuResponse = await apiRequest("GET", `/api/restaurants/${restaurantId}/menu`);
        if (!menuResponse.ok) throw new Error("Failed to load menu items");
        const menuData = await menuResponse.json();

        // Fetch reviews
        const reviewsResponse = await apiRequest("GET", `/api/restaurants/${restaurantId}/reviews`);
        if (!reviewsResponse.ok) throw new Error("Failed to load reviews");
        const reviewsData = await reviewsResponse.json();

        setRestaurant(restaurantData);
        setMenuItems(menuData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load restaurant data. Please try again later.",
          variant: "destructive",
        });

        // Navigate back to restaurants list if data can't be loaded
        // window.location.href = "/restaurants";
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-2">Restaurant Not Found</h1>
        <p className="text-gray-600">Sorry, we couldn't find the restaurant you're looking for.</p>
      </div>
    );
  }

  return (
    <TableOrderProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="p-1 h-8 w-8 rounded-full">
                <Link href="/restaurants">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>

              {restaurant.imageUrl && (
                <div className="h-12 w-12 rounded-lg overflow-hidden border shadow-sm flex-shrink-0">
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div>
                <h1 className="text-xl font-bold leading-tight">{restaurant.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                    Open Now
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    {restaurant.cuisine} • {restaurant.address}
                  </span>
                </div>
              </div>
            </div>

            <Button asChild variant="default" size="sm" className="h-8 px-3">
              <Link href={`/restaurants/${restaurant.id}/book`}>Book a Table</Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Left Column - Restaurant Info */}
            <Card className="lg:col-span-3 p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-8 bg-gray-100 rounded-md">
                  <TabsTrigger value="menu" className={`flex items-center justify-center gap-1.5 ${activeTab === "menu" ? "!text-primary !bg-accent" : ""}`}>
                    <Utensils className="h-4 w-4" />
                    <span>Menu</span>
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className={`flex items-center justify-center gap-1.5 ${activeTab === "reviews" ? "!text-primary !bg-accent" : ""}`}>
                    <Star className="h-4 w-4" />
                    <span>Reviews</span>
                  </TabsTrigger>
                  <TabsTrigger value="details" className={`flex items-center justify-center gap-1.5 ${activeTab === "details" ? "!text-primary !bg-accent" : ""}`}>
                    <Info className="h-4 w-4" />
                    <span>Details</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="menu">
                  <MenuSection items={menuItems} restaurantName={restaurant.name} />
                </TabsContent>

                <TabsContent value="reviews">
                  <ReviewsSection reviews={reviews} restaurantId={restaurant.id} />
                </TabsContent>

                <TabsContent value="details">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-1.5">
                      <Info className="h-5 w-5 text-primary" />
                      About
                    </h3>
                    <p className="text-gray-600">
                      {restaurant.description}
                    </p>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-1.5">
                        <Utensils className="h-5 w-5 text-primary" />
                        Restaurant Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Address</h4>
                            <p className="text-sm text-gray-600">{restaurant.address}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">Phone</h4>
                            <p className="text-sm text-gray-600">{restaurant.phone}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">Hours</h4>
                            <p className="text-sm text-gray-600">{restaurant.openingHours}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Cuisine</h4>
                            <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">Price Range</h4>
                            <p className="text-sm text-gray-600">
                              {priceRangeToSymbol(restaurant.priceRange)}
                              {restaurant.priceRange === "low" && " - Inexpensive"}
                              {restaurant.priceRange === "medium" && " - Moderate"}
                              {restaurant.priceRange === "high" && " - Expensive"}
                              {restaurant.priceRange === "very-high" && " - Very Expensive"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          Parking available
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          Wheelchair accessible
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          Full bar
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          Private dining room available
                        </li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Right Column - Table Order */}
            <div className="hidden lg:block">
              <Card className="sticky top-6">
                <TableOrder embedded={true} />
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Floating Table Order Sheet - Only visible on small screens */}
        <div className="lg:hidden">
          <TableOrder />
        </div>
      </motion.div>
    </TableOrderProvider>
  );
}

function priceRangeToSymbol(range) {
  switch (range) {
    case "low": return "$";
    case "medium": return "$$";
    case "high": return "$$$";
    case "very-high": return "$$$$";
    default: return "$$";
  }
}