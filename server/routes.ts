import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistRegistrationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get waitlist count
  app.get("/api/waitlist/count", async (req, res) => {
    try {
      const count = await storage.getWaitlistCount();
      res.json({ count });
    } catch (error) {
      console.error("Error getting waitlist count:", error);
      res.status(500).json({ message: "Failed to get waitlist count" });
    }
  });

  // Register for waitlist
  app.post("/api/waitlist/register", async (req, res) => {
    try {
      const result = insertWaitlistRegistrationSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }

      const { email } = result.data;

      // Check if email already exists
      const existingRegistration = await storage.getWaitlistRegistrationByEmail(email);
      if (existingRegistration) {
        return res.status(409).json({ message: "Email already registered for waitlist" });
      }

      // Create new registration
      const registration = await storage.createWaitlistRegistration({ email });
      const count = await storage.getWaitlistCount();

      res.status(201).json({ 
        message: "Successfully registered for waitlist",
        registration: { id: registration.id, email: registration.email },
        count 
      });
    } catch (error) {
      console.error("Error registering for waitlist:", error);
      res.status(500).json({ message: "Failed to register for waitlist" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
