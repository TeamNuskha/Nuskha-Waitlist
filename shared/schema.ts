import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const waitlistRegistrations = pgTable("waitlist_registrations", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWaitlistRegistrationSchema = createInsertSchema(waitlistRegistrations).pick({
  email: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWaitlistRegistration = z.infer<typeof insertWaitlistRegistrationSchema>;
export type WaitlistRegistration = typeof waitlistRegistrations.$inferSelect;
