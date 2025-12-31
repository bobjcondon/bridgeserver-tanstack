# BridgeServer TODO - AI Agent Guide

## Current Project Status

**Overall Progress: ~65% Complete**

The BridgeServer Tanstack Start application has been partially implemented with a solid foundation in place. The configuration, authentication, UI components, and 2 out of 5 CRUD table implementations are complete.

---

## ✅ Completed Tasks

### Phase 1: Project Initialization (100% Complete)
- [x] Created `package.json` with all dependencies (Tanstack Start, Drizzle, Clerk, ShadCN, Valibot)
- [x] Configured `tsconfig.json` with path aliases (`@/*`)
- [x] Configured `vite.config.ts` with Tanstack Router plugin and Tailwind v4
- [x] Configured `app.config.ts` for Tanstack Start
- [x] Created `src/styles/app.css` with Tailwind v4 `@import` and `@theme` directives
- [x] Installed all dependencies with `bun install`

### Phase 2: Database Setup (100% Complete)
- [x] Created `src/lib/db.ts` with PGlite/Postgres connection switching
- [x] Created `drizzle.config.ts` for Drizzle Kit
- [x] Database schema already exists in `src/models/schema.ts` (5 tables: users, locations, tournaments, registrations, posts)
- [x] Seed script exists at `src/models/seed.ts`

### Phase 3: Authentication Setup (100% Complete)
- [x] Updated `.env` from Next.js to Tanstack Start variables (changed `NEXT_PUBLIC_*` to `VITE_*`)
- [x] Created `.env.example` template
- [x] Created `src/lib/auth.server.ts` with Clerk auth server functions

### Phase 4: Application Shell (100% Complete)
- [x] Created `src/routes/__root.tsx` - Root route with ClerkProvider
- [x] Created `src/components/layout.tsx` - Main layout wrapper
- [x] Created `src/components/navbar.tsx` - Navigation with auth buttons

### Phase 5: ShadCN UI Components (100% Complete)
- [x] Created `src/lib/utils.ts` - Utility functions (cn helper)
- [x] Created `src/components/ui/button.tsx`
- [x] Created `src/components/ui/card.tsx`
- [x] Created `src/components/ui/table.tsx`
- [x] Created `src/components/ui/input.tsx`
- [x] Created `src/components/ui/label.tsx`
- [x] Created `src/components/ui/select.tsx`
- [x] Created `src/components/ui/checkbox.tsx`
- [x] Created `src/components/ui/textarea.tsx`

### Phase 6: Dashboard Page (100% Complete)
- [x] Created `src/lib/dashboard.server.ts` - Dashboard data fetching functions
- [x] Created `src/routes/index.tsx` - Dashboard displaying tournaments and posts

### Phase 7: CRUD Routes (40% Complete - 2 of 5 tables done)

#### Users CRUD (✅ Complete)
- [x] Created `src/routes/users/index.tsx` - List users with table
- [x] Created `src/routes/users/create.tsx` - Create user form
- [x] Created `src/routes/users/$id.tsx` - Edit/delete user

#### Locations CRUD (✅ Complete)
- [x] Created `src/routes/locations/index.tsx` - List locations
- [x] Created `src/routes/locations/create.tsx` - Create location form
- [x] Created `src/routes/locations/$id.tsx` - Edit/delete location

### Documentation (100% Complete)
- [x] Updated `README.md` with current status and setup instructions
- [x] Created `.env.example` with all required variables

---

## 🔨 Next Steps - PRIORITY ORDER

### IMMEDIATE: Complete Remaining CRUD Routes (Phase 7)

The pattern is established. Each remaining table needs 3 route files following the Users/Locations pattern.

#### 1. Tournaments CRUD (⏳ TODO - 3 files)

**Key difference**: Tournaments have a foreign key to Locations, so the create/edit forms need a dropdown.

**Files to create:**
- [ ] `src/routes/tournaments/index.tsx`
  - List tournaments with date, location name, description
  - Query: Join with locations table to display location name

- [ ] `src/routes/tournaments/create.tsx`
  - Form fields: date (date input), locationId (select dropdown), description (textarea)
  - **Important**: Fetch all locations in loader to populate dropdown
  - Use `createTournamentFormSchema` from schema.ts
  - Example loader:
    ```typescript
    loader: async () => {
      const locations = await db.query.locations.findMany()
      return { locations }
    }
    ```

- [ ] `src/routes/tournaments/$id.tsx`
  - Same as create, but populate with existing tournament data
  - Join with location to display current selection

**Schema reference**: `src/models/schema.ts` lines 125-152
- `date: timestamp` (required)
- `locationId: integer` (required, FK to locations)
- `description: text` (optional)

---

#### 2. Registrations CRUD (⏳ TODO - 3 files)

