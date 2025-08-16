# Server Simulation Game

## Overview

A full-stack web application that simulates a server management business game. Players manage virtual servers, earn income, complete learning courses, and progress through a gamified experience. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database operations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (Latest: August 16, 2025)

### UI/UX Enhancements - Tooltips and Theme System (August 16, 2025)
- **Tooltips System**: Added helpful tooltips for avatar and nickname interactions
  - Avatar tooltip: "Click on your avatar to see progress and other interesting information"
  - Nickname tooltip: "Click on your nickname or someone else's to view their profile"
  - Support for both Russian and English languages
- **Dark/Light Theme System**: Comprehensive theme switching capabilities
  - Animated theme toggle with clear sun/moon symbols and smooth transitions
  - Desktop: Toggle button with hover tooltip next to logout button
  - Mobile: Compact toggle button (8x6px) next to language selector to prevent interface displacement
  - Dark theme set as default with moon symbol, light theme with sun symbol
  - Theme preferences saved in localStorage for persistence across sessions
- **Enhanced User Experience**: 
  - Improved visual feedback with clear iconography
  - Responsive design optimized for both desktop and mobile interfaces
  - Smooth animations and transitions for theme switching

### Migration Completion and Bug Fixes (August 16, 2025)
- **Project Migration Completed**: Successfully migrated the server simulation game from Replit Agent to standard Replit environment
  - All Node.js dependencies properly installed via package manager
  - Express server running cleanly on port 5000 without errors
  - React frontend and backend communication fully functional
  - Fixed React rendering error in learning component (object display issue)
  - Added case-insensitive username registration prevention to avoid duplicate accounts
  - All security practices maintained during migration

### Bug Fixes and Server Mechanics (August 16, 2025)
- **Fixed Server Overload System**: 
  - Servers no longer shut down immediately after load configuration
  - Overload checks only happen every 5 minutes minimum, not on every income update
  - Only servers with 90%+ load are checked for overload shutdown
  - Reduced shutdown probabilities: 15% for 95%+ load, 5% for 90-95% load
  - Servers should now stay online as intended unless severely overloaded

### Migration and Enhancements (August 16, 2025)
- **Project Migration**: Successfully migrated from Replit Agent to standard Replit environment
  - All Node.js dependencies properly installed and configured
  - Full server functionality restored with Express.js backend
  - Client-server separation maintained for security
- **Chat System Improvements**: 
  - Fixed admin badges to show status at time of message, not current status
  - Admin badges now persist correctly based on when message was sent
- **Avatar System Overhaul**: 
  - Regular users have static avatar gradients with no animations
  - Super-admin (Ca6aka) has unique rainbow-pulse animation with rotating colors and scaling
  - Avatar circles are slightly smaller than experience rings to show progress better
  - Experience rings maintain original size for better visibility
- **Level-Based Content Restrictions**: 
  - Added lock icons for learning courses and server purchases requiring higher levels
  - Security Protocols course now requires level 12, Database Server requires level 8
  - Visual indicators show "Requires Level X" instead of error messages
  - Enhanced UX with proper disabled states and tooltips for locked content
- **Performance & UX Optimizations**: 
  - Auto-dismissing notifications (5-second timeout) for cleaner interface
  - Limited user activity logs to 5 items to save disk space
  - Fixed player profile popup z-index (999999) to properly display over all game interface elements
- **Enhanced User Experience**: 
  - Profile popups now properly contained within game interface
  - Improved visual feedback with animated avatar effects and clear lock indicators

## Recent Changes (Latest: August 16, 2025)

### Major Updates (August 16, 2025)
- **Chat System**: Implemented general text chat to replace AI assistant
  - Real-time messaging with 100-message history
  - Admin controls for message deletion and user muting
  - Automatic mute expiration and status tracking
- **Enhanced Admin System**: 
  - Super-admin only access for banning other admins
  - Money management (add/remove) for super-admin
  - Mute/unmute functionality with duration control
  - Protected admin accounts from regular admin actions
- **Game Features**: Added achievements and daily quests system
  - 5 different achievements with progressive rewards
  - 3 daily quests that reset every 24 hours
  - Automatic progress tracking and reward distribution
- **Improved Online Status**: 
  - Real-time activity tracking (5-minute window)
  - Automatic status updates on all API calls
  - Fixed persistent online status bug

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
- **Chat System**: Real-time messaging with admin moderation capabilities
- **Achievements System**: Progressive rewards for game milestones and activities
- **Daily Quests**: Time-limited challenges that reset every 24 hours

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