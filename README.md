# BridgeServer Tanstack

Bridgeserver is a fullstack application which serves as a web hub for a duplicate bridge club.

## Technology Stack

- **Runtime**: Bun
- **Framework**: Tanstack Start with Vite
- **Language**: TypeScript
- **Database**: Drizzle ORM + PGlite (dev) / Postgres (prod)
- **UI**: ShadCN components + Tailwind CSS v4
- **Forms**: Tanstack Form + Valibot validation
- **Auth**: Clerk
- **Testing**: Bun test

## Getting Started

### Prerequisites

- Bun installed (https://bun.sh)
- Clerk account with API keys (https://clerk.com)

### Installation

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your Clerk keys

# Push database schema
bun run db:push

# Seed database with test data (optional)
bun run seed
```

### Development

```bash
# Start dev server
bun dev

# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Open Drizzle Studio
bun run db:studio

# Lint code
bun run lint
```

The app will be available at http://localhost:3000

## Project Structure

```
src/
├── routes/              # Tanstack Start file-based routes
│   ├── __root.tsx      # App shell with Clerk provider
│   └── index.tsx       # Dashboard page
├── components/         # Reusable UI components
│   ├── ui/            # ShadCN components
│   ├── layout.tsx     # Main layout wrapper
│   └── navbar.tsx     # Navigation component
├── models/            # Database schema definitions
│   ├── schema.ts      # Drizzle tables and Valibot schemas
│   └── seed.ts        # Database seeding script
├── lib/               # Utility functions
│   ├── db.ts          # Database connection
│   ├── auth.server.ts # Clerk auth helpers
│   ├── dashboard.server.ts # Dashboard data fetching
│   └── utils.ts       # Utility functions
└── styles/
    └── app.css        # Tailwind v4 styles with @theme
```

## Features

- ✅ User management with 3 permission levels (user, director, admin)
- ✅ Clerk authentication integration
- ✅ Dashboard with recent/upcoming tournaments and blog posts
- ⏳ Tournament locations management (CRUD routes pending)
- ⏳ Tournament scheduling and management (CRUD routes pending)
- ⏳ Player registrations (CRUD routes pending)
- ⏳ Blog posts and announcements (CRUD routes pending)

## Database

Development uses PGlite (embedded Postgres in WASM) for zero-configuration local development. Production uses standard Postgres.

### Database Commands

```bash
# Generate migrations
bun run db:generate

# Push schema changes (development)
bun run db:push

# Open Drizzle Studio
bun run db:studio

# Seed database
bun run seed
```

## Current Status

**Phases Completed:**
- ✅ Phase 1: Project initialization and configuration
- ✅ Phase 2: Database setup with PGlite
- ✅ Phase 3: Clerk authentication integration
- ✅ Phase 4: Application shell (root route, layout, navbar)
- ✅ Phase 5: ShadCN UI components
- ✅ Phase 6: Dashboard page

**Next Steps:**
- Phase 7: Implement CRUD routes for all 5 database tables (users, locations, tournaments, registrations, posts)
- Phase 8: Testing setup
- Phase 9: Error handling and polish
- Phase 10: Final documentation

## Development Notes

- Database schema is defined in [src/models/schema.ts](src/models/schema.ts)
- All validation schemas are auto-generated from Drizzle tables using drizzle-valibot
- Tailwind CSS v4 uses new `@import` and `@theme` syntax in [src/styles/app.css](src/styles/app.css)
- Server functions use Tanstack Start patterns (not Next.js Server Actions)
