# Server Simulation Game

## Overview
A full-stack web application simulating a server management business game. Players manage virtual servers, generate income, complete learning courses, and engage in a gamified experience. The project aims to provide an engaging, educational, and financially rewarding simulation, leveraging modern web technologies for a robust and scalable platform. Key capabilities include server management, economic simulation, gamified learning, and real-time interaction.

## User Preferences
- Preferred communication style: Simple, everyday language
- Language: Russian preferred for communication
- Uses Russian interface in the game

## Recent Changes
- **Migration Completed (August 17, 2025)**: Successfully migrated project from Replit Agent to standard Replit environment
  - Installed all Node.js dependencies via packager tool
  - Verified server startup and application functionality
  - Application running on port 5000 with full features operational
  - All migration checklist items completed successfully
  - Server simulation game is fully operational with background income updates, user rankings, and real-time stats
  - Migration verified by user - project ready for continued development
- **UI/UX Improvements (August 17, 2025)**:
  - Fixed authentication API calls - corrected apiRequest function usage for proper JSON responses
  - Made Reports, Daily Quests, and Achievements tabs accessible immediately after registration
  - Only Servers, Hosting, and Learning tabs now require tutorial completion
  - Enhanced user experience by removing tutorial dependency for key engagement features

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter.
- **State Management**: TanStack Query for server state and caching.
- **UI Framework**: Radix UI components with shadcn/ui design system.
- **Styling**: Tailwind CSS with CSS variables for theming and responsiveness.
- **Build Tool**: Vite.
- **UI/UX Decisions**:
    - **Theming**: Comprehensive dark/light theme system with animated toggles, persistent preferences via localStorage. Default is dark theme.
    - **Visual Indicators**: Difficulty-based colored circles for tutorial jobs (blue for easy, orange for medium, red for hard). Lock icons for level-restricted content.
    - **Notifications**: Auto-dismissing notifications (5-second timeout), toast notifications with high z-index to prevent overlap.
    - **Tooltips**: Contextual tooltips for interactive elements (e.g., avatar, nickname).
    - **Admin Badges**: Distinct styling for super-admin (red gradient, pulse animation) and regular admin (gold gradient).
    - **Avatar System**: Regular users have static gradients; super-admin has unique rainbow-pulse animation.
    - **Responsiveness**: Mobile-first design with compact layouts, responsive typography, scrollable tabs, and optimized component rendering for smaller screens. Reduced particle animations and simplified blur effects for mobile performance.
    - **Error Handling**: Client-side validation with real-time feedback and server-side validation.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript.
- **API Design**: RESTful architecture (`/api` prefix).
- **Middleware**: Custom logging.
- **Development**: Hot reloading with tsx.

### Data Storage Solutions
- **Database**: PostgreSQL.
- **ORM**: Drizzle ORM for type-safe operations.
- **Cloud Database**: Neon Database (serverless PostgreSQL).
- **Migrations**: Drizzle Kit for schema management.

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL-backed storage (connect-pg-simple).
- **Security**: HTTP-only cookies with secure flags.
- **User Model**: Username/password authentication with hashed passwords. Case-insensitive username registration prevention.
- **Admin System**: Multi-level admin roles (super-admin, regular admin) with granular permissions for user management, message moderation, and money management. Super-admin has exclusive access to critical controls and cannot be managed by regular admins. Admin badges reflect status at the time of message sending.

### Game Logic Architecture
- **Server Mechanics**: Predefined server types with income, costs, and purchase prices. **Automatic background income generation every minute for all users with active servers**. Server overload checks every 5 minutes (90%+ load), with reduced shutdown probabilities. Server repair displays cost and durability.
- **Learning System**: Time-based courses unlocking capabilities and server slots (e.g., Security Protocols requires level 12, Database Server requires level 8).
- **Gamification**:
    - **Achievements System**: 5 progressive achievements with rewards.
    - **Daily Quests**: 3 challenges resetting every 24 hours.
- **Chat System**: Real-time general text chat with 100-message history, admin moderation (message deletion, user muting with expiration).
- **Activity Tracking**: User action logging, real-time online status tracking (5-minute window) via API calls.
- **Tutorial System**: Guided onboarding with completion tracking.
- **Financial Tracking**: Accurate calculation of total earnings and total spent, with real-time balance updates in UI.

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form.
- **State Management**: TanStack React Query.
- **Routing**: Wouter.

### UI and Styling
- **Component Library**: Radix UI.
- **Styling**: Tailwind CSS, PostCSS.
- **Icons**: Lucide React.
- **Design System**: shadcn/ui.

### Backend Infrastructure
- **Web Framework**: Express.js.
- **Database**: PostgreSQL (via Neon Database).
- **ORM**: Drizzle ORM, Drizzle Kit.
- **Session Management**: express-session, connect-pg-simple.

### Development Tools
- **Build System**: Vite.
- **TypeScript**: Used full-stack.
- **Development Server**: tsx.

### Data Validation and Utilities
- **Schema Validation**: Zod.
- **Date Handling**: date-fns.
- **Utility Libraries**: clsx, tailwind-merge.
- **UUID Generation**: Node.js built-in crypto module.