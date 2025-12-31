/**
 * Unit tests for DB schema operations.
 * Run using [bun test runner](https://bun.com/docs/test)
 * See [writing tests](https://bun.com/docs/test/writing-tests)
 *
 * Each of our models uses drizzle-zod to generate zod schemas for type-safe validation.
 */
import { expect, test } from 'bun:test';

import { eq } from 'drizzle-orm';
import { parse } from 'valibot';
import { Valimock } from 'valimock';
import { db } from '@/lib/db';
import { insertUserSchema, users } from './schema';

test(`valimock generate`, async () => {
  const result = new Valimock().mock(insertUserSchema);

  expect(parse(insertUserSchema, result)).toStrictEqual(result);
});

test('User insert, update, delete', async () => {
  const user = {
    firstName: 'John',
    lastName: 'User',
    email: 'JohnUser@gmail.com',
    displayName: 'JohnU',
    role: 'user',
    phone: '555-1234',
    address: '123 Main St',
    isPublic: true,
  };

  const parsedUser = parse(insertUserSchema, user);
  const insertedUsers = await db.insert(users).values(parsedUser).returning();
  const id = insertedUsers[0]!.id;

  expect(insertedUsers[0]?.fullName).toBe('John User');

  const fetchedUsers = await db.select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  expect(fetchedUsers.length).toBe(1);

  await db.update(users)
    .set({ address: '456 Elm St' })
    .where(eq(users.id, id));

  const deletedUsers = await db.delete(users)
    .where(eq(users.id, id))
    .returning();

  expect(deletedUsers.length).toBe(1);
  expect(deletedUsers[0]!.address).toBe('456 Elm St');
});
