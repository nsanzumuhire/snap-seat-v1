import { useState } from "react";
import { MenuItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface MenuSectionProps {
  items: MenuItem[];
}

const categories = ["Starters", "Main Course", "Desserts", "Drinks"];

export default function MenuSection({ items }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("Starters");

  const filteredItems = items.filter(item => item.category === selectedCategory);

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
            <Card key={item.id} className="relative">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <p className="font-medium">${item.price.toString()}</p>
                  </div>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-4 right-4"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
