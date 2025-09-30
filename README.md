# HELP To OLDEST - Humanitarian Organization Website

A comprehensive website for the HELP To OLDEST humanitarian organization with contact management, volunteer registration, donation processing, and admin dashboard.

## ✨ New Features Added

### 🗄️ Database Integration

- **Replaced in-memory storage** with persistent PostgreSQL database using Drizzle ORM
- **Data persistence** - No more data loss on server restart
- **Better querying** and data management capabilities

### 📧 Email Notifications

- **Instant email alerts** to administrators for:
  - New contact form submissions
  - Volunteer applications
  - Donation confirmations
- **Configurable SMTP** settings (Gmail, SendGrid, etc.)

### 🔐 Admin Authentication System

- **Secure login** with bcrypt password hashing
- **Session-based authentication** with Express sessions
- **Protected admin routes** with middleware

### 📊 Admin Dashboard

- **Real-time statistics** showing total contacts, volunteers, and donations
- **Complete data management** with tabbed interface for:
  - Contact messages with full details
  - Volunteer applications with contact info
  - Donation records with amounts and messages
- **Responsive design** optimized for desktop and mobile
- **Secure logout** functionality

## 🚀 Setup Instructions

### 1. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

```env
# Database (Required)
DATABASE_URL=your_neon_database_url_here

# Email Configuration (Optional but recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
ADMIN_EMAIL=helptooldestasso@gmail.com

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Flutterwave Configuration
FLUTTERWAVE_CLIENT_ID=your_flutterwave_public_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key
FLUTTERWAVE_ENCRYPTION_KEY=your_flutterwave_encryption_key

# Session Secret (Required for admin)
SESSION_SECRET=your_random_session_secret_here
```

### 2. Database Setup

Push the database schema:

```bash
npm run db:push
```

### 3. Create Admin User

Create your first admin user:

```bash
npm run setup-admin <username> <password>
```

Example:

```bash
npm run setup-admin admin mySecurePassword123
```

### 4. Install Dependencies & Start

```bash
npm install
npm run dev
```

## 🔗 Admin Access

1. **Admin Login**: Navigate to `/admin/login`
2. **Dashboard**: After login, access `/admin` for the full dashboard

## 🔧 Email Setup (Optional)

### Gmail Configuration

1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" in your Google Account settings
3. Use your Gmail address as `SMTP_USER`
4. Use the app password as `SMTP_PASS`

### Other SMTP Providers

- **SendGrid**: Use SendGrid SMTP credentials
- **Mailgun**: Use Mailgun SMTP settings
- **Custom SMTP**: Configure your own SMTP server

## 📋 Features Overview

### Public Features

- **Contact Form**: Visitors can send messages with automatic email notifications
- **Volunteer Registration**: People can apply to volunteer with detailed forms
- **Donation System**: Integrated PayPal and Flutterwave payment processing
- **Responsive Design**: Mobile-friendly interface

### Admin Features

- **Dashboard Overview**: Quick stats and recent activity
- **Contact Management**: View all contact form submissions
- **Volunteer Management**: Review all volunteer applications
- **Donation Tracking**: Monitor all donations and payments
- **Real-time Notifications**: Instant email alerts for new submissions

## 🛠️ Technical Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: bcrypt + Express sessions
- **Email**: Nodemailer with SMTP
- **Payments**: PayPal & Flutterwave integration

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Secure HTTP-only cookies
- **Protected Routes**: Middleware-based authentication
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Session-based security

## 🚨 Important Notes

- **Database**: Make sure to set up your Neon database and configure the URL
- **Email**: Email notifications are optional but highly recommended
- **Sessions**: Set a strong, random `SESSION_SECRET` in production
- **Security**: Always use HTTPS in production for secure cookies

## 📞 Support

For technical support or questions about the admin system, contact I.

---

**HELP To OLDEST** - Aidons les plus âgés ensemble 💙