**Key difference**: Registrations have foreign keys to both tournaments AND users, plus a boolean flag.

**Files to create:**
- [ ] `src/routes/registrations/index.tsx`
  - List registrations with tournament, player1, player2, lookingForPartner status
  - Query: Join with tournaments and users tables
  - Display format: "Tournament @ Location - Player1 [+ Player2 | Looking for partner]"

- [ ] `src/routes/registrations/create.tsx`
  - Form fields:
    - `tournamentId` (select dropdown - fetch tournaments)
    - `player1Id` (select dropdown - fetch users)
    - `player2Id` (optional select dropdown - fetch users)
    - `lookingForPartner` (checkbox)
  - **Important**: Fetch both tournaments and users in loader
  - Use `createRegistrationFormSchema` from schema.ts

- [ ] `src/routes/registrations/$id.tsx`
  - Same as create, but populate with existing registration data

**Schema reference**: `src/models/schema.ts` lines 154-182
- `tournamentId: integer` (required, FK to tournaments)
- `player1Id: integer` (required, FK to users)
- `player2Id: integer` (nullable, FK to users)
- `lookingForPartner: boolean` (default false)

---

#### 3. Posts CRUD (⏳ TODO - 3 files)

**Key difference**: Posts have a foreign key to users (author), plus a tags array field.

**Files to create:**
- [ ] `src/routes/posts/index.tsx`
  - List posts with title, author name, date, tags
  - Query: Join with users table to get author fullName

- [ ] `src/routes/posts/create.tsx`
  - Form fields:
    - `title` (input, max 200 chars)
    - `authorId` (select dropdown - fetch users, or use current user from auth)
    - `date` (date input)
    - `tags` (array input - can start with comma-separated text input)
    - `content` (textarea, required)
  - Use `createPostFormSchema` from schema.ts
  - **Tag handling**: Simple approach - single input field, split by commas

- [ ] `src/routes/posts/$id.tsx`
  - Same as create, but populate with existing post data
  - Tags: Join array back to comma-separated string for editing

**Schema reference**: `src/models/schema.ts` lines 184-224
- `title: text` (required, max 200 chars)
- `authorId: integer` (required, FK to users)
- `date: timestamp` (required)
- `tags: text[]` (array, default empty)
- `content: text` (required)

---

### SECONDARY: Testing & Polish (Phase 8-9)

#### 4. Error Handling (⏳ TODO - 2 files)

- [ ] Create `src/components/error-boundary.tsx`
  - React error boundary component
  - Displays user-friendly error messages
  - Provides "Try again" button

- [ ] Create `src/components/loading.tsx`
  - Loading spinner component
  - Used during async operations

- [ ] Create `src/routes/_404.tsx`
  - 404 Not Found page
  - "Go Home" button

---

#### 5. Testing Setup (⏳ TODO - 2 files)

- [ ] Create `src/tests/setup.ts`
  - Test database utilities using PGlite
  - Helper functions: `createTestDb()`, `cleanupTestDb()`

- [ ] Create `src/routes/users/users.test.ts`
  - Example tests for Users CRUD operations
  - Test: create user, update user, delete user
  - Validates Valibot schemas work correctly

---

#### 6. Final Verification (⏳ TODO)

- [ ] Run database migrations: `bun run db:push`
- [ ] Seed database with test data: `bun run seed`
- [ ] Start dev server: `bun dev`
- [ ] Manual testing checklist:
  - [ ] Dashboard loads and displays data
  - [ ] Users CRUD: Create, list, edit, delete
  - [ ] Locations CRUD: Create, list, edit, delete
  - [ ] Tournaments CRUD: Create with location dropdown, list, edit, delete
  - [ ] Registrations CRUD: Create with dropdowns, list, edit, delete
  - [ ] Posts CRUD: Create with tags, list, edit, delete
  - [ ] Authentication: Sign in, sign out
  - [ ] Navigation: All navbar links work
  - [ ] Form validation: Submit invalid data, check error messages
- [ ] Run tests: `bun test`
- [ ] Run linter: `bun run lint`
- [ ] Verify build: `bun run build`

---

## 📁 File Structure Reference

