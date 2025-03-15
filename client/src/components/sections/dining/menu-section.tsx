import { useState, useRef, useEffect, memo } from "react";
import { MenuItem } from "@shared/schema";
import { useTableOrder } from "@/lib/tableOrderContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Clock,
  AlertCircle,
  Star,
  LayoutGrid,
  List,
  SlidersHorizontalIcon,
  ChevronDown,
  Heart,
  StarHalf,
  SlidersHorizontal,
  Sparkles,
  Utensils,
  ImageIcon
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useInView } from "react-intersection-observer";

interface MenuSectionProps {
  items: MenuItem[];
  restaurantName?: string;
}

const categories = ["All", "Starters", "Main Course", "Desserts", "Drinks"];

// Memoized image component with lazy loading and blur placeholder
const LazyImage = memo(({ src, alt, className }: { src: string; alt: string; className: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  // Extract image ID for blur hash
  const imageId = src.split('/').pop()?.split('.')[0] || '';
  // Warm beige base color with subtle variation
  const r = 255;
  const g = 247 - (imageId.charCodeAt(0) % 8);
  const b = 240 - (imageId.charCodeAt(0) % 10);
  const placeholderColor = `rgb(${r} ${g} ${b})`;

  return (
    <div
      ref={ref}
      className={cn(className, "relative bg-gray-100 overflow-hidden")}
      style={{ backgroundColor: error ? 'rgba(0,0,0,0.05)' : placeholderColor }}
    >
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="h-1/4 w-1/4 text-gray-400" />
        </div>
      ) : inView && (
        <>
          <div className={cn(
            "absolute inset-0 backdrop-blur-sm transition-opacity duration-300",
            loaded ? "opacity-0" : "opacity-100"
          )} />
          <img
            src={src}
            alt={alt}
            className={cn(
              className,
              "transition-opacity duration-300 object-cover",
              loaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        </>
      )}
    </div>
  );
});

// Memoized card item component to prevent unnecessary re-renders
const MenuItemCard = memo(({
  item,
  handleAddToTable,
  reviewStars,
  isGrid
}: {
  item: MenuItem;
  handleAddToTable: (item: MenuItem) => void;
  reviewStars: (rating: number, totalReviews: number) => React.ReactNode;
  isGrid: boolean;
}) => {
  const [setDialogRef, dialogInView] = useInView({
    triggerOnce: true,
    rootMargin: '0px',
  });

  const [itemRef, itemInView] = useInView({
    triggerOnce: true,
    rootMargin: '100px',
  });

  // Only render full content when in view
  if (!itemInView) {
    return (
      <div ref={itemRef} className={isGrid ? "h-72" : "h-36"}>
        <Card className="w-full h-full animate-pulse">
          <div className="flex h-full">
            {isGrid ? (
              <Skeleton className="w-full h-40" />
            ) : (
              <Skeleton className="w-36 h-full" />
            )}
            <div className="p-3 flex-1 flex flex-col">
              <Skeleton className="w-3/4 h-4 mb-2" />
              <Skeleton className="w-full h-3 mb-1" />
              <Skeleton className="w-full h-3 mb-1" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Grid view item
  if (isGrid) {
    return (
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full text-left">
              {item.imageUrl && (
                <LazyImage
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40"
                />
              )}
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{item.name}</DialogTitle>
            </DialogHeader>
            <div ref={setDialogRef} className="grid gap-4 py-4">
              {dialogInView && (
                <>
                  {item.imageUrl && (
                    <LazyImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-56 rounded-md"
                    />
                  )}
                  {item.tags && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.split(',').map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={cn(
                            "px-2 py-0.5 rounded-sm",
                            tag === 'special' && "bg-amber-100 text-amber-800 border-amber-200",
                            tag === 'vegetarian' && "bg-green-100 text-green-800 border-green-200",
                            tag === 'vegan' && "bg-emerald-100 text-emerald-800 border-emerald-200",
                            tag === 'popular' && "bg-blue-100 text-blue-800 border-blue-200",
                            tag === 'healthy' && "bg-cyan-100 text-cyan-800 border-cyan-200"
                          )}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-700">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">${parseFloat(item.price.toString()).toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">Prep: {item.prepTime} min</span>
                    </div>
                  </div>
                  {item.totalReviews && item.totalReviews > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <StarHalf className="h-4 w-4" /> Reviews
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < parseInt((item.totalRating || '0').toString())
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm">
                          {parseFloat((item.totalRating || '0').toString()).toFixed(1)} ({item.totalReviews} reviews)
                        </span>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="text-sm bg-gray-50 p-2 rounded-md">
                          <div className="font-medium">John D.</div>
                          <p>Really enjoyed this dish! Would order again.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <Button onClick={() => handleAddToTable(item)}>
              <Plus className="h-4 w-4 mr-1" /> Add to Order
            </Button>
          </DialogContent>
        </Dialog>

        <CardContent className="p-3">
          <div className="flex flex-col h-full">
            <div className="space-y-1 mb-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                {reviewStars(parseFloat((item.totalRating || '0').toString()), item.totalReviews || 0)}
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Prep: {item.prepTime} min</span>
              </div>
              {item.tags && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.tags.split(',').map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={cn(
                        "text-[10px] px-1 py-0 rounded-sm",
                        tag === 'special' && "bg-amber-100 text-amber-800 border-amber-200",
                        tag === 'vegetarian' && "bg-green-100 text-green-800 border-green-200",
                        tag === 'vegan' && "bg-emerald-100 text-emerald-800 border-emerald-200",
                        tag === 'popular' && "bg-blue-100 text-blue-800 border-blue-200",
                        tag === 'healthy' && "bg-cyan-100 text-cyan-800 border-cyan-200"
                      )}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto pt-2 flex items-center justify-between">
              <div className="text-sm font-medium">
                ${parseFloat(item.price.toString()).toFixed(2)}
              </div>
              <Button
                size="sm"
                className="h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToTable(item);
                }}
              >
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view item
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {item.imageUrl && (
          <LazyImage
            src={item.imageUrl}
            alt={item.name}
            className="w-36 h-36 flex-shrink-0"
          />
        )}
        <CardContent className="p-4 flex-1">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center justify-between w-full">
                <h4 className="font-medium text-base">{item.name}</h4>
                {reviewStars(parseFloat((item.totalRating || '0').toString()), item.totalReviews || 0)}
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Prep: {item.prepTime} min</span>
              </div>
              {item.tags && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.split(',').map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={cn(
                        "text-xs px-1.5 py-0 rounded-sm",
                        tag === 'special' && "bg-amber-100 text-amber-800 border-amber-200",
                        tag === 'vegetarian' && "bg-green-100 text-green-800 border-green-200",
                        tag === 'vegan' && "bg-emerald-100 text-emerald-800 border-emerald-200",
                        tag === 'popular' && "bg-blue-100 text-blue-800 border-blue-200",
                        tag === 'healthy' && "bg-cyan-100 text-cyan-800 border-cyan-200"
                      )}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="text-sm font-medium">
                ${parseFloat(item.price.toString()).toFixed(2)}
              </div>
              <Button
                size="sm"
                className="h-8 px-3"
                onClick={() => handleAddToTable(item)}
              >
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
});

export default function MenuSection({ items, restaurantName }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState < "grid" | "list" > ("grid");
  const [showSpecials, setShowSpecials] = useState(false);
  const { dispatch } = useTableOrder();
  const { toast } = useToast();
  const [visibleItems, setVisibleItems] = useState < MenuItem[] > ([]);
  const scrollAreaRef = useRef < HTMLDivElement > (null);

  // Calculate filtered items
  const filteredItems = selectedCategory === "All"
    ? items
    : items.filter(item => item.category === selectedCategory);

  // Apply specials filter
  const displayedItems = showSpecials
    ? filteredItems.filter(item => {
      if (item.tags && (item.tags.includes('special') || item.tags.includes('popular'))) {
        return true;
      }
      if ((item.totalReviews || 0) > 50 && parseFloat((item.totalRating || '0').toString()) >= 4.5) {
        return true;
      }
      if ((item.prepTime || 15) < 15) {
        return true;
      }
      return false;
    })
    : filteredItems;

  // Virtual list management - load items in chunks
  useEffect(() => {
    // Reset visible items when filters change
    setVisibleItems(displayedItems.slice(0, 10));

    // Small delay to avoid freezing UI when switching filters
    const timer = setTimeout(() => {
      setVisibleItems(displayedItems);
    }, 50);

    return () => clearTimeout(timer);
  }, [displayedItems]);

  const handleAddToTable = (item: MenuItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    toast({
      title: "Added to Table",
      description: `${item.name} has been added to your table order.`
    });
  };

  const reviewStars = (rating: number | null | undefined, totalReviews: number | null | undefined) => {
    if (!totalReviews) return null;

    return (
      <div className="flex items-center gap-1 text-xs">
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        <span>{parseFloat((rating || 0).toString()).toFixed(1)}</span>
        <span className="text-gray-400">({totalReviews})</span>
      </div>
    );
  };

  // Category and filter header
  const menuHeader = (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {restaurantName ? `${restaurantName} Menu` : 'Our Menu'}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant={showSpecials ? "default" : "outline"}
            size="sm"
            className={cn("h-8 gap-1",
              showSpecials && "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
            )}
            onClick={() => setShowSpecials(!showSpecials)}
          >
            <Sparkles className={cn("h-4 w-4", showSpecials && "text-white")} />
            <span>Specials</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <SlidersHorizontalIcon className="h-4 w-4 mr-1" />
                <span className="mr-1">Filter</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className={
                selectedCategory === "All" ? "bg-accent text-accent-foreground" : ""
              } onClick={() => setSelectedCategory("All")}>
                All Items
              </DropdownMenuItem>
              <DropdownMenuItem className={
                selectedCategory === "Starters" ? "bg-accent text-accent-foreground" : ""
              } onClick={() => setSelectedCategory("Starters")}>
                Starters
              </DropdownMenuItem>
              <DropdownMenuItem className={
                selectedCategory === "Main Course" ? "bg-accent text-accent-foreground" : ""
              } onClick={() => setSelectedCategory("Main Course")}>
                Main Course
              </DropdownMenuItem>
              <DropdownMenuItem className={
                selectedCategory === "Desserts" ? "bg-accent text-accent-foreground" : ""
              } onClick={() => setSelectedCategory("Desserts")}>
                Desserts
              </DropdownMenuItem>
              <DropdownMenuItem className={
                selectedCategory === "Drinks" ? "bg-accent text-accent-foreground" : ""
              } onClick={() => setSelectedCategory("Drinks")}>
                Drinks
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="bg-gray-100 rounded-md p-0.5 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 rounded-sm",
                viewMode === "grid"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "hover:bg-white hover:shadow-sm"
              )}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 rounded-sm",
                viewMode === "list"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "hover:bg-white hover:shadow-sm"
              )}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            size="sm"
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {menuHeader}
      <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-220px)]">
        <div className={viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3"
        }>
          <AnimatePresence>
            {visibleItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <MenuItemCard
                  item={item}
                  handleAddToTable={handleAddToTable}
                  reviewStars={reviewStars}
                  isGrid={viewMode === "grid"}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {displayedItems.length > visibleItems.length && (
          <div className="py-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVisibleItems(displayedItems)}
            >
              Load more items ({displayedItems.length - visibleItems.length} remaining)
            </Button>
          </div>
        )}
        {displayedItems.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No menu items found. Try changing your filters.
          </div>
        )}
      </ScrollArea>
    </div>
  );
}