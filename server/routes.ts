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
    priceRange: "$$$",
    address: "123 Main St, Downtown",
    phone: "555-0123",
    email: "contact@urbanbistro.com",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    openingHours: "Mon-Sun: 11:00 AM - 10:00 PM"
  },
  {
    name: "Sakura Japanese",
    description: "Authentic Japanese cuisine featuring fresh sushi and traditional dishes",
    cuisine: "Japanese",
    priceRange: "$$",
    address: "456 Cherry Blossom Ave",
    phone: "555-0124",
    email: "info@sakurajapanese.com",
    imageUrl: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b",
    openingHours: "Tue-Sun: 12:00 PM - 9:30 PM"
  },
  {
    name: "Mediterranean Terrace",
    description: "Fresh Mediterranean flavors with a beautiful outdoor dining space",
    cuisine: "Mediterranean",
    priceRange: "$$",
    address: "789 Olive Grove",
    phone: "555-0125",
    email: "hello@medterrace.com",
    imageUrl: "https://images.unsplash.com/photo-1559339352-11d035aa65de",
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
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
    available: 1,
    prepTime: 10
  },
  {
    name: "Pan-Seared Scallops",
    description: "Fresh sea scallops with citrus butter sauce and micro greens",
    price: "19.99",
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1599021456807-4962c743a24f",
    available: 1,
    prepTime: 15
  },
  {
    name: "Grilled Ribeye Steak",
    description: "12oz premium ribeye with roasted garlic butter and seasonal vegetables",
    price: "39.99",
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462",
    available: 1,
    prepTime: 25
  },
  {
    name: "Pan-Seared Salmon",
    description: "Fresh Atlantic salmon with lemon herb sauce and quinoa pilaf",
    price: "32.99",
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    available: 1,
    prepTime: 20
  }
];

export async function registerRoutes(app: Express) {
  // Initialize sample restaurants and menu items
  for (const restaurant of sampleRestaurants) {
    try {
      const newRestaurant = await storage.createRestaurant(restaurant);

      // Add menu items to each restaurant
      for (const item of sampleMenuItems) {
        await storage.createMenuItem({
          ...item,
          restaurantId: newRestaurant.id,
          price: parseFloat(item.price)
        });
      }
    } catch (error) {
      console.error("Failed to create restaurant:", error);
    }
  }

  // Restaurant routes
  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const restaurant = await storage.getRestaurantById(parseInt(req.params.id));
      if (!restaurant) {
        res.status(404).json({ message: "Restaurant not found" });
        return;
      }
      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  // Menu routes
  app.get("/api/restaurants/:id/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems(parseInt(req.params.id));
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  // Booking routes
  app.post("/api/restaurants/:id/book", async (req, res) => {
    try {
      const restaurantId = parseInt(req.params.id);
      const data = insertBookingSchema.parse({ ...req.body, restaurantId });
      const booking = await storage.createBooking(data);
      res.json(booking);
    } catch (error) {
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
      const restaurantId = parseInt(req.params.id);
      const data = insertReviewSchema.parse({ ...req.body, restaurantId });
      const review = await storage.createReview(data);
      res.json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to create review" });
      }
    }
  });

  app.get("/api/restaurants/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews(parseInt(req.params.id));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Menu item reviews
  app.get("/api/menu/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getMenuItemReviews(parseInt(req.params.id));
      res.json(reviews);
    } catch (error) {
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

  return createServer(app);
}