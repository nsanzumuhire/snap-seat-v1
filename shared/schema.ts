import { pgTable, text, serial, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cuisine: text("cuisine").notNull(),
  priceRange: text("price_range").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  imageUrl: text("image_url"),
  openingHours: text("opening_hours").notNull(),
  rating: decimal("rating").notNull().default("0"),
  totalReviews: integer("total_reviews").notNull().default(0),
});

export const waitlistSignups = pgTable("waitlist_signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  restaurantName: text("restaurant_name").notNull(),
  size: integer("size").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  available: integer("available").notNull().default(1),
  prepTime: integer("prep_time").notNull(), // in minutes
  totalRating: decimal("total_rating").notNull().default("0"),
  totalReviews: integer("total_reviews").notNull().default(0),
});

export const tableBookings = pgTable("table_bookings", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  partySize: integer("party_size").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  specialRequests: text("special_requests"),
  status: text("status").notNull().default("pending"),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  menuItemId: integer("menu_item_id"),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  customerName: text("customer_name").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  bookingId: integer("booking_id"),
});

export const insertRestaurantSchema = createInsertSchema(restaurants).pick({
  name: true,
  description: true,
  cuisine: true,
  priceRange: true,
  address: true,
  phone: true,
  email: true,
  imageUrl: true,
  openingHours: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  priceRange: z.enum(["$", "$$", "$$$", "$$$$"]),
});

export const insertWaitlistSchema = createInsertSchema(waitlistSignups).pick({
  email: true,
  restaurantName: true,
  size: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  restaurantName: z.string().min(2, "Restaurant name must be at least 2 characters"),
  size: z.number().min(1, "Size must be at least 1").max(1000, "Size must be less than 1000")
});

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  restaurantId: true,
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
  available: true,
  prepTime: true,
}).extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  prepTime: z.number().min(1, "Preparation time must be at least 1 minute"),
});

export const insertBookingSchema = createInsertSchema(tableBookings).pick({
  restaurantId: true,
  date: true,
  time: true,
  partySize: true,
  customerName: true,
  customerEmail: true,
  customerPhone: true,
  specialRequests: true,
}).extend({
  customerEmail: z.string().email("Please enter a valid email address"),
  partySize: z.number().min(1, "Party size must be at least 1").max(20, "Party size cannot exceed 20"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  restaurantId: true,
  menuItemId: true,
  rating: true,
  comment: true,
  customerName: true,
  bookingId: true,
}).extend({
  rating: z.number().min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type WaitlistSignup = typeof waitlistSignups.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type TableBooking = typeof tableBookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;