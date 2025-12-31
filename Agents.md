# AI Agent Context: Bridgeserver Bun

This document provides a high-level overview of the `bridgeserver-bun` project, intended to help AI agents understand the codebase, architecture, and conventions.

## Project Overview

**Bridgeserver** is a fullstack web application serving as a hub for a duplicate bridge club. It manages users, tournaments, locations, and registrations.

## Technology Stack

- **Runtime**: [Bun](https://bun.sh) (Package manager, test runner, bundler)
- **Framework**: [Tanstack Start](https://tanstack.com/start/latest) (Tanstack Start with Vite)
- **Build**: [Vite](https://vite.dev/guide)
- **Language**: TypeScript
- **Database**: @.github/.agent/rules/database.md
- **UI**:
  - [Tanstack Form](https://ui.shadcn.com/docs/forms/tanstack-form) with ShadCN, valibot, tanstack start
  - [ShadCn](https://www.shadcn.com) (Component library)
- **Authentication**: [Clerk](https://clerk.com)
- **Schema Validation**: [Valibot](https://valibot.dev) [drizzle-valibon](https://orm.drizzle.team/docs/valibot)
- **Source Control**: git
- **Styling**:  @.github/.agent/tailwind.md
- **Testing**: run tests with `bun test`.
  - Ensure `bun test` passes before committing 

## Project Structure

- use standard tanstack start directory structure.
- `src/components/`: Reusable UI components.
  - Prefer using shadcn components wrapped or customized here.
- `src/models/`: Database schema definitions.
  - Source of truth for data models.
  - `schema.ts` exports tables: `users`, etc.
  - `seed.ts` drizzle seeding of db
    - uses drizzle-valibot to geneate schema validations
  - `models.test.ts` unit tests of basic schema function
- `src/lib/`: Utility functions and shared logic.
  - `db.ts`: Database connection logic (switches between Postgres and Pglite).
- `docs/`: Project documentation.
- `src/tests/`: Test files (Bun test runner).

## Development Workflow

1. **Install**: `bun install`
2. **Dev Server**: `bun dev`
3. **Database Studio**: `bun drizzle-kit studio`
4. **Seed Data**: `bun run seed`
5. **Test**: `bun test`
6. **Lint**: `bun run lint`
