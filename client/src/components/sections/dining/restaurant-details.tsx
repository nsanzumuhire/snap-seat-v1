import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Heart,
    MapPin,
    Clock,
    Phone,
    Calendar,
    Star,
    Info,
    ChevronLeft,
    ChevronRight,
    Utensils,
    DollarSign,
    Users,
    Check,
    Wifi,
    Car,
    CreditCard,
    Key,
    AlarmClock,
    Sparkles,
    Award,
    Coffee
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface RestaurantDetailsProps {
    restaurant: {
        id: string;
        name: string;
        description: string;
        cuisine: string;
        priceRange: string;
        address: string;
        phone: string;
        openingHours: string;
        rating: number;
        totalReviews: number;
        images: string[];
        email?: string;
    };
}

export default function RestaurantDetails({ restaurant }: RestaurantDetailsProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    // Auto rotate images
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === restaurant.images.length - 1 ? 0 : prev + 1
            );
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(timer);
    }, [restaurant.images.length]);

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) =>
            prev === 0 ? restaurant.images.length - 1 : prev - 1
        );
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) =>
            prev === restaurant.images.length - 1 ? 0 : prev + 1
        );
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const priceRangeToSymbol = (range: string) => {
        switch (range) {
            case "low": return "$";
            case "medium": return "$$";
            case "high": return "$$$";
            case "very-high": return "$$$$";
            default: return "$$";
        }
    };

    // Quick restaurant highlights
    const restaurantHighlights = [
        { icon: <Users className="h-4 w-4" />, label: "Perfect for groups" },
        { icon: <AlarmClock className="h-4 w-4" />, label: "Quick service" },
        { icon: <Wifi className="h-4 w-4" />, label: "Free WiFi" },
        { icon: <Car className="h-4 w-4" />, label: "Parking available" },
    ];

    // Restaurant features
    const features = [
        { category: "Cuisine", items: [restaurant.cuisine, "Farm to Table", "Seasonal Menu"] },
        { category: "Atmosphere", items: ["Casual Dining", "Family Friendly", "Outdoor Seating"] },
        { category: "Services", items: ["Reservations", "Takeout", "Delivery", "Private Events"] },
        { category: "Special Diets", items: ["Vegetarian Options", "Vegan Options", "Gluten-Free Options"] }
    ];

    return (
        <div className="mb-8">
            {/* Hero section with image gallery */}
            <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        <img
                            src={restaurant.images[currentImageIndex]}
                            alt={`${restaurant.name} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Image navigation buttons */}
                <div className="absolute inset-0 flex items-center justify-between p-4 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-black/30 text-white hover:bg-black/50"
                        onClick={handlePrevImage}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-black/30 text-white hover:bg-black/50"
                        onClick={handleNextImage}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>

                {/* Image indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                    {restaurant.images.map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                currentImageIndex === index
                                    ? "bg-white w-6"
                                    : "bg-white/50 hover:bg-white/80"
                            )}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                    ))}
                </div>

                {/* Restaurant name and basic info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 flex gap-1 items-center">
                                    <Utensils className="h-3 w-3" />
                                    {restaurant.cuisine}
                                </Badge>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
                                    <span className="text-sm text-white/80">({restaurant.totalReviews})</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <DollarSign className="h-3.5 w-3.5" />
                                    <span className="text-sm font-medium">
                                        {priceRangeToSymbol(restaurant.priceRange)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "rounded-full border",
                                isLiked
                                    ? "bg-red-500/10 text-red-500 border-red-500/30"
                                    : "bg-black/30 border-white/20 text-white hover:bg-white/20"
                            )}
                            onClick={handleLike}
                        >
                            <Heart className={cn("h-5 w-5", isLiked && "fill-red-500")} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Restaurant highlights */}
            <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {restaurantHighlights.map((highlight, index) => (
                        <Card key={index} className="border-dashed">
                            <CardContent className="p-3 flex items-center gap-2">
                                <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                                    {highlight.icon}
                                </div>
                                <span className="text-sm font-medium">{highlight.label}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Restaurant information tabs */}
            <Card className="border-none shadow-none">
                <Tabs defaultValue="about" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="about" className="flex items-center gap-1.5">
                            <Info className="h-4 w-4" />
                            <span>About</span>
                        </TabsTrigger>
                        <TabsTrigger value="hours" className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>Hours & Location</span>
                        </TabsTrigger>
                        <TabsTrigger value="details" className="flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4" />
                            <span>Features</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="mt-0">
                        <CardContent className="p-0">
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {restaurant.description}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium mb-1">Address</h3>
                                        <p className="text-sm text-gray-600">{restaurant.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium mb-1">Phone</h3>
                                        <p className="text-sm text-gray-600">{restaurant.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium mb-1">Hours</h3>
                                        <p className="text-sm text-gray-600">{restaurant.openingHours}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Awards & Recognition */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Award className="h-5 w-5 text-amber-500" />
                                    Awards & Recognition
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border rounded-lg p-3 flex items-center gap-3">
                                        <div className="bg-amber-100 text-amber-800 p-2 rounded-full">
                                            <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm">Best New Restaurant 2022</h4>
                                            <p className="text-xs text-gray-500">Local Food Critics Association</p>
                                        </div>
                                    </div>
                                    <div className="border rounded-lg p-3 flex items-center gap-3">
                                        <div className="bg-green-100 text-green-800 p-2 rounded-full">
                                            <Coffee className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm">Sustainable Dining Award</h4>
                                            <p className="text-xs text-gray-500">Green Restaurant Association</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="hours" className="mt-0">
                        <CardContent className="p-0">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Opening Hours
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-medium">Monday</span>
                                        <span className="text-gray-600">11:00 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-medium">Tuesday</span>
                                        <span className="text-gray-600">11:00 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-medium">Wednesday</span>
                                        <span className="text-gray-600">11:00 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-medium">Thursday</span>
                                        <span className="text-gray-600">11:00 AM - 10:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-medium">Friday</span>
                                        <span className="text-gray-600">11:00 AM - 11:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-medium">Saturday</span>
                                        <span className="text-gray-600">10:00 AM - 11:00 PM</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="font-medium">Sunday</span>
                                        <span className="text-gray-600">10:00 AM - 9:00 PM</span>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
                                    <AlarmClock className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-yellow-800">
                                        <span className="font-medium">Happy Hour:</span> Monday-Friday, 4:00 PM - 6:00 PM
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Location
                                </h3>
                                <div className="rounded-lg overflow-hidden h-[200px] bg-gray-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-gray-600">Map view would appear here</p>
                                        <p className="text-sm text-gray-500 mt-1">{restaurant.address}</p>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 border rounded-md">
                                        <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                            <Car className="h-4 w-4" />
                                            Parking
                                        </h4>
                                        <p className="text-sm text-gray-600">Free street parking available. Public parking garage located 1 block away.</p>
                                    </div>
                                    <div className="p-3 border rounded-md">
                                        <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            Public Transit
                                        </h4>
                                        <p className="text-sm text-gray-600">Bus routes 10, 15, and 22 stop within a 2-minute walk.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </TabsContent>

                    <TabsContent value="details" className="mt-0">
                        <CardContent className="p-0">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                        <Utensils className="h-5 w-5 text-primary" />
                                        Cuisine
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge className="px-2.5 py-1">{restaurant.cuisine}</Badge>
                                        <Badge className="px-2.5 py-1">Farm to Table</Badge>
                                        <Badge className="px-2.5 py-1">Seasonal Menu</Badge>
                                        <Badge className="px-2.5 py-1">Organic</Badge>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-primary" />
                                        Price Range
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="px-3 py-1 font-medium">
                                            {priceRangeToSymbol(restaurant.priceRange)}
                                        </Badge>
                                        <span className="text-gray-600">
                                            {restaurant.priceRange === "low" && "Inexpensive"}
                                            {restaurant.priceRange === "medium" && "Moderate"}
                                            {restaurant.priceRange === "high" && "Expensive"}
                                            {restaurant.priceRange === "very-high" && "Very Expensive"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">Average entrée price: $18 - $32</p>
                                </div>

                                {/* Features organized in categories */}
                                <div>
                                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        Restaurant Features
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                        {features.map((category, idx) => (
                                            <div key={idx}>
                                                <h4 className="font-medium text-base mb-2">{category.category}</h4>
                                                <ul className="space-y-1.5">
                                                    {category.items.map((item, itemIdx) => (
                                                        <li key={itemIdx} className="flex items-center gap-2">
                                                            <Check className="h-4 w-4 text-green-600" />
                                                            <span className="text-sm text-gray-700">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-primary" />
                                        Payments Accepted
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="px-2.5 py-0.5 flex items-center gap-1">
                                            <CreditCard className="h-3 w-3" />
                                            Credit Cards
                                        </Badge>
                                        <Badge variant="outline" className="px-2.5 py-0.5">Apple Pay</Badge>
                                        <Badge variant="outline" className="px-2.5 py-0.5">Google Pay</Badge>
                                        <Badge variant="outline" className="px-2.5 py-0.5 flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            Cash
                                        </Badge>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                                        <Key className="h-5 w-5 text-primary" />
                                        Additional Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                            <span className="text-sm text-gray-700">Reservations recommended</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                            <span className="text-sm text-gray-700">Private dining available</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                            <span className="text-sm text-gray-700">Wheelchair accessible</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                            <span className="text-sm text-gray-700">Full bar available</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                            <span className="text-sm text-gray-700">Catering services</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                            <span className="text-sm text-gray-700">Outdoor seating (seasonal)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
} 