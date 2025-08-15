# Overview

Promospedia is a nostalgic encyclopedia web application dedicated to preserving and cataloging Mexican promotional items and collectibles. The platform focuses on famous promotional campaigns from Mexican brands like Sabritas, Gamesa, Barcel, Bimbo, Marinela, and Vualá, featuring iconic items such as Tazos, stickers, spinners, and Funki Punky collectibles. The application serves as a comprehensive database where users can explore brands, their promotional campaigns, and individual collectible items with detailed information including rarity levels and historical context.

## Recent Changes (August 2025)
- **Space-Optimized Card Layout**: Reduced wrapper photo container size from 224px x 256px to 80px x 96px for better space utilization while maintaining visual impact
- **Comprehensive Editing System**: Implemented full content management functionality with edit mode toggle, allowing inline editing of promotion details, image rotation, content deletion, and persistent changes through PostgreSQL database
- **Database Integration**: Added DatabaseStorage class with complete CRUD operations for brands, promotions, and promotion items, enabling persistent editing capabilities
- **API Enhancement**: Extended REST API with PUT/DELETE endpoints for all entity types, supporting real-time content updates

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built using React 18 with TypeScript and follows a modern component-based architecture. The application uses Vite as the build tool and development server, providing fast hot module replacement and optimized builds. The routing system is implemented using Wouter, a lightweight client-side router.

The UI framework is based on shadcn/ui components built on top of Radix UI primitives, providing a consistent and accessible design system. Tailwind CSS handles styling with custom CSS variables for theme management, supporting both light and dark modes. The design system uses a custom color palette centered around yellow (#FFD700) as the primary brand color.

State management is handled through TanStack Query (React Query) for server state management, providing caching, background updates, and optimistic updates. The application follows a hook-based pattern for data fetching and state management.

## Backend Architecture
The backend is built using Express.js with TypeScript, following a RESTful API design pattern. The server implements middleware for JSON parsing, URL encoding, request logging, and error handling. The application uses a modular route structure with separate route handlers for different entity types.

The server includes a custom logging system that tracks API requests with response times and status codes. Error handling is centralized through Express middleware that standardizes error responses and provides appropriate HTTP status codes.

## Data Storage Solutions
The application uses a dual storage approach:
- **Development/Demo**: In-memory storage implementation with pre-seeded data representing authentic Mexican promotional campaigns
- **Production**: PostgreSQL database with Drizzle ORM for type-safe database operations

The database schema includes three main entities:
- **Brands**: Store brand information including name, slug, description, primary color, and founding year
- **Promotions**: Campaign information linked to brands with categories, date ranges, and descriptions
- **Promotion Items**: Individual collectible items with rarity levels, item numbers, and flexible metadata storage

Drizzle ORM provides type-safe database queries and automatic TypeScript type generation from the schema. The schema uses UUID primary keys and includes proper foreign key relationships between entities.

## Authentication and Authorization
Currently, the application does not implement user authentication or authorization mechanisms. The API endpoints are publicly accessible, focusing on read-only operations for browsing the promotional item catalog.

## Build and Deployment Strategy
The application uses a monorepo structure with shared TypeScript schemas between frontend and backend. The build process creates optimized static assets for the frontend and bundles the backend into a single executable file using esbuild.

Development workflow includes:
- Separate development servers for frontend (Vite) and backend (tsx)
- Shared TypeScript configuration with path mapping
- Hot module replacement for rapid development
- Type checking across the entire codebase

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL-compatible serverless database service for production data storage
- **Drizzle ORM**: Type-safe database toolkit providing schema definitions, migrations, and query building

## UI and Styling
- **Radix UI**: Comprehensive collection of accessible, unstyled UI primitives for building the component system
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling
- **Lucide React**: Icon library providing scalable vector icons
- **shadcn/ui**: Pre-built component library built on Radix UI with Tailwind CSS styling

## Development and Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **React**: Frontend library for building user interfaces
- **TypeScript**: Type-safe JavaScript development
- **Wouter**: Lightweight client-side routing library
- **TanStack Query**: Powerful data synchronization library for server state management

## Runtime and Deployment
- **Node.js**: JavaScript runtime for the backend server
- **Express.js**: Web application framework for building REST APIs
- **Replit**: Cloud development and hosting platform with integrated development environment