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

      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full">
                {item.imageUrl && (
                  <div className="w-full h-32 mb-3 overflow-hidden rounded-md">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.isPopular && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Popular
                        </span>
                      )}
                      {item.isVegetarian && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                          Veg
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">
                      ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {item.prepTime && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {item.prepTime} min
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Preparation Time</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="h-8"
                    onClick={() => handleAddToTable(item)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>

                {item.allergens && (
                  <div className="mt-2 flex items-start gap-1 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3 mt-0.5" />
                    <span>Contains {item.allergens}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}