import { pgTable, text, timestamp, integer, boolean, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { createId } from '@paralleldrive/cuid2';

export const restaurants = pgTable("restaurants", {
  id: text("id").primaryKey().notNull().$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cuisine: text("cuisine").notNull(),
  priceRange: text("price_range").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  imageUrl: text("image_url"),
  openingHours: text("opening_hours").notNull(),
});

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  menuItems: many(menuItems),
  reviews: many(reviews),
  tableBookings: many(tableBookings),
}));

export const waitlistSignups = pgTable("waitlist_signups", {
  id: text("id").primaryKey().notNull().$defaultFn(() => createId()),
  email: text("email").notNull(),
  restaurantName: text("restaurant_name").notNull(),
  size: integer("size").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: text("id").primaryKey().notNull().$defaultFn(() => createId()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  available: boolean("available").default(true),
  prepTime: integer("prep_time").default(15),
  totalRating: text("total_rating").default("0"),
  totalReviews: integer("total_reviews").default(0),
  restaurantId: text("restaurant_id").notNull().references(() => restaurants.id, { onDelete: "cascade" }),
  tags: text("tags"),
});

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  restaurant: one(restaurants, {
    fields: [menuItems.restaurantId],
    references: [restaurants.id],
  }),
  reviews: many(reviews),
}));

export const tableBookings = pgTable("table_bookings", {
  id: text("id").primaryKey().notNull().$defaultFn(() => createId()),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  partySize: integer("party_size").notNull(),
  status: text("status").default("pending"),
  restaurantId: text("restaurant_id").notNull().references(() => restaurants.id, { onDelete: "cascade" }),
  specialRequests: text("special_requests"),
});

export const tableBookingsRelations = relations(tableBookings, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [tableBookings.restaurantId],
    references: [restaurants.id],
  }),
}));

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey().notNull().$defaultFn(() => createId()),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  date: timestamp("date").defaultNow(),
  customerName: text("customer_name").notNull(),
  restaurantId: text("restaurant_id").notNull().references(() => restaurants.id, { onDelete: "cascade" }),
  menuItemId: text("menu_item_id").references(() => menuItems.id, { onDelete: "cascade" }),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [reviews.restaurantId],
    references: [restaurants.id],
  }),
  menuItem: one(menuItems, {
    fields: [reviews.menuItemId],
    references: [menuItems.id],
  }),
}));

// Zod Schemas for validation
export const insertRestaurantSchema = createInsertSchema(restaurants, {
  name: z.string().min(1).max(100),
  description: z.string().min(10),
  cuisine: z.string().min(1),
  priceRange: z.string().min(1),
  address: z.string().min(5),
  phone: z.string().min(5),
  email: z.string().email(),
  imageUrl: z.string().url().nullable().optional(),
  openingHours: z.string().min(1),
});

export const insertWaitlistSchema = createInsertSchema(waitlistSignups, {
  email: z.string().email("Please enter a valid email address"),
  restaurantName: z.string().min(2, "Restaurant name must be at least 2 characters"),
  size: z.number().int().min(1, "Size must be at least 1").max(100, "Size must be less than 100")
});

export const insertMenuItemSchema = createInsertSchema(menuItems, {
  name: z.string().min(1).max(100),
  description: z.string().min(5),
  price: z.string(),
  category: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
  available: z.boolean().default(true),
  prepTime: z.number().int().min(0).default(15),
  totalRating: z.string().default("0"),
  totalReviews: z.number().int().default(0),
  restaurantId: z.string(),
  tags: z.string().optional(),
});

export const insertTableBookingSchema = createInsertSchema(tableBookings, {
  customerName: z.string().min(1).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(5),
  date: z.date(),
  time: z.string().min(1),
  partySize: z.number().int().min(1),
  status: z.string().default("pending"),
  restaurantId: z.string(),
  specialRequests: z.string().optional(),
});

// Add alias for backward compatibility
export const insertBookingSchema = insertTableBookingSchema;

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  date: z.date().default(new Date()),
  customerName: z.string().min(1),
  restaurantId: z.string(),
  menuItemId: z.string().optional(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type TableBooking = typeof tableBookings.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type WaitlistSignup = typeof waitlistSignups.$inferSelect;