# Server Simulation Game

## Overview
A full-stack web application simulating a server management business game. Players manage virtual servers, generate income, complete learning courses, and engage in a gamified experience. The project aims to provide an engaging, educational, and financially rewarding simulation, leveraging modern web technologies for a robust and scalable platform. Key capabilities include server management, economic simulation, gamified learning, and real-time interaction.

## User Preferences
- Preferred communication style: Simple, everyday language
- Language: Russian preferred for communication
- Uses Russian interface in the game

[LIVE] ## Recent Changes
- **Cryptocurrency Selection & Full Donation Translations Completed (August 21, 2025)**: Enhanced payment system with user crypto selection and complete localization
  - **Crypto Currency Selection**: Players can now choose from 7 crypto options (USDT TRC20/ERC20, USDC, LTC, TRX, BTC, ETH) during payment
  - **Complete Translation**: All donation tab content translated to 4 languages (English, Russian, Ukrainian, German)
  - **Fiat Payment Disabled**: Card payment option properly disabled with clear user messaging about unavailability
  - **Server Integration**: Updated payment API to handle selected cryptocurrency parameter
  - **UI Enhancements**: Improved purchase dialog with crypto selector and translated interface
  - **Code Cleanup**: Removed bonus package mentions and promotional content as requested
  - **User Experience**: Clear messaging guides users to USDT/USDC for dollar-equivalent payments
- **Fiat Payment Issue Resolved (August 21, 2025)**: Investigated and clarified NOWPayments fiat payment limitations
  - **Technical Discovery**: NOWPayments does NOT support true fiat credit card payments - only cryptocurrency
  - **UI Update**: Fiat payment option temporarily disabled with clear explanation to users
  - **Documentation**: Created FIAT_PAYMENT_OPTIONS.md outlining integration options (Stripe recommended)
  - **Status**: Crypto payments via NOWPayments working perfectly, fiat requires separate provider
  - **Next Steps**: User needs to decide on fiat payment provider (Stripe, PayPal, or hybrid approach)
- **NOWPayments Integration Completed (August 20, 2025)**: Successfully replaced MoonPay with NOWPayments for cryptocurrency payments
  - **API Integration**: Real NOWPayments API key (0BYBCND-44G4DAZ-K5FPR03-WQKCRAF) tested and working
  - **Payment Creation**: Both VIP ($2.50) and Premium ($10) payments create successfully via USDT TRC20
  - **Webhook System**: Endpoint /api/payment-webhook ready for automatic payment confirmation
  - **Admin Configuration**: NOWPayments settings panel in admin interface with API key and email fields
  - **Payment Testing**: Live API test successful - payments generate working payment URLs
  - **Documentation**: Updated PAYMENT_SETUP.md with NOWPayments configuration instructions
- **Complete VIP/Premium System Implementation (August 20, 2025)**: Fully implemented VIP/Premium donation system according to detailed specifications
  - **Correct Pricing**: VIP $2.50/month, Premium $10 forever (no monthly payments)
  - **Visual Chat Badges**: Animated blue VIP badges and purple PREMIUM badges in chat messages with priority over admin badges
  - **Cooldown Reductions**: VIP 2m/4m/6m, Premium 1.5m/2m/5m for work activities instead of 3m/5m/7m
  - **Experience Multipliers**: VIP 1.5x, Premium 1.75x experience for work activities
  - **Daily Bonus Multipliers**: VIP 2x (+200 instead +100), Premium 5x (+500 instead +100)
  - **Server Limits**: VIP keeps 25, Premium gets 30 server slots
  - **Premium Exclusive Features**: Instant server construction, no mini-game cooldowns, secret admin reactions
  - **Profile Icons**: Animated status icons in dashboard (top-right) and player profiles showing VIP/Premium status
  - **Report Priority**: VIP/Premium get priority handling in support system
  - **Status Conflict Prevention**: VIP blocks Premium purchase, Premium blocks VIP purchase
  - **Admin Management**: Super-admin panel integration for subscription management
  - All visual badges display with correct priority: Super Admin > Admin > Premium > VIP
