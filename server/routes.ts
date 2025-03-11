import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { 
  insertWaitlistSchema,
  insertMenuItemSchema,
  insertBookingSchema,
  insertReviewSchema
} from "@shared/schema";
import { ZodError } from "zod";

// Sample menu items for demonstration
const sampleMenuItems = [
  {
    name: "Classic Caesar Salad",
    description: "Crisp romaine lettuce, garlic croutons, parmesan cheese, and our house-made Caesar dressing",
    price: "14.99",
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9",
    available: 1
  },
  {
    name: "Pan-Seared Scallops",
    description: "Fresh sea scallops with citrus butter sauce and micro greens",
    price: "19.99",
    category: "Starters",
    imageUrl: "https://images.unsplash.com/photo-1599021456807-4962c743a24f",
    available: 1
  },
  {
    name: "Grilled Ribeye Steak",
    description: "12oz premium ribeye with roasted garlic butter and seasonal vegetables",
    price: "39.99",
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462",
    available: 1
  },
  {
    name: "Pan-Seared Salmon",
    description: "Fresh Atlantic salmon with lemon herb sauce and quinoa pilaf",
    price: "32.99",
    category: "Main Course",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    available: 1
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: "12.99",
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1617455559706-fa196228c05d",
    available: 1
  },
  {
    name: "Crème Brûlée",
    description: "Classic vanilla bean custard with caramelized sugar crust",
    price: "10.99",
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3",
    available: 1
  },
  {
    name: "Signature Martini",
    description: "Premium vodka or gin with your choice of olive or twist",
    price: "14.99",
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1575023782549-62ca0d244b39",
    available: 1
  },
  {
    name: "Craft Beer Selection",
    description: "Rotating selection of local and imported craft beers",
    price: "8.99",
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148",
    available: 1
  }
];

export async function registerRoutes(app: Express) {
  // Initialize sample menu items
  for (const item of sampleMenuItems) {
    try {
      await storage.createMenuItem(item);
    } catch (error) {
      console.error("Failed to create menu item:", error);
    }
  }

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

  // Menu routes
  app.get("/api/menu", async (req, res) => {
    try {
      const items = await storage.getMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu/:id", async (req, res) => {
    try {
      const item = await storage.getMenuItemById(parseInt(req.params.id));
      if (!item) {
        res.status(404).json({ message: "Menu item not found" });
        return;
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });

  app.post("/api/menu", async (req, res) => {
    try {
      const data = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(data);
      res.json(item);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Failed to create menu item" });
      }
    }
  });

  // Booking routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const data = insertBookingSchema.parse(req.body);
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

  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBookingById(parseInt(req.params.id));
      if (!booking) {
        res.status(404).json({ message: "Booking not found" });
        return;
      }
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Review routes
  app.post("/api/reviews", async (req, res) => {
    try {
      const data = insertReviewSchema.parse(req.body);
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

  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/booking/:bookingId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByBookingId(parseInt(req.params.bookingId));
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  return createServer(app);
}