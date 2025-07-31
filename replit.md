# HOLD (Help to Oldest) - Humanitarian Organization Website

## Overview

This is a full-stack web application for HOLD (Help to Oldest), a humanitarian non-governmental organization dedicated to the well-being of elderly people in Cameroon. The application serves as the organization's website, providing information about their mission, services, and allowing users to volunteer, donate, and contact the organization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Pattern**: RESTful API endpoints
- **Validation**: Zod schemas for request/response validation
- **Development**: TypeScript with ESM modules

### Data Storage Solutions
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM with type-safe database operations
- **Development Storage**: In-memory storage for development/testing
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Frontend Components
- **Navigation**: Sticky navigation with smooth scrolling to sections
- **Hero Section**: Main landing area with call-to-action buttons
- **About Section**: Organization information and legal recognition
- **Services Section**: Six core areas of focus for elderly care
- **Ambitions Section**: Organization goals and objectives
- **News Section**: Recent activities and events
- **Testimonials**: User feedback and volunteer experiences
- **Gallery**: Visual representation of organization activities
- **Forms**: Contact, volunteer registration, and donation forms
- **Footer**: Links, contact information, and social media

### Backend API Endpoints
- `POST /api/contact` - Contact form submissions
- `POST /api/volunteers` - Volunteer registrations
- `POST /api/donations` - Donation submissions

### Database Schema
- **users**: User authentication (prepared for future use)
- **contacts**: Contact form submissions
- **volunteers**: Volunteer registration data
- **donations**: Donation records

## Data Flow

1. **User Interaction**: Users interact with forms on the frontend
2. **Form Validation**: Client-side validation using React Hook Form and Zod
3. **API Request**: Validated data sent to Express.js backend
4. **Server Validation**: Backend re-validates using shared Zod schemas
5. **Data Storage**: Information stored in database via Drizzle ORM
6. **Response**: Success/error feedback displayed to user via toast notifications

## External Dependencies

### UI and Styling
- **shadcn/ui**: Comprehensive component library with Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

### Form Management
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for type safety

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production

### Database and Backend
- **Drizzle ORM**: Type-safe database operations
- **Express.js**: Web application framework
- **@neondatabase/serverless**: PostgreSQL driver

## Deployment Strategy

### Development
- Uses Vite dev server with HMR for frontend
- Express server with TypeScript compilation via tsx
- In-memory storage for rapid development iteration
- Environment variable configuration for database connection

### Production Build
- Frontend built with Vite to static assets
- Backend bundled with ESBuild for Node.js deployment
- Database migrations managed through Drizzle Kit
- Static assets served from Express server

### Environment Configuration
- Database URL configured via environment variables
- Production/development mode switching
- Support for Replit deployment with specific plugins and configuration

The architecture emphasizes type safety, developer experience, and maintainability while providing a solid foundation for a humanitarian organization's web presence. The shared schema approach ensures consistency between frontend and backend validation, while the modular component structure allows for easy maintenance and feature additions.