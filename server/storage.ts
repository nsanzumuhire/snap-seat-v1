import { 
  WaitlistSignup, InsertWaitlist,
  MenuItem, InsertMenuItem,
  TableBooking, InsertBooking,
  Review, InsertReview
} from "@shared/schema";

export interface IStorage {
  // Waitlist methods
  createWaitlistSignup(signup: InsertWaitlist): Promise<WaitlistSignup>;
  getWaitlistSignups(): Promise<WaitlistSignup[]>;

  // Menu methods
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  getMenuItems(): Promise<MenuItem[]>;
  getMenuItemById(id: number): Promise<MenuItem | undefined>;

  // Booking methods
  createBooking(booking: InsertBooking): Promise<TableBooking>;
  getBookings(): Promise<TableBooking[]>;
  getBookingById(id: number): Promise<TableBooking | undefined>;

  // Review methods
  createReview(review: InsertReview): Promise<Review>;
  getReviews(): Promise<Review[]>;
  getReviewsByBookingId(bookingId: number): Promise<Review[]>;
}

export class MemStorage implements IStorage {
  private waitlist: Map<number, WaitlistSignup>;
  private menu: Map<number, MenuItem>;
  private bookings: Map<number, TableBooking>;
  private reviews: Map<number, Review>;
  private currentIds: {
    waitlist: number;
    menu: number;
    bookings: number;
    reviews: number;
  };

  constructor() {
    this.waitlist = new Map();
    this.menu = new Map();
    this.bookings = new Map();
    this.reviews = new Map();
    this.currentIds = {
      waitlist: 1,
      menu: 1,
      bookings: 1,
      reviews: 1
    };
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
    const newItem: MenuItem = { ...item, id };
    this.menu.set(id, newItem);
    return newItem;
  }

  async getMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menu.values());
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

  async getBookings(): Promise<TableBooking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingById(id: number): Promise<TableBooking | undefined> {
    return this.bookings.get(id);
  }

  // Review methods
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.currentIds.reviews++;
    const newReview: Review = { ...review, id, date: new Date() };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getReviewsByBookingId(bookingId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.bookingId === bookingId
    );
  }
}

export const storage = new MemStorage();