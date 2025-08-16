# Server Simulation Game

## Overview

A full-stack web application that simulates a server management business game. Players manage virtual servers, earn income, complete learning courses, and progress through a gamified experience. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (Latest: August 16, 2025)

### Mobile Optimization (August 16, 2025)
- **Status Bar**: Added responsive mobile layout with compact stats display and mobile navigation
- **Dashboard Navigation**: Implemented horizontal scrollable tabs for mobile, hidden Player Rankings on mobile
- **Component Responsiveness**: All major components (Learning, Servers, Hosting, Tutorial) now fully mobile-optimized
- **Typography & Spacing**: Responsive text sizes, padding adjustments for mobile screens
- **Touch-Friendly UI**: Minimum 44px touch targets, improved mobile interactions
- **Compact Currency Display**: Added compact formatting (K/M) for mobile displays
- **Mobile-First CSS**: Added scrollbar hiding and mobile-specific touch interactions

### Previous Bug Fixes (August 16, 2025)
- Fixed clickable player nicknames in rankings leading to player profiles
- Fixed "Browse Server Store" button functionality
- Added online/offline status indicators with green/red dots
- Fixed logout redirect to /start page
- Corrected server statistics display (now shows 4 servers correctly)
- Fixed object rendering error in learning-tab component
- Added Ukrainian language support

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Radix UI components with shadcn/ui design system for consistent, accessible interfaces
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API endpoints
- **Language**: TypeScript for consistent type safety across the stack
- **API Design**: RESTful architecture with `/api` prefix for all endpoints
- **Middleware**: Custom logging middleware for request/response tracking
- **Development**: Hot reloading with tsx for rapid development cycles

### Data Storage Solutions
- **Database**: PostgreSQL for reliable ACID-compliant data storage
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Connection**: Neon Database serverless PostgreSQL for cloud-native scaling
- **Migrations**: Drizzle Kit for database schema migrations and version control
- **Fallback Storage**: In-memory storage implementation for development/testing environments

### Authentication and Authorization
- **Session Management**: Express sessions for user authentication state
- **Storage**: PostgreSQL-backed session storage using connect-pg-simple
- **Security**: HTTP-only cookies with secure flags for production environments
- **User Model**: Simple username/password authentication with hashed passwords

### Game Logic Architecture
- **Server Products**: Predefined server types with income generation, costs, and purchase prices
- **Learning System**: Time-based courses that unlock new capabilities and server slots
- **Income Generation**: Passive income system with per-minute calculations
- **Activity Tracking**: User action logging for game progression and analytics
- **Tutorial System**: Guided onboarding with completion tracking

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form for form management
- **State Management**: TanStack React Query for server state synchronization
- **Routing**: Wouter for declarative routing without heavy overhead

### UI and Styling
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Design System**: shadcn/ui component collection built on Radix primitives

### Backend Infrastructure
- **Web Framework**: Express.js with TypeScript support
- **Database**: PostgreSQL via Neon Database serverless platform
- **ORM**: Drizzle ORM with Drizzle Kit for schema management
- **Session Management**: express-session with connect-pg-simple for PostgreSQL storage

### Development Tools
- **Build System**: Vite with React plugin for fast development and building
- **TypeScript**: Full-stack TypeScript for type safety and developer experience
- **Development Server**: tsx for TypeScript execution in development
- **Replit Integration**: Specialized plugins for Replit environment compatibility

### Data Validation and Utilities
- **Schema Validation**: Zod for runtime type checking and API validation
- **Date Handling**: date-fns for date manipulation and formatting
- **Utility Libraries**: clsx and tailwind-merge for conditional CSS classes
- **UUID Generation**: Built-in crypto module for unique identifier creation