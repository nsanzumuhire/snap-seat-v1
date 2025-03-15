import {
  Restaurant,
  WaitlistSignup,
  MenuItem,
  TableBooking,
  Review,
  insertRestaurantSchema,
  insertWaitlistSchema,
  insertMenuItemSchema,
  insertTableBookingSchema,
  insertReviewSchema,
  insertBookingSchema
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { restaurants, menuItems, waitlistSignups, tableBookings, reviews } from "@shared/schema";

// Define zod schema types for type safety
export type InsertRestaurant = typeof insertRestaurantSchema._type;
export type InsertWaitlist = typeof insertWaitlistSchema._type;
export type InsertMenuItem = typeof insertMenuItemSchema._type;
export type InsertBooking = typeof insertBookingSchema._type;
export type InsertReview = typeof insertReviewSchema._type;

export interface IStorage {
  // Restaurant methods
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurantById(id: string): Promise<Restaurant | undefined>;

  // Waitlist methods
  createWaitlistSignup(signup: InsertWaitlist): Promise<WaitlistSignup>;
  getWaitlistSignups(): Promise<WaitlistSignup[]>;

  // Menu methods
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  getMenuItems(restaurantId: string): Promise<MenuItem[]>;
  getMenuItemById(id: string): Promise<MenuItem | undefined>;

  // Booking methods
  createBooking(booking: InsertBooking): Promise<TableBooking>;
  getBookings(restaurantId: string): Promise<TableBooking[]>;
  getBookingById(id: string): Promise<TableBooking | undefined>;

  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getReviews(restaurantId: string): Promise<Review[]>;
  getMenuItemReviews(menuItemId: string): Promise<Review[]>;
  getBookingReviews(bookingId: string): Promise<Review[]>;
}

export class DatabaseStorage implements IStorage {
  // Restaurant methods
  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [newRestaurant] = await db.insert(restaurants).values(restaurant).returning();
    return newRestaurant;
  }

  async getRestaurants(): Promise<Restaurant[]> {
    console.log("Storage: fetching all restaurants");
    const results = await db.select().from(restaurants);
    console.log(`Storage: found ${results.length} restaurants`);
    return results;
  }

  async getRestaurantById(id: string): Promise<Restaurant | undefined> {
    console.log(`Storage: fetching restaurant with ID ${id}`);
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    if (restaurant) {
      console.log(`Storage: found restaurant ${restaurant.name}`);
    } else {
      console.log(`Storage: no restaurant found with ID ${id}`);
    }
    return restaurant;
  }

  // Waitlist methods
  async createWaitlistSignup(signup: InsertWaitlist): Promise<WaitlistSignup> {
    const [newSignup] = await db.insert(waitlistSignups).values(signup).returning();
    return newSignup;
  }

  async getWaitlistSignups(): Promise<WaitlistSignup[]> {
    return await db.select().from(waitlistSignups);
  }

  // Menu methods
  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db.insert(menuItems).values(item).returning();
    return newItem;
  }

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    console.log(`Storage: fetching menu items for restaurant ${restaurantId}`);
    const results = await db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId));
    console.log(`Storage: found ${results.length} menu items for restaurant ${restaurantId}`);
    return results;
  }

  async getMenuItemById(id: string): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  // Booking methods
  async createBooking(booking: InsertBooking): Promise<TableBooking> {
    const [newBooking] = await db.insert(tableBookings).values(booking).returning();
    return newBooking;
  }

  async getBookings(restaurantId: string): Promise<TableBooking[]> {
    return await db.select().from(tableBookings).where(eq(tableBookings.restaurantId, restaurantId));
  }

  async getBookingById(id: string): Promise<TableBooking | undefined> {
    const [booking] = await db.select().from(tableBookings).where(eq(tableBookings.id, id));
    return booking;
  }

  // Review methods
  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();

    // Update restaurant or menu item ratings
    if (review.restaurantId && !review.menuItemId) {
      const restaurantReviews = await this.getReviews(review.restaurantId);
      const avgRating = restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length;

      await db.update(restaurants)
        .set({
          totalReviews: restaurantReviews.length
        })
        .where(eq(restaurants.id, review.restaurantId));
    }

    if (review.menuItemId) {
      const menuItemReviews = await this.getMenuItemReviews(review.menuItemId);
      const avgRating = menuItemReviews.reduce((sum, r) => sum + r.rating, 0) / menuItemReviews.length;

      await db.update(menuItems)
        .set({
          totalRating: avgRating.toFixed(1),
          totalReviews: menuItemReviews.length
        })
        .where(eq(menuItems.id, review.menuItemId));
    }

    return newReview;
  }

  async getReviews(restaurantId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.restaurantId, restaurantId));
  }

  async getMenuItemReviews(menuItemId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.menuItemId, menuItemId));
  }

  async getBookingReviews(bookingId: string): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.bookingId, bookingId));
  }
}

export const storage = new DatabaseStorage();