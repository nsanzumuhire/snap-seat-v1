import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import MenuSection from "@/components/sections/dining/menu-section";
import ReviewsSection from "@/components/sections/dining/reviews-section";
import TableOrder from "@/components/sections/dining/table-order";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dining() {
  const [activeTab, setActiveTab] = useState("menu");

  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ["/api/restaurants/1/menu"],
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/restaurants/1/reviews"],
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">SnapSeat Restaurant</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                Open Now
              </span>
              <span className="text-sm text-gray-600">$$$ • Modern American</span>
            </div>
          </div>
          <Button asChild variant="default" size="lg">
            <Link href="/restaurants/1/book">Book a Table</Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Restaurant Info */}
          <Card className="lg:col-span-3 p-6">
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
          
          {/* Right Column - Table Order */}
          <div className="hidden lg:block">
            <Card className="p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-4">Your Table Order</h3>
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
  );
}