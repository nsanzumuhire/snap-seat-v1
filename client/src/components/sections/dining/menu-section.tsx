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

export default function MenuSection({ items }: MenuSectionProps) {
  const { addToOrder } = useTableOrder();
  const { toast } = useToast();

  const handleAddToOrder = (item: MenuItem) => {
    addToOrder(item);
    toast({
      title: "Added to order",
      description: `${item.name} has been added to your order.`,
    });
  };

  return (
    <ScrollArea className="h-[65vh] px-1 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="relative h-32 w-full">
                  <img
                    src={item.image || "https://placehold.co/100x100/png"}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  {item.popular && (
                    <div className="absolute left-0 top-0 bg-yellow-500 px-1 py-0.5 text-[10px] font-medium text-white">
                      Popular
                    </div>
                  )}
                </div>
                <div className="flex flex-col p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <div className="ml-2 flex items-center space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center text-yellow-500">
                              <Star className="mr-0.5 h-3.5 w-3.5 fill-current" />
                              <span className="text-xs font-medium">
                                {item.rating}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">Rating: {item.rating}/5</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground min-h-[2rem]">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {item.prepTime && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-3 w-3" />
                                  <span>{item.prepTime} min</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p className="text-xs">
                                  Preparation time: {item.prepTime} minutes
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      {item.allergens && item.allergens.length > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex cursor-help items-center text-yellow-500">
                                <AlertCircle className="h-3 w-3" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">
                                Contains: {item.allergens.join(", ")}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 gap-1 rounded-full"
                      onClick={() => handleAddToOrder(item)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span className="text-xs">Add</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}