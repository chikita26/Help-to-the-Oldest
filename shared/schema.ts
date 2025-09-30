import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const volunteers = pgTable("volunteers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  profession: text("profession"),
  motivation: text("motivation").notNull(),
  availability: text("availability").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  donorName: text("donor_name").notNull(),
  email: text("email").notNull(),
  amount: text("amount"), // Optional - required only for monetary donations
  type: text("type").notNull(), // 'monetary', 'nature'
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertVolunteerSchema = createInsertSchema(volunteers).omit({
  id: true,
  createdAt: true,
});

export const insertDonationSchema = createInsertSchema(donations)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    donorName: z.string().min(1, "Le nom complet est requis"),
    email: z.string().email("Email invalide").min(1, "L'email est requis"),
    type: z.string().min(1, "Le type de don est requis"),
    amount: z.string().optional(),
    message: z.string().optional(),
  })
  .refine(
    (data) => {
      // For monetary donations, amount is required
      if (data.type === "monetary") {
        return data.amount && data.amount.trim().length > 0;
      }
      // For in-kind donations, amount is optional
      return true;
    },
    {
      message: "Le montant est requis pour les dons monétaires",
      path: ["amount"],
    }
  );

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Volunteer = typeof volunteers.$inferSelect;
export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