- **Migration to Replit Completed Successfully (August 20, 2025)**: Project successfully migrated from Replit Agent environment
  - All Node.js dependencies installed via packager tool (Express, React, Radix UI, TypeScript, etc.)
  - Server running smoothly on port 5000 with all API endpoints operational
  - Frontend Vite development server connected and functional
  - Background income system active with real-time data updates
  - User authentication, server management, and game features all working
  - Migration verified by user - project ready for continued development
- **Comprehensive Bug Fixes Completed (August 19, 2025)**: Fixed all major user experience issues
  - **Mini-Game XP Fix**: XP rewards from mini-games now properly trigger level-up animations and notifications with improved server response data
  - **Reports Mobile Optimization**: Fixed mobile layout with proper height constraints, infinite background scrolling, and red notification dots
  - **Player Profile Mobile**: Optimized mobile layout with responsive headers, text wrapping, and flexible card layouts
  - **Ban System Enhancement**: Users banned by admins now have all servers automatically turned offline and income generation stopped
  - **Daily Quests Progress**: Added proper progress bar showing time elapsed in 24-hour cycle alongside quest completion tracking
  - **Learning Completion Fix**: Learning blocks now disappear immediately at 99% without requiring page refresh
  - **Online Status Fix**: Users now correctly go offline after 5 minutes of inactivity (income updates no longer count as activity)
  - **Mobile UI Fix**: Chat button repositioned to not overlap with report submission on mobile devices
  - **Daily Quests Fix**: "Claim reward" buttons now update status immediately and only show loading for the specific quest being claimed
  - All fixes improve real-time user experience and eliminate interface blocking issues
- **Migration to Replit Re-Completed Successfully (August 19, 2025)**: Project successfully re-migrated from Replit Agent environment
  - All Node.js dependencies reinstalled via packager tool (Express, React, Radix UI, TypeScript, etc.)
  - Server running smoothly on port 5000 with all API endpoints operational
  - Frontend Vite development server connected and functional
  - Background income system active with real-time data updates
  - User authentication, server management, and game features all working
  - Migration verified by user - project ready for continued development
- **Migration to Replit Completed Successfully (August 18, 2025)**: Project fully migrated from Replit Agent environment
  - All Node.js dependencies installed via packager tool (Express, React, Radix UI, TypeScript, etc.)
  - Server running smoothly on port 5000 with all API endpoints operational
  - Frontend Vite development server connected and functional
  - Background income system active with real-time data updates
  - User authentication, server management, and game features all working
  - Migration verified by user - project ready for continued development
- **Critical Bug Fixes Completed (August 18, 2025)**: All major game functionality now working properly
  - **Fixed apiRequest function**: Corrected function signature to properly handle POST requests with data
  - **Daily Quest Rewards**: Quest reward claiming now works - money correctly added to user balance
  - **Server Management**: Fixed deletion and load adjustment functions using proper API mutations
  - **Server Functionality**: All server operations (delete, load adjustment, repair) now functional
  - All previously reported bugs have been resolved - game is fully operational
- **Migration Re-Verified (August 18, 2025)**: Successfully confirmed project migration from Replit Agent to standard Replit environment
  - All Node.js dependencies properly installed and functioning
  - Server running smoothly on port 5000 with all API endpoints operational
  - Background income system active and updating user balances automatically
  - Frontend React application connected via Vite with real-time data updates
  - Complete project functionality verified - ready for continued development
- **Mini-Game Fixes (August 18, 2025)**: Fixed critical mini-game bugs for improved user experience
  - **Wire Connection Game**: Removed success dialog popup - now only shows toast notification and auto-closes
  - **Cable/Port Bug**: Fixed mismatch where different numbers of cables and ports could be generated (now always equal 4-6)
  - **Firewall Filter Game**: Fixed interface disappearing after 10 answers - now properly shows completion state
  - **XP System**: Confirmed XP rewards work correctly for all mini-games except wire connection game (as intended)
  - All mini-games now function properly with improved user flow and no blocking interface issues
- **Migration Completed (August 18, 2025)**: Successfully migrated project from Replit Agent to standard Replit environment
  - Installed all Node.js dependencies via packager tool including Express, React, Radix UI components, and all development tools
  - Verified server startup and application functionality - server running on port 5000
  - All API endpoints operational (auth, stats, rankings, player data)
  - Frontend Vite server connected and serving React application
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