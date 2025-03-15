import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import {
  insertWaitlistSchema,
  insertMenuItemSchema,
  insertBookingSchema,
  insertReviewSchema,
  insertRestaurantSchema
} from "@shared/schema";
import { ZodError } from "zod";

// Sample restaurants for demonstration
const sampleRestaurants = [
  {
    name: "The Urban Bistro",
    description: "Modern European cuisine in a sophisticated setting with an extensive wine list",
    cuisine: "European",
    priceRange: "high",
    address: "123 Main St, Downtown",
    phone: "555-0123",
    email: "contact@urbanbistro.com",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    openingHours: "Mon-Sun: 11:00 AM - 10:00 PM"
  },
  {
    name: "Sakura Japanese",
    description: "Authentic Japanese cuisine featuring fresh sushi and traditional dishes",
    cuisine: "Japanese",
    priceRange: "medium",
    address: "456 Cherry Blossom Ave",
    phone: "555-0124",
    email: "info@sakurajapanese.com",
    imageUrl: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=500",
    openingHours: "Tue-Sun: 12:00 PM - 9:30 PM"
  },
  {
    name: "Mediterranean Terrace",
    description: "Fresh Mediterranean flavors with a beautiful outdoor dining space",
    cuisine: "Mediterranean",
    priceRange: "medium",
    address: "789 Olive Grove",
    phone: "555-0125",
    email: "hello@medterrace.com",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500",
    openingHours: "Mon-Sun: 11:30 AM - 11:00 PM"
  }
];

// Sample menu items for demonstration
const sampleMenuItems = [
  {
    name: "Classic Caesar Salad",
    description: "Crisp romaine lettuce, garlic croutons, parmesan cheese, and our house-made Caesar dressing",
    price: "14.99",
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500",
    available: true,
    prepTime: 10,
    tags: "popular,vegetarian"
  },
  {
    name: "Pan-Seared Scallops",
    description: "Fresh sea scallops with citrus butter sauce and micro greens",
    price: "19.99",
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1599021456807-4962c743a24f?w=500",
    available: true,
    prepTime: 15,
    tags: "special"
  },
  {
    name: "Grilled Ribeye Steak",
    description: "12oz premium ribeye with roasted garlic butter and seasonal vegetables",
    price: "39.99",
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?w=500",
    available: true,
    prepTime: 25,
    tags: "popular,special"
  },
  {
    name: "Pan-Seared Salmon",
    description: "Fresh Atlantic salmon with lemon herb sauce and quinoa pilaf",
    price: "32.99",
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500",
    available: true,
    prepTime: 20,
    tags: "healthy"
  },
  {
    name: "Spaghetti Carbonara",
    description: "Spaghetti with pancetta, eggs, pecorino romano cheese, and black pepper",
    price: "18.99",
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?w=500",
    available: true,
    prepTime: 20,
    tags: "popular"
  },
  {
    name: "Chicken Alfredo",
    description: "Fettuccine pasta in a creamy alfredo sauce with grilled chicken",
    price: "21.99",
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500",
    available: true,
    prepTime: 25
  },
  {
    name: "Margherita Pizza",
    description: "Classic Neapolitan pizza with tomato sauce, mozzarella, and basil",
    price: "15.99",
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500",
    available: true,
    prepTime: 15,
    tags: "vegetarian"
  },
  {
    name: "Pepperoni Pizza",
    description: "Pizza with tomato sauce, mozzarella, and pepperoni",
    price: "17.99",
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500",
    available: true,
    prepTime: 15,
    tags: "popular"
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cream",
    price: "7.99",
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500",
    available: true,
    prepTime: 0,
    tags: "special"
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten chocolate center",
    price: "9.99",
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1617305855058-336d26f9d352?w=500",
    available: true,
    prepTime: 15,
    tags: "popular"
  },
  {
    name: "Coca-Cola",
    description: "Classic Coca-Cola",
    price: "3.99",
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1554866585-a4634934dcd4?w=500",
    available: true,
    prepTime: 0
  },
  {
    name: "Iced Tea",
    description: "Refreshing iced tea",
    price: "2.99",
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1556679343-c1c3263e65af?w=500",
    available: true,
    prepTime: 0,
    tags: "non-alcoholic"
  }
];

