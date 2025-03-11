import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MenuSection from "@/components/sections/dining/menu-section";
import BookingSection from "@/components/sections/dining/booking-section";
import ReviewsSection from "@/components/sections/dining/reviews-section";
import { Separator } from "@/components/ui/separator";

export default function Dining() {
  const [activeTab, setActiveTab] = useState("menu");

  const { data: menuItems = [] } = useQuery({
    queryKey: ["/api/menu"],
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["/api/reviews"],
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Restaurant Info */}
          <Card className="lg:col-span-2 p-6">
            <h1 className="text-3xl font-bold mb-4">SnapSeat Restaurant</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                Open Now
              </span>
              <span className="text-sm text-gray-600">$$$ • Modern American</span>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="menu">Menu</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="menu">
                <MenuSection items={menuItems} />
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewsSection reviews={reviews} />
              </TabsContent>

              <TabsContent value="details">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">About</h3>
                  <p className="text-gray-600">
                    Experience modern dining with our innovative menu and elegant atmosphere.
                    Perfect for special occasions or casual dining.
                  </p>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Parking available</li>
                      <li>• Wheelchair accessible</li>
                      <li>• Full bar</li>
                      <li>• Private dining room available</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <BookingSection />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
