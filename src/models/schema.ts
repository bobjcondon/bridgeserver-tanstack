import * as v from 'valibot';
import { sql } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// It automatically run the command `db-server:file`, which apply the migration before Next.js starts in development mode,
// Alternatively, if your database is running, you can run `npm run db:migrate` and there is no need to restart the server.

// Need a database for production? Just claim it by running `npm run neon:claim`.
// Tested and compatible with Next.js Boilerplate

// We use drizzle-valibot to generate valibot schemas from our Drizzle table definitions for type-safe data validation.

export const roleEnum = pgEnum('role', ['user', 'director', 'admin']);

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  clerkId: text('clerk_id').unique(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  fullName: text('full_name').generatedAlwaysAs(sql`first_name || ' ' || last_name`).notNull(),
  phone: text('phone'),
  address: text('address'),
  isPublic: boolean('is_public').default(false),
  role: roleEnum('role').default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Auto-generated schemas from Drizzle
export const insertUserSchema = createInsertSchema(users,
  {
    email: (schema) => v.pipe(
      v.optional(v.string(), ''),
      v.trim(),
      v.nonEmpty('Email is required'),
      v.email('Email is badly formatted.'),
    ),
    firstName: (schema) => v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'First name is required'),
    ),
    lastName: (schema) => v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, 'Last name is required'),
    ),
    phone: v.pipe(
      v.string(),
      v.trim(),
      v.regex(/^\d{3}[-.]\d{3}[-.]\d{4}$/, 'Please enter a valid phone number'),
    ),
    address: v.optional(
      v.pipe(
        v.string(),
        v.trim()
      ),
      ''
    ),
    isPublic: v.optional(v.boolean(), false),
    role: v.optional(v.picklist(['user', 'director', 'admin']), 'user'),
  }
);
export const selectUserSchema = createSelectSchema(users);
export type CreateUserFormInput = v.InferInput<typeof insertUserSchema>;
export type CreateUserFormOutput = v.InferOutput<typeof insertUserSchema>;

export const locations = pgTable('locations', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zip: text('zip').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Auto-generated schemas from Drizzle
export const insertLocationSchema = createInsertSchema(locations);
export const selectLocationSchema = createSelectSchema(locations);

// Location creation form schema with custom validations
export const createLocationFormSchema = v.object({
  name: v.pipe(
    v.string('Name is required'),
    v.trim(),
    v.minLength(1, 'Name is required')
  ),
  address: v.pipe(
    v.string('Address is required'),
    v.trim(),
    v.minLength(1, 'Address is required')
  ),
  city: v.pipe(
    v.string('City is required'),
    v.trim(),
    v.minLength(1, 'City is required')
  ),
  state: v.pipe(
    v.string('State is required'),
    v.trim(),
    v.minLength(2, 'State must be at least 2 characters'),
    v.maxLength(2, 'State must be 2 characters')
  ),
  zip: v.pipe(
    v.string('ZIP code is required'),
    v.trim(),
    v.regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code')
  ),
  description: v.optional(v.pipe(v.string(), v.trim()), ''),
});

export type CreateLocationFormInput = v.InferInput<typeof createLocationFormSchema>;
export type CreateLocationFormOutput = v.InferOutput<typeof createLocationFormSchema>;

export const tournaments = pgTable('tournaments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  date: timestamp('date').notNull(),
  locationId: integer('location_id').references(() => locations.id).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Auto-generated schemas from Drizzle
export const insertTournamentSchema = createInsertSchema(tournaments);
export const selectTournamentSchema = createSelectSchema(tournaments);

// Tournament creation form schema with custom validations
export const createTournamentFormSchema = v.object({
  date: v.pipe(
    v.string('Date is required'),
    v.trim(),
    v.minLength(1, 'Date is required')
  ),
  locationId: v.pipe(
    v.number('Location is required'),
    v.minValue(1, 'Please select a location')
  ),
  description: v.optional(v.pipe(v.string(), v.trim()), ''),
});

export type CreateTournamentFormInput = v.InferInput<typeof createTournamentFormSchema>;
export type CreateTournamentFormOutput = v.InferOutput<typeof createTournamentFormSchema>;

export const registrations = pgTable('registrations', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  tournamentId: integer('tournament_id').references(() => tournaments.id).notNull(),
  player1Id: integer('player1_id').references(() => users.id).notNull(),
  player2Id: integer('player2_id').references(() => users.id), // Nullable if looking for partner
  lookingForPartner: boolean('looking_for_partner').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Auto-generated schemas from Drizzle
export const insertRegistrationSchema = createInsertSchema(registrations);
export const selectRegistrationSchema = createSelectSchema(registrations);

// Registration creation form schema with custom validations
export const createRegistrationFormSchema = v.object({
  tournamentId: v.pipe(
    v.number('Tournament is required'),
    v.minValue(1, 'Please select a tournament')
  ),
  player1Id: v.pipe(
    v.number('Player 1 is required'),
    v.minValue(1, 'Please select player 1')
  ),
  player2Id: v.optional(v.number(), 0),
  lookingForPartner: v.optional(v.boolean(), false),
});

export type CreateRegistrationFormInput = v.InferInput<typeof createRegistrationFormSchema>;
export type CreateRegistrationFormOutput = v.InferOutput<typeof createRegistrationFormSchema>;

export const posts = pgTable('posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  authorId: integer('author_id').references(() => users.id).notNull(),
  date: timestamp('date').notNull().defaultNow(),
  tags: text('tags').array().notNull().default(sql`ARRAY[]::text[]`),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Auto-generated schemas from Drizzle
export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);

// Post creation form schema with custom validations
export const createPostFormSchema = v.object({
  title: v.pipe(
    v.string('Title is required'),
    v.trim(),
    v.minLength(1, 'Title is required'),
    v.maxLength(200, 'Title must be less than 200 characters')
  ),
  authorId: v.pipe(
    v.number('Author is required'),
    v.minValue(1, 'Please select an author')
  ),
  date: v.pipe(
    v.string('Date is required'),
    v.trim(),
    v.minLength(1, 'Date is required')
  ),
  tags: v.optional(v.array(v.string()), []),
  content: v.pipe(
    v.string('Content is required'),
    v.trim(),
    v.minLength(1, 'Content is required')
  ),
});

export type CreatePostFormInput = v.InferInput<typeof createPostFormSchema>;
export type CreatePostFormOutput = v.InferOutput<typeof createPostFormSchema>;

