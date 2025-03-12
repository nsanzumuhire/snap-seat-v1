import { 
  Restaurant, InsertRestaurant,
  WaitlistSignup, InsertWaitlist,
  MenuItem, InsertMenuItem,
  TableBooking, InsertBooking,
  Review, InsertReview
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { restaurants, menuItems, waitlistSignups, tableBookings, reviews } from "@shared/schema";

export interface IStorage {
  // Restaurant methods
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  getRestaurants(): Promise<Restaurant[]>;
  getRestaurantById(id: number): Promise<Restaurant | undefined>;

  // Waitlist methods
  createWaitlistSignup(signup: InsertWaitlist): Promise<WaitlistSignup>;
  getWaitlistSignups(): Promise<WaitlistSignup[]>;

  // Menu methods
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  getMenuItems(restaurantId: number): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;

  // Booking methods
  createBooking(booking: InsertBooking): Promise<TableBooking>;
  getBookings(restaurantId: number): Promise<TableBooking[]>;
  getBookingById(id: number): Promise<TableBooking | undefined>;

  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getReviews(restaurantId: number): Promise<Review[]>;
  getMenuItemReviews(menuItemId: number): Promise<Review[]>;
  getBookingReviews(bookingId: number): Promise<Review[]>;
}

export class DatabaseStorage implements IStorage {
  // Restaurant methods
  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [newRestaurant] = await db.insert(restaurants).values(restaurant).returning();
    return newRestaurant;
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return await db.select().from(restaurants);
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
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

  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId));
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  // Booking methods
  async createBooking(booking: InsertBooking): Promise<TableBooking> {
    const [newBooking] = await db.insert(tableBookings).values(booking).returning();
    return newBooking;
  }

  async getBookings(restaurantId: number): Promise<TableBooking[]> {
    return await db.select().from(tableBookings).where(eq(tableBookings.restaurantId, restaurantId));
  }

  async getBookingById(id: number): Promise<TableBooking | undefined> {
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
          rating: avgRating.toFixed(1), 
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

  async getReviews(restaurantId: number): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.restaurantId, restaurantId))
      .where(eq(reviews.menuItemId, null));
  }

  async getMenuItemReviews(menuItemId: number): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.menuItemId, menuItemId));
  }

  async getBookingReviews(bookingId: number): Promise<Review[]> {
    return await db.select().from(reviews)
      .where(eq(reviews.bookingId, bookingId));
  }
}

export const storage = new DatabaseStorage();