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

  if (!clientId || !clientSecret) {
    console.log(clientId, clientSecret);
    throw new Error("PayPal client ID and secret are required");
  }

  const environment = Environment.Sandbox;
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

      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
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
      const order = await ordersController.createOrder({
        body: {
          intent: "CAPTURE" as any,
          purchaseUnits: [
            {
              amount: {
                currencyCode: "USD",
                value: "10.00", // You can get this value from the request body
              },
            },
          ],
        },
      });
      const orderResponse = order.result;
      res.json({ id: orderResponse.id });
    } catch (err: any) {
      res.status(500).send(err.message || "PayPal order creation failed");
    }
  });

  // PayPal capture order
  app.post("/api/paypal/capture-order", async (req, res) => {
    const { orderID } = req.body;

    try {
      const capture = await ordersController.captureOrder({
        id: orderID,
        body: {},
      });
      // Save the capture information to your database here
      res.json(capture.result);
    } catch (err: any) {
      res.status(500).send(err.message || "PayPal order capture failed");
    }
  });

  // Configure Flutterwave
  const FLW_PUBLIC_KEY = process.env.FLUTTERWAVE_CLIENT_ID;
  const FLW_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;
  const FLW_ENCRYPTION_KEY = process.env.FLUTTERWAVE_ENCRYPTION_KEY;

  if (!FLW_PUBLIC_KEY || !FLW_SECRET_KEY || !FLW_ENCRYPTION_KEY) {
    throw new Error(
      "Flutterwave public key, secret key, and encryption key are required"
    );
  }

  const FlutterwaveModule = await import("flutterwave-node-v3");
  const Flutterwave = FlutterwaveModule.default || FlutterwaveModule;
  const flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);

  // Flutterwave initiate payment
  app.post("/api/flutterwave/initiate-payment", async (req, res) => {
    try {
      console.log("Flutterwave payment initiated with payload:", req.body);
      console.log("Encryption key available:", !!FLW_ENCRYPTION_KEY);

      const payload = req.body; // amount, email, phone_number, currency, etc.

      // Format the payload for Flutterwave Charge API
      const chargePayload = {
        tx_ref: payload.tx_ref || `tx-${Date.now()}`,
        amount: payload.amount,
        currency: payload.currency || "USD",
        email: payload.email,
        phone_number: payload.phone_number,
        payment_options: payload.payment_options || "mobilemoney",
        redirect_url:
          payload.redirect_url || "http://localhost:5000/payment-success",
        // enckey: FLW_ENCRYPTION_KEY, // Encryption key for Flutterwave
        meta: payload.meta || {},
        customer: payload.customer || {
          email: payload.email,
          phonenumber: payload.phone_number,
          name: payload.customer?.name || "Customer",
        },
        customizations: payload.customizations || {
          title: "Donation Payment",
          description: "Mobile Money Payment",
          logo: "",
        },
      };

      // Use MobileMoney method instead of card for mobile money payments
      let response;
      if (payload.payment_options === "mobilemoney") {
        // For mobile money, we'll use the franco_phone method (for Orange/MTN in francophone countries)
        // Remove payment_options from payload as it's not allowed for this method
        const mobilePayload = { ...chargePayload };
        delete mobilePayload.payment_options;
        delete mobilePayload.customer;
        delete mobilePayload.customizations;
        response = await flw.MobileMoney.franco_phone(mobilePayload);

        console.log(response);
      } else {
        // Fallback to standard charge
        response = await flw.Charge.card(chargePayload);
      }

      res.json(response);
    } catch (error) {
      console.log(error);
      console.error("Flutterwave initiation error:", error);
      res.status(500).json({ error: "Failed to initiate Flutterwave payment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
