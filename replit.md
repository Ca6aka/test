# Server Simulation Game

## Overview
A full-stack web application simulating a server management business game. Players manage virtual servers, generate income, complete learning courses, and engage in a gamified experience with integrated cryptocurrency payment system. The project aims to provide an engaging, educational, and financially rewarding simulation, leveraging modern web technologies for a robust and scalable platform, focusing on server management, economic simulation, gamified learning, real-time interaction, and premium subscriptions.

## User Preferences
- Preferred communication style: Simple, everyday language
- Language: Russian preferred for communication
- Uses Russian interface in the game

## Recent Changes (August 21, 2025)
### Homepage Updates
- Fixed React loading by resolving 20+ duplicate keys in language-context.jsx
- Added 4 language support (Russian, English, Ukrainian, German) with proper flag buttons
- Restored original statistics display: "Всего игроков", "Онлайн", "Серверов", "Общий баланс" 
- Changed testimonials from "отзывы игроков" to "отзывы тестеров"
- Replaced "Готовы начать?" section with "Рейтинг игроков" showing top 5 players
- Added Login/Register buttons in top-right header instead of single Login button
- Removed "Новая версия" banner from hero section
- Fixed setLanguage function error by using changeLanguage from language context
- Integrated real-time API data for statistics and player rankings

### Technical Improvements
- Enhanced session persistence with PostgreSQL-backed sessions for server restart resilience
- Extended session duration to 7 days with rolling expiration
- Added registration date display in player profiles with Russian date format
- Fixed language switching functionality with proper context methods
- Confirmed toast notifications working correctly with 5-second auto-dismiss

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter.
- **State Management**: TanStack Query for server state and caching.
- **UI Framework**: Radix UI components with shadcn/ui design system.
- **Styling**: Tailwind CSS with CSS variables for theming and responsiveness.
- **Build Tool**: Vite.
- **UI/UX Decisions**:
    - **Theming**: Comprehensive dark/light theme system with animated toggles and persistent preferences. Default is dark theme.
    - **Visual Indicators**: Difficulty-based colored circles for tutorial jobs (blue for easy, orange for medium, red for hard). Lock icons for level-restricted content.
    - **Notifications**: Auto-dismissing toast notifications.
    - **Tooltips**: Contextual tooltips for interactive elements.
    - **Admin Badges**: Distinct styling for super-admin (red gradient, pulse animation) and regular admin (gold gradient).
    - **Avatar System**: Regular users have static gradients; super-admin has unique rainbow-pulse animation.
    - **Responsiveness**: Mobile-first design with compact layouts, responsive typography, scrollable tabs, and optimized component rendering for smaller screens. Reduced particle animations and simplified blur effects for mobile performance. Full-screen PWA experience with proper viewport settings.
    - **Mobile Chat**: Optimized dimensions (288px width, 448px height) with improved message capacity (5-6 messages instead of 3).
    - **PWA Support**: Progressive Web App capabilities with manifest.json, service worker, install prompts, and custom app icons. Users can install the game as a desktop/mobile app shortcut for native app-like experience.
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
- **Performance Testing**: Comprehensive stress testing suite with 150 virtual players simulation, database stress tests, and health checks.

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL-backed storage (connect-pg-simple).
- **Security**: HTTP-only cookies with secure flags.
- **User Model**: Username/password authentication with hashed passwords. Case-insensitive username registration prevention.
- **Admin System**: Multi-level admin roles (super-admin, regular admin) with granular permissions for user management, message moderation, and money management. Super-admin has exclusive access to critical controls and cannot be managed by regular admins. Admin badges reflect status at the time of message sending.

### Game Logic Architecture
- **Server Mechanics**: Predefined server types with income, costs, and purchase prices. Automatic background income generation every minute for all users with active servers. Server overload checks every 5 minutes (90%+ load), with reduced shutdown probabilities. Server repair displays cost and durability.
- **Learning System**: Time-based courses unlocking capabilities and server slots.
- **Gamification**:
    - **Achievements System**: 5 progressive achievements with rewards.
    - **Daily Quests**: 3 challenges resetting every 24 hours.
- **Chat System**: Real-time general text chat with 100-message history, admin moderation (message deletion, user muting with expiration). VIP/Premium users have access to exclusive emoji reactions (VIP: ⭐💎🔥, Premium: 👑🌟✨), admin-only reactions visible to admins only (🛡️⚡⚔️).
- **Activity Tracking**: User action logging, real-time online status tracking (5-minute window) via API calls.
- **Tutorial System**: Guided onboarding with completion tracking.
- **Financial Tracking**: Accurate calculation of total earnings and total spent, with real-time balance updates in UI.
- **Payment System**: NOWPayments cryptocurrency integration with VIP (6 months/$20) and Premium (lifetime/$25) packages. Automated webhook processing with bonus distribution (balance, experience). Server slots earned through course progression: free users max 25 slots, VIP unlocks 30 slots, Premium unlocks 35 slots. VIP/Premium users have priority status in support reports with visual indicators and priority sorting. Prevents duplicate processing and includes clickable support contact links.

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