```
src/
├── routes/
│   ├── __root.tsx              ✅ Root with ClerkProvider
│   ├── index.tsx               ✅ Dashboard
│   ├── users/
│   │   ├── index.tsx           ✅ Users list
│   │   ├── create.tsx          ✅ Create user
│   │   └── $id.tsx             ✅ Edit/delete user
│   ├── locations/
│   │   ├── index.tsx           ✅ Locations list
│   │   ├── create.tsx          ✅ Create location
│   │   └── $id.tsx             ✅ Edit/delete location
│   ├── tournaments/            ⏳ TODO (3 files)
│   ├── registrations/          ⏳ TODO (3 files)
│   ├── posts/                  ⏳ TODO (3 files)
│   └── _404.tsx                ⏳ TODO
├── components/
│   ├── ui/                     ✅ All ShadCN components
│   ├── layout.tsx              ✅ Main layout
│   ├── navbar.tsx              ✅ Navigation
│   ├── error-boundary.tsx      ⏳ TODO
│   └── loading.tsx             ⏳ TODO
├── lib/
│   ├── db.ts                   ✅ Database connection
│   ├── auth.server.ts          ✅ Clerk auth
│   ├── dashboard.server.ts     ✅ Dashboard data
│   └── utils.ts                ✅ Utilities
├── models/
│   ├── schema.ts               ✅ Database schema (existing)
│   └── seed.ts                 ✅ Seed script (existing)
├── styles/
│   └── app.css                 ✅ Tailwind v4 styles
└── tests/
    └── setup.ts                ⏳ TODO
```

---

## 🎯 Code Patterns to Follow

### Pattern 1: List Route (index.tsx)

```typescript
import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start/server'
import { db } from '@/lib/db'
import { tableName } from '@/models/schema'

const getItems = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await db.query.tableName.findMany({
      // Add 'with' for relations
      orderBy: [desc(tableName.createdAt)],
      limit: 50,
    })
  })

export const Route = createFileRoute('/tableName/')({
  loader: async () => {
    const items = await getItems()
    return { items }
  },
  component: ItemsList,
})
```

### Pattern 2: Create Route (create.tsx)

```typescript
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import { createServerFn } from '@tanstack/start/server'

const createAction = createServerFn({ method: 'POST' })
  .validator((data) => v.parse(schema, data))
  .handler(async ({ data }) => {
    const [item] = await db.insert(table).values(data).returning()
    return { success: true, item }
  })

// Form with Tanstack Form + Valibot validation
// Button labeled "Add"
```

### Pattern 3: Edit/Delete Route ($id.tsx)

```typescript
// Similar to create, but:
// - Loader fetches existing item by ID
// - Form populated with existing values
// - "Save" button (disabled when not dirty)
// - "Delete" button (confirms if dirty)
// - Navigate back to list on success
```

---

## 💡 Tips for AI Agents

1. **Foreign Key Dropdowns**: When a table has a FK, you MUST fetch the related table in the loader and populate a `<Select>` dropdown. See Users and Locations for reference pattern.

2. **Validation Schemas**: All schemas are already defined in `src/models/schema.ts`. Use:
   - `insertTableNameSchema` for basic validation
   - `createTableNameFormSchema` for custom form validation
   - Import the types: `CreateTableNameFormInput`

3. **Server Functions**: Use `createServerFn` from `@tanstack/start/server`, NOT Next.js Server Actions.

4. **Date Inputs**: HTML `<input type="date">` returns YYYY-MM-DD string. Convert to Date object before submitting to DB.

5. **Array Fields** (like tags): Simple approach for MVP - use comma-separated text input, split/join in form submit handler.

6. **Error Messages**: Always check `field.state.meta.errors` and display the first error below each field.

7. **Navigation**: Use `navigate({ to: '/path' })` from Tanstack Router, not Next.js `router.push()`.

8. **Drizzle Relations**: In the schema, relations are defined. Use `with: { relationName: true }` in queries to include related data.

---

## 🚀 Quick Start Commands

```bash
# Install dependencies (if needed)
bun install

# Push schema to database
bun run db:push

# Seed database with test data
bun run seed

# Start development server
bun dev

# Run tests
bun test

# Open Drizzle Studio (database GUI)
bun run db:studio
```

---

## 📊 Progress Tracking

**Total Tasks**: 23
**Completed**: 15 (65%)
**Remaining**: 8 (35%)

**Breakdown by Phase**:
- Phase 1-6: ✅ 100% Complete
- Phase 7 (CRUD): ⏳ 40% Complete (2 of 5 tables)
- Phase 8-9 (Testing/Polish): ⏳ 0% Complete
- Phase 10 (Final Verification): ⏳ 0% Complete

**Estimated Remaining Work**:
- 9 route files (3 tables × 3 files each)
- 4 component files (error boundary, loading, 404, tests)
- Final testing and verification

---

## 📝 Notes

- The existing database schema in `src/models/schema.ts` is comprehensive and includes all validation
- PGlite is configured for local development (no separate DB server needed)
- Clerk authentication is set up but user sync on signup is not yet implemented
- All forms use Tanstack Form with Valibot validation (consistent pattern)
- Tailwind CSS v4 with custom theme colors defined in `src/styles/app.css`

---

**Last Updated**: 2024-12-30
**Project**: BridgeServer Tanstack Start
**Status**: Foundation complete, CRUD routes in progress
