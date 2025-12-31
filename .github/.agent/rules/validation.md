---
trigger: model_decision
description: When implementing schema validation with Valibot and drizzle-valibot
---

# Valibot Validation Rules

## Core Principles

1. **Single source of truth**: Derive validation schemas from Drizzle schemas using `drizzle-valibot`
2. **Type safety**: Use `InferOutput` and `InferInput` for full TypeScript support
3. **Consistent validation**: Use the same schemas client and server-side

## Deriving Schemas from Drizzle

```tsx
// src/models/schema.ts
import { pgTable, text, serial } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-valibot'
import * as v from 'valibot'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
})

// Auto-generated schemas
export const insertUserSchema = createInsertSchema(users)
export const selectUserSchema = createSelectSchema(users)

// Refine for specific use cases
export const createUserSchema = v.omit(insertUserSchema, ['id']) // Omit id for creation
export const updateUserSchema = v.partial(createUserSchema) // Make all fields optional
```

## Common Validation Patterns

### Email Validation

```tsx
import * as v from 'valibot'

const emailSchema = v.pipe(
  v.string('Email must be a string'),
  v.trim(),
  v.email('Invalid email format')
)
```

### Password Validation

```tsx
const passwordSchema = v.pipe(
  v.string('Password must be a string'),
  v.minLength(8, 'Password must be at least 8 characters'),
  v.regex(/[A-Z]/, 'Password must contain an uppercase letter'),
  v.regex(/[a-z]/, 'Password must contain a lowercase letter'),
  v.regex(/[0-9]/, 'Password must contain a number')
)
```

### URL Validation

```tsx
const urlSchema = v.pipe(
  v.string(),
  v.url('Must be a valid URL')
)
```

### Date Validation

```tsx
const dateSchema = v.pipe(
  v.string(),
  v.isoDate('Must be a valid ISO date')
)

// Or for Date objects
const dateObjectSchema = v.pipe(
  v.date(),
  v.minValue(new Date('2024-01-01'), 'Date must be after 2024')
)
```

### Enum Validation

```tsx
const roleSchema = v.picklist(['admin', 'user', 'guest'])
```

### Number Ranges

```tsx
const ageSchema = v.pipe(
  v.number('Age must be a number'),
  v.minValue(18, 'Must be at least 18'),
  v.maxValue(120, 'Must be less than 120')
)
```

### Custom Validation

```tsx
const usernameSchema = v.pipe(
  v.string(),
  v.minLength(3),
  v.maxLength(20),
  v.regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed')
)
```

## Nested Objects

```tsx
const addressSchema = v.object({
  street: v.string(),
  city: v.string(),
  state: v.pipe(v.string(), v.length(2)),
  zip: v.pipe(v.string(), v.regex(/^\d{5}$/)),
})

const userWithAddressSchema = v.object({
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
  address: addressSchema,
})
```

## Arrays

```tsx
const tagsSchema = v.pipe(
  v.array(v.string()),
  v.minLength(1, 'At least one tag required'),
  v.maxLength(5, 'Maximum 5 tags allowed')
)
```

## File Validation

```tsx
const avatarSchema = v.pipe(
  v.file('Avatar is required'),
  v.mimeType(['image/jpeg', 'image/png', 'image/webp'], 'Only images allowed'),
  v.maxSize(1024 * 1024 * 2, 'File must be less than 2MB')
)
```

## Conditional Validation

```tsx
import { is } from 'valibot'

const formSchema = v.pipe(
  v.object({
    type: v.picklist(['individual', 'business']),
    name: v.string(),
    businessName: v.optional(v.string()),
    taxId: v.optional(v.string()),
  }),
  v.check((data) => {
    if (data.type === 'business' && !data.businessName) {
      return false
    }
    return true
  }, 'Business name is required for business accounts')
)
```

## Async Validation

For checking uniqueness or external validations:

```tsx
const uniqueEmailSchema = v.pipeAsync(
  v.string(),
  v.email(),
  v.checkAsync(async (email) => {
    const exists = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    return !exists
  }, 'Email already exists')
)
```

## Error Handling

### Safe Parse Pattern

```tsx
import * as v from 'valibot'

const result = v.safeParse(userSchema, data)

if (result.success) {
  // result.output has validated data
  const user = result.output
} else {
  // result.issues has validation errors
  const errors = result.issues.map(issue => ({
    path: issue.path?.map(p => p.key).join('.'),
    message: issue.message,
  }))
}
```

### Custom Error Messages

```tsx
const schema = v.object({
  email: v.pipe(
    v.string('Email is required'),
    v.email('Please enter a valid email address')
  ),
  age: v.pipe(
    v.number('Age must be a number'),
    v.minValue(18, 'You must be at least 18 years old')
  ),
})
```

## Testing Validation

```tsx
import { describe, test, expect } from 'bun:test'
import * as v from 'valibot'
import { createUserSchema } from '@/models/schema'

describe('User validation', () => {
  test('accepts valid user data', () => {
    const data = {
      email: 'test@example.com',
      name: 'Test User',
    }

    const result = v.safeParse(createUserSchema, data)
    expect(result.success).toBe(true)
  })

  test('rejects invalid email', () => {
    const data = {
      email: 'invalid-email',
      name: 'Test User',
    }

    const result = v.safeParse(createUserSchema, data)
    expect(result.success).toBe(false)
  })
})
```

## Type Inference

```tsx
import type { InferOutput, InferInput } from 'valibot'

// Infer types from schemas
type User = InferOutput<typeof selectUserSchema>
type CreateUserInput = InferInput<typeof createUserSchema>
type UpdateUserInput = InferInput<typeof updateUserSchema>
```

## Best Practices

1. ✅ **Always use `safeParse`** for form validation to handle errors gracefully
2. ✅ **Use `parse`** only when you're certain the data is valid (e.g., internal operations)
3. ✅ **Derive schemas from Drizzle** for consistency between DB and validation
4. ✅ **Provide clear error messages** that help users fix issues
5. ✅ **Validate on both client and server** for UX and security
6. ✅ **Use `pipe`** for composing multiple validations clearly
7. ✅ **Test your validation schemas** to ensure they work as expected

## References

- [Valibot Documentation](https://valibot.dev)
- [drizzle-valibot Integration](https://orm.drizzle.team/docs/zod)
