import { 
  Restaurant, InsertRestaurant,
  WaitlistSignup, InsertWaitlist,
  MenuItem, InsertMenuItem,
  TableBooking, InsertBooking,
  Review, InsertReview
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private restaurants: Map<number, Restaurant>;
  private waitlist: Map<number, WaitlistSignup>;
  private menu: Map<number, MenuItem>;
  private bookings: Map<number, TableBooking>;
  private reviews: Map<number, Review>;
  private currentIds: {
    restaurants: number;
    waitlist: number;
    menu: number;
    bookings: number;
    reviews: number;
  };

  constructor() {
    this.restaurants = new Map();
    this.waitlist = new Map();
    this.menu = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.currentIds = {
      restaurants: 1,
      waitlist: 1,
      menu: 1,
      bookings: 1,
      reviews: 1
    };
  }

  // Restaurant methods
  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const id = this.currentIds.restaurants++;
    const newRestaurant: Restaurant = { 
      ...restaurant, 
      id,
      rating: "0",
      totalReviews: 0
    };
    this.restaurants.set(id, newRestaurant);
    return newRestaurant;
  }

  async getRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  async getRestaurantById(id: number): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  // Waitlist methods
  async createWaitlistSignup(signup: InsertWaitlist): Promise<WaitlistSignup> {
    const id = this.currentIds.waitlist++;
    const newSignup: WaitlistSignup = { ...signup, id };
    this.waitlist.set(id, newSignup);
    return newSignup;
  }

  async getWaitlistSignups(): Promise<WaitlistSignup[]> {
    return Array.from(this.waitlist.values());
  }

  // Menu methods
  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentIds.menu++;
    const newItem: MenuItem = { 
      ...item, 
      id,
      totalRating: "0",
      totalReviews: 0
    };
    this.menu.set(id, newItem);
    return newItem;
  }

  async getMenuItems(restaurantId: number): Promise<MenuItem[]> {
    return Array.from(this.menu.values())
      .filter(item => item.restaurantId === restaurantId);
  }

  async getMenuItemById(id: number): Promise<MenuItem | undefined> {
    return this.menu.get(id);
  }

  // Booking methods
  async createBooking(booking: InsertBooking): Promise<TableBooking> {
    const id = this.currentIds.bookings++;
    const newBooking: TableBooking = { ...booking, id, status: "pending" };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getBookings(restaurantId: number): Promise<TableBooking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.restaurantId === restaurantId);
  }

  async getBookingById(id: number): Promise<TableBooking | undefined> {
    return this.bookings.get(id);
  }

  // Review methods
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentIds.reviews++;
    const newReview: Review = { ...review, id, date: new Date() };
    this.reviews.set(id, newReview);

    // Update restaurant rating if it's a restaurant review
    if (review.restaurantId && !review.menuItemId) {
      const restaurant = await this.getRestaurantById(review.restaurantId);
      if (restaurant) {
        const restaurantReviews = await this.getReviews(review.restaurantId);
        const avgRating = restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length;
        this.restaurants.set(review.restaurantId, {
          ...restaurant,
          rating: avgRating.toFixed(1),
          totalReviews: restaurantReviews.length
        });
      }
    }

    // Update menu item rating if it's a menu item review
    if (review.menuItemId) {
      const menuItem = await this.getMenuItemById(review.menuItemId);
      if (menuItem) {
        const menuItemReviews = await this.getMenuItemReviews(review.menuItemId);
        const avgRating = menuItemReviews.reduce((sum, r) => sum + r.rating, 0) / menuItemReviews.length;
        this.menu.set(review.menuItemId, {
          ...menuItem,
          totalRating: avgRating.toFixed(1),
          totalReviews: menuItemReviews.length
        });
      }
    }

    return newReview;
  }

  async getReviews(restaurantId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.restaurantId === restaurantId && !review.menuItemId);
  }

  async getMenuItemReviews(menuItemId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.menuItemId === menuItemId);
  }

  async getBookingReviews(bookingId: number): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.bookingId === bookingId);
  }
}

export const storage = new MemStorage();