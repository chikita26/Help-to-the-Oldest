import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./email";
import { authService } from "./auth";
import { requireAdmin } from "./middleware";
import {
  insertContactSchema,
  insertVolunteerSchema,
  insertDonationSchema,
} from "@shared/schema";
import { z } from "zod";
import {
  Client,
  Environment,
  OrdersController,
} from "@paypal/paypal-server-sdk";

// Import session type declaration
import "./middleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure PayPal
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const environment = Environment.Sandbox;

  if (!clientId || !clientSecret) {
    console.error("PayPal configuration error:");
    console.error("Client ID:", clientId ? "✓ Present" : "✗ Missing");
    console.error("Client Secret:", clientSecret ? "✓ Present" : "✗ Missing");
    throw new Error("PayPal client ID and secret are required");
  }

  console.log("PayPal configured successfully for", environment);
  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: clientId,
      oAuthClientSecret: clientSecret,
    },
    environment,
  });
  const ordersController = new OrdersController(client);

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await authService.authenticate(username, password);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session!.userId = user.id;
      req.session!.userRole = user.role;

      res.json({
        success: true,
        user: { id: user.id, username: user.username, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    res.json({
      user: {
        id: req.session.userId,
        role: req.session.userRole,
      },
    });
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);

      // Send email notification
      await emailService.sendContactNotification(contact);

      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Invalid contact data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Volunteer registration
  app.post("/api/volunteers", async (req, res) => {
    try {
      const volunteerData = insertVolunteerSchema.parse(req.body);
      const volunteer = await storage.createVolunteer(volunteerData);

      // Send email notification
      await emailService.sendVolunteerNotification(volunteer);

      res.json({ success: true, volunteer });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Invalid volunteer data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to register volunteer" });
      }
    }
  });

  // Donation submission
  app.post("/api/donations", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(donationData);

      // Send email notification
      await emailService.sendDonationNotification(donation);

      res.json({ success: true, donation });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Invalid donation data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to process donation" });
      }
    }
  });

  // Get contacts (admin endpoint)
  app.get("/api/admin/contacts", requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Get volunteers (admin endpoint)
  app.get("/api/admin/volunteers", requireAdmin, async (req, res) => {
    try {
      const volunteers = await storage.getVolunteers();
      res.json(volunteers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch volunteers" });
    }
  });

  // Get donations (admin endpoint)
  app.get("/api/admin/donations", requireAdmin, async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch donations" });
    }
  });

  // Admin dashboard stats
  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const [contacts, volunteers, donations] = await Promise.all([
        storage.getContacts(),
        storage.getVolunteers(),
        storage.getDonations(),
      ]);

      const stats = {
        totalContacts: contacts.length,
        totalVolunteers: volunteers.length,
        totalDonations: donations.length,
        recentContacts: contacts.slice(-5).reverse(),
        recentVolunteers: volunteers.slice(-5).reverse(),
        recentDonations: donations.slice(-5).reverse(),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // PayPal create order
  app.post("/api/paypal/create-order", async (req, res) => {
    try {
      console.log("Creating PayPal order with request:", req.body);

      const { amount } = req.body;
      const orderAmount = amount || "10.00";

      const order = await ordersController.createOrder({
        body: {
          intent: "CAPTURE" as any,
          purchaseUnits: [
            {
              amount: {
                currencyCode: "USD",
                value: orderAmount,
              },
            },
          ],
        },
      });

      const orderResponse = order.result;
      console.log("PayPal order created successfully:", orderResponse.id);

      res.json({ id: orderResponse.id });
    } catch (err: any) {
      console.error("PayPal order creation error:", err);
      res.status(500).json({
        error: "PayPal order creation failed",
        message: err.message,
      });
    }
  });

  // PayPal capture order
  app.post("/api/paypal/capture-order", async (req, res) => {
    const { orderID } = req.body;

    try {
      console.log("Capturing PayPal order:", orderID);

      const capture = await ordersController.captureOrder({
        id: orderID,
        body: {},
      });

      console.log("PayPal order captured successfully:", capture.result);

      // Save the capture information to your database here
      res.json(capture.result);
    } catch (err: any) {
      console.error("PayPal order capture error:", err);
      res.status(500).json({
        error: "PayPal order capture failed",
        message: err.message,
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