// Function to create sample data
async function createSampleData() {
  for (const restaurant of sampleRestaurants) {
    try {
      console.log("Creating restaurant:", restaurant.name);
      const newRestaurant = await storage.createRestaurant(restaurant);
      console.log("Created restaurant:", newRestaurant.id, newRestaurant.name);

      // Add menu items to each restaurant
      for (const item of sampleMenuItems) {
        try {
          const menuItem = await storage.createMenuItem({
            ...item,
            restaurantId: newRestaurant.id,
            totalRating: "0",
            totalReviews: 0
          });
          console.log("Created menu item:", menuItem.name, "for restaurant:", newRestaurant.id);
        } catch (error) {
          console.error("Failed to create menu item:", error);
        }
      }
    } catch (error) {
      console.error("Failed to create restaurant:", error);
    }
  }
  console.log("Sample data creation completed");
}

// Fix the registerRoutes function to prevent multiple attempts
let isInitialized = false;

export async function registerRoutes(app: Express) {
  // Only register routes once
  if (isInitialized) {
    console.log("Routes already registered, skipping...");
    return createServer(app);
  }

  isInitialized = true;
  console.log("Registering routes...");

  try {
    // Initialize sample restaurants and menu items
    const existingRestaurants = await storage.getRestaurants();
    console.log("Existing restaurants:", existingRestaurants.length);

    // Only create sample data if no restaurants exist
    if (existingRestaurants.length === 0) {
      console.log("Creating sample data...");
      await createSampleData();
    }

    // Restaurant routes
    app.get("/api/restaurants", async (req, res) => {
      try {
        const restaurants = await storage.getRestaurants();
        console.log("GET /api/restaurants returning", restaurants.length, "restaurants");
        res.json(restaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Failed to fetch restaurants" });
      }
    });

    app.get("/api/restaurants/:id", async (req, res) => {
      try {
        const restaurant = await storage.getRestaurantById(req.params.id);
        if (!restaurant) {
          console.log("Restaurant not found:", req.params.id);
          res.status(404).json({ message: "Restaurant not found" });
          return;
        }
        res.json(restaurant);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        res.status(500).json({ message: "Failed to fetch restaurant" });
      }
    });

    // Menu routes
    app.get("/api/restaurants/:id/menu", async (req, res) => {
      try {
        const items = await storage.getMenuItems(req.params.id);
        console.log(`GET /api/restaurants/${req.params.id}/menu returning`, items.length, "items");
        res.json(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        res.status(500).json({ message: "Failed to fetch menu items" });
      }
    });

    // Booking routes
    app.post("/api/restaurants/:id/book", async (req, res) => {
      try {
        const restaurantId = req.params.id;
        const data = insertBookingSchema.parse({ ...req.body, restaurantId });
        const booking = await storage.createBooking(data);
        res.json(booking);
      } catch (error) {
        console.error("Error creating booking:", error);
        if (error instanceof ZodError) {
          res.status(400).json({ message: error.errors[0].message });
        } else {
          res.status(500).json({ message: "Failed to create booking" });
        }
      }
    });

    // Review routes
    app.post("/api/restaurants/:id/reviews", async (req, res) => {
      try {
        const restaurantId = req.params.id;
        const data = insertReviewSchema.parse({ ...req.body, restaurantId });
        const review = await storage.createReview(data);
        res.json(review);
      } catch (error) {
        console.error("Error creating review:", error);
        if (error instanceof ZodError) {
          res.status(400).json({ message: error.errors[0].message });
        } else {
          res.status(500).json({ message: "Failed to create review" });
        }
      }
    });

    app.get("/api/restaurants/:id/reviews", async (req, res) => {
      try {
        const reviews = await storage.getReviews(req.params.id);
        res.json(reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Failed to fetch reviews" });
      }
    });

    // Menu item reviews
    app.get("/api/menu/:id/reviews", async (req, res) => {
      try {
        const reviews = await storage.getMenuItemReviews(req.params.id);
        res.json(reviews);
      } catch (error) {
        console.error("Error fetching menu item reviews:", error);
        res.status(500).json({ message: "Failed to fetch menu item reviews" });
      }
    });

    // Waitlist routes
    app.post("/api/waitlist", async (req, res) => {
      try {
        const data = insertWaitlistSchema.parse(req.body);
        const signup = await storage.createWaitlistSignup(data);
        res.json(signup);
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({ message: error.errors[0].message });
        } else {
          res.status(500).json({ message: "Failed to sign up for waitlist" });
        }
      }
    });
  } catch (error) {
    console.error("Error during route registration:", error);
  }

  return createServer(app);
}