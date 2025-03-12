import { useState } from "react";
import { MenuItem } from "@shared/schema";
import { useTableOrder } from "@/lib/tableOrderContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Clock, AlertCircle, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface MenuSectionProps {
  items: MenuItem[];
}

const categories = ["Starters", "Main Course", "Desserts", "Drinks"];

export default function MenuSection({ items }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const { dispatch } = useTableOrder();
  const { toast } = useToast();

  const filteredItems = items.filter(item => item.category === selectedCategory);

  const handleAddToTable = (item: MenuItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    toast({
      title: "Added to Table",
      description: `${item.name} has been added to your table order.`
    });
  };

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      {item.totalReviews > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {item.totalRating} ({item.totalReviews} reviews)
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{item.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {item.prepTime} mins prep time
                      </div>
                      {item.available === 1 ? (
                        <span className="text-green-600">In Stock</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">${Number(item.price).toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon">
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              Need help with this item? Call server
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <Button 
                          className="flex items-center gap-2"
                          disabled={item.available === 0}
                          onClick={() => handleAddToTable(item)}
                        >
                          <Plus className="h-4 w-4" />
                          Add to Table
                        </Button>
                      </div>
                    </div>
                  </div>

                  {item.imageUrl && (
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}