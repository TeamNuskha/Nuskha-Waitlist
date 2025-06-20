# Waitlist Application

## Overview

This is a full-stack waitlist registration application built with a modern web stack. The application allows users to sign up for a waitlist and displays the current number of registrations. It features a clean, responsive design with a landing page focused on waitlist conversion.

## System Architecture

The application follows a monorepo structure with separate client and server directories:

- **Frontend**: React-based SPA with TypeScript, Vite build system, and shadcn/ui components
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Deployment**: Configured for Replit with autoscale deployment target

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod schemas for request validation
- **Session Management**: Express sessions with PostgreSQL store
- **Error Handling**: Centralized error handling middleware
- **Logging**: Custom request logging with response capture

### Database Schema
- **Users Table**: Basic user authentication (username, password)
- **Waitlist Registrations Table**: Email-based waitlist with timestamps
- **Validation**: Drizzle-Zod integration for type-safe schema validation

## Data Flow

1. **Waitlist Registration Flow**:
   - User submits email through React form
   - Frontend validates with Zod schema
   - API validates and checks for duplicate emails
   - Database stores registration with timestamp
   - Real-time count updates via TanStack Query

2. **Count Display**:
   - Initial count loaded on page mount
   - Automatic refetch every 30 seconds
   - Immediate update after successful registration

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form state management
- **zod**: Runtime type validation
- **@radix-ui/***: Headless UI components
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Frontend build tool and dev server

## Deployment Strategy

The application is configured for Replit deployment with the following setup:

- **Development**: `npm run dev` runs both frontend and backend
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Production**: Serves static files and API from single Express server
- **Port Configuration**: Internal port 5000, external port 80
- **Auto-scaling**: Configured for Replit's autoscale deployment

### Build Commands
- `npm run build`: Builds both frontend and backend for production
- `npm run start`: Starts production server
- `npm run db:push`: Pushes database schema changes

## Changelog

```
Changelog:
- June 20, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```