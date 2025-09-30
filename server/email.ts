import nodemailer from "nodemailer";
import type { Contact, Volunteer, Donation } from "@shared/schema";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    };

    if (emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransport(emailConfig);
    } else {
      console.warn("Email service not configured. Set SMTP_USER and SMTP_PASS environment variables.");
    }
  }

  async sendContactNotification(contact: Contact): Promise<boolean> {
    if (!this.transporter) {
      console.log("Email transporter not configured");
      return false;
    }

    const adminEmail = process.env.ADMIN_EMAIL || "helptooldestasso@gmail.com";

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: adminEmail,
        subject: `Nouveau message de contact: ${contact.subject}`,
        html: `
          <h2>Nouveau message de contact</h2>
          <p><strong>Nom:</strong> ${contact.firstName} ${contact.lastName}</p>
          <p><strong>Email:</strong> ${contact.email}</p>
          <p><strong>Sujet:</strong> ${contact.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${contact.message}</p>
          <p><strong>Date:</strong> ${contact.createdAt?.toLocaleString()}</p>
        `,
      });

      console.log("Contact notification email sent successfully");
      return true;
    } catch (error) {
      console.error("Failed to send contact notification email:", error);
      return false;
    }
  }

  async sendVolunteerNotification(volunteer: Volunteer): Promise<boolean> {
    if (!this.transporter) {
      console.log("Email transporter not configured");
      return false;
    }

    const adminEmail = process.env.ADMIN_EMAIL || "helptooldestasso@gmail.com";

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: adminEmail,
        subject: `Nouvelle candidature de volontaire: ${volunteer.firstName} ${volunteer.lastName}`,
        html: `
          <h2>Nouvelle candidature de volontaire</h2>
          <p><strong>Nom:</strong> ${volunteer.firstName} ${volunteer.lastName}</p>
          <p><strong>Email:</strong> ${volunteer.email}</p>
          <p><strong>Téléphone:</strong> ${volunteer.phone}</p>
          <p><strong>Profession:</strong> ${volunteer.profession || "Non spécifiée"}</p>
          <p><strong>Disponibilité:</strong> ${volunteer.availability}</p>
          <p><strong>Motivation:</strong></p>
          <p>${volunteer.motivation}</p>
          <p><strong>Date:</strong> ${volunteer.createdAt?.toLocaleString()}</p>
        `,
      });

      console.log("Volunteer notification email sent successfully");
      return true;
    } catch (error) {
      console.error("Failed to send volunteer notification email:", error);
      return false;
    }
  }

  async sendDonationNotification(donation: Donation): Promise<boolean> {
    if (!this.transporter) {
      console.log("Email transporter not configured");
      return false;
    }

    const adminEmail = process.env.ADMIN_EMAIL || "helptooldestasso@gmail.com";

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: adminEmail,
        subject: `Nouveau don reçu: ${donation.amount}`,
        html: `
          <h2>Nouveau don reçu</h2>
          <p><strong>Donateur:</strong> ${donation.donorName}</p>
          <p><strong>Email:</strong> ${donation.email}</p>
          <p><strong>Montant:</strong> ${donation.amount}</p>
          <p><strong>Type:</strong> ${donation.type}</p>
          ${donation.message ? `<p><strong>Message:</strong> ${donation.message}</p>` : ""}
          <p><strong>Date:</strong> ${donation.createdAt?.toLocaleString()}</p>
        `,
      });

      console.log("Donation notification email sent successfully");
      return true;
    } catch (error) {
      console.error("Failed to send donation notification email:", error);
      return false;
    }
  }
}

export const emailService = new EmailService();