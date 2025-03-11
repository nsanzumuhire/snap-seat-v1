import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const waitlistSignups = pgTable("waitlist_signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  restaurantName: text("restaurant_name").notNull(),
  size: integer("size").notNull(),
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

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type WaitlistSignup = typeof waitlistSignups.$inferSelect;
