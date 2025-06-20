import { users, waitlistRegistrations, type User, type InsertUser, type WaitlistRegistration, type InsertWaitlistRegistration } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Waitlist methods
  createWaitlistRegistration(registration: InsertWaitlistRegistration): Promise<WaitlistRegistration>;
  getWaitlistRegistrationByEmail(email: string): Promise<WaitlistRegistration | undefined>;
  getWaitlistCount(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlistRegistrations: Map<number, WaitlistRegistration>;
  private userCurrentId: number;
  private waitlistCurrentId: number;

  constructor() {
    this.users = new Map();
    this.waitlistRegistrations = new Map();
    this.userCurrentId = 1;
    this.waitlistCurrentId = 1;
    
    // Initialize with starting count of 1947
    for (let i = 1; i <= 1947; i++) {
      const registration: WaitlistRegistration = {
        id: i,
        email: `existing${i}@example.com`,
        registeredAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
      };
      this.waitlistRegistrations.set(i, registration);
    }
    this.waitlistCurrentId = 1948;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createWaitlistRegistration(insertRegistration: InsertWaitlistRegistration): Promise<WaitlistRegistration> {
    const id = this.waitlistCurrentId++;
    const registration: WaitlistRegistration = {
      ...insertRegistration,
      id,
      registeredAt: new Date(),
    };
    this.waitlistRegistrations.set(id, registration);
    return registration;
  }

  async getWaitlistRegistrationByEmail(email: string): Promise<WaitlistRegistration | undefined> {
    return Array.from(this.waitlistRegistrations.values()).find(
      (registration) => registration.email === email,
    );
  }

  async getWaitlistCount(): Promise<number> {
    return this.waitlistRegistrations.size;
  }
}

export const storage = new MemStorage();
