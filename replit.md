# Overview

Root Tycoon is a web-based server management simulation game built with React and Node.js. Players manage virtual servers, earn in-game currency, complete quests, and participate in chat while building their IT empire. The game features a comprehensive progression system with levels, achievements, VIP/Premium status upgrades, and mini-games.

# User Preferences

Preferred communication style: Simple, everyday language.
Project language: Russian (основной язык пользователя)

# Recent Changes (January 2025)

## Latest Updates (August 2025)
- **Production Infrastructure Setup**: Created complete MySQL database migration system with schema and backup functionality
- **PM2 Clustering**: Configured ecosystem for multi-core utilization with connection pooling (1000 connections limit)
- **Automated Backups**: Implemented daily incremental backups at 00:00 with 30-day retention
- **Storage Adapter**: Built intelligent storage system that switches between file-based (development) and MySQL (production) storage
- **Linux Server Deployment**: Added comprehensive deployment scripts and production configuration
- **Real Push Notifications**: Implemented browser notification system with permission handling and test notifications

## Previous Updates
- Successfully migrated project from Replit Agent to standard Replit environment
- Installed all required Node.js dependencies for both frontend and backend
- Verified server startup and frontend connectivity
- Fixed critical chat bug where regular users couldn't send messages due to undefined 'language' variable
- Enhanced PWA installation functionality with dedicated settings tab and install button
- Project now runs cleanly on port 5000 with Express backend and Vite frontend

# System Architecture

## Frontend Architecture

- **React SPA** built with Vite as the build tool and development server
- **Component Library**: Radix UI components with Tailwind CSS for styling
- **State Management**: React Query (@tanstack/react-query) for server state and React Context for global game state
- **Routing**: Wouter for client-side routing
- **PWA Support**: Service worker implementation with manifest.json for mobile app-like experience
- **Multi-language Support**: Built-in internationalization system with language context provider

## Backend Architecture

- **Express.js Server** running on Node.js with ES modules
- **Session-based Authentication**: Express sessions with bcrypt for password hashing
- **File-based Storage**: JSON files for user data, chat messages, servers, and game state
- **Real-time Features**: RESTful API endpoints for game mechanics including chat, server management, and user progression
- **Income System**: Background process for passive income generation from owned servers

## Data Storage Solutions

- **Primary Storage**: File-based JSON storage in `/data` and `/users` directories
- **User Data**: Individual JSON files per user in `/users` directory
- **Game Data**: Centralized JSON files for chat history, rankings, reports, and server data
- **Database Migration Ready**: Drizzle ORM configured for PostgreSQL with Neon Database support for future scalability

## Authentication and Authorization

- **Session Management**: Express sessions with secure HTTP-only cookies
- **Role-based Access**: Admin levels (0=user, 1=admin, 2=super-admin) with different permissions
- **Registration Limits**: IP-based registration throttling to prevent abuse
- **Password Security**: bcrypt hashing with salt rounds for secure password storage

## External Dependencies

- **Payment Processing**: Stripe integration for VIP/Premium status purchases
- **Email Notifications**: SendGrid integration for payment confirmations and user communications
- **UI Components**: Extensive Radix UI component library for accessible interface elements
- **Development Tools**: Replit-specific plugins for development environment integration
- **Build System**: Vite for development server and production builds with ESBuild for server bundling

The architecture follows a monorepo structure with separate client and server directories, shared schemas, and comprehensive testing utilities. The system is designed for easy deployment on platforms like Replit while maintaining scalability options through the configured database migration system.