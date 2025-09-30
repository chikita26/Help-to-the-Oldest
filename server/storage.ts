import { type User, type InsertUser, type Contact, type InsertContact, type Volunteer, type InsertVolunteer, type Donation, type InsertDonation, users, contacts, volunteers, donations } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;

  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;
  getVolunteers(): Promise<Volunteer[]>;

  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(insertContact).returning();
    return result[0];
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }

  async createVolunteer(insertVolunteer: InsertVolunteer): Promise<Volunteer> {
    const result = await db.insert(volunteers).values(insertVolunteer).returning();
    return result[0];
  }

  async getVolunteers(): Promise<Volunteer[]> {
    return await db.select().from(volunteers).orderBy(volunteers.createdAt);
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const result = await db.insert(donations).values(insertDonation).returning();
    return result[0];
  }

  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(donations.createdAt);
  }
}

export const storage = new DatabaseStorage();
