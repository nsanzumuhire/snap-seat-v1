import { WaitlistSignup, InsertWaitlist } from "@shared/schema";

export interface IStorage {
  createWaitlistSignup(signup: InsertWaitlist): Promise<WaitlistSignup>;
  getWaitlistSignups(): Promise<WaitlistSignup[]>;
}

export class MemStorage implements IStorage {
  private waitlist: Map<number, WaitlistSignup>;
  private currentId: number;

  constructor() {
    this.waitlist = new Map();
    this.currentId = 1;
  }

  async createWaitlistSignup(signup: InsertWaitlist): Promise<WaitlistSignup> {
    const id = this.currentId++;
    const newSignup: WaitlistSignup = { ...signup, id };
    this.waitlist.set(id, newSignup);
    return newSignup;
  }

  async getWaitlistSignups(): Promise<WaitlistSignup[]> {
    return Array.from(this.waitlist.values());
  }
}

export const storage = new MemStorage();
