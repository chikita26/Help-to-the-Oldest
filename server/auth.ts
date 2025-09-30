import bcrypt from "bcrypt";
import { storage } from "./storage";
import type { InsertUser } from "@shared/schema";

export class AuthService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async createAdmin(username: string, password: string) {
    const hashedPassword = await this.hashPassword(password);
    const adminData: InsertUser = {
      username,
      password: hashedPassword,
    };
    return await storage.createUser(adminData);
  }

  async authenticate(username: string, password: string) {
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isValid = await this.verifyPassword(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  }
}

export const authService = new AuthService();