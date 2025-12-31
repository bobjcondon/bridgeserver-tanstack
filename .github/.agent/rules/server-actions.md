---
trigger: model_decision
description: When implementing Next.js Server Actions for data mutations
---

# Server Actions Rules

## Best Practices

### 1. File Organization

- Place Server Actions in separate files, not in page components
- Prefer: `app/actions/user.ts` or `app/user/actions.ts`
- Mark files with `'use server'` directive at the top

```tsx
'use server'

import { db } from '@/lib/db'
import { users } from '@/models/schema'
```

### 2. Validation

**ALWAYS validate input** using Valibot schemas:

```tsx
'use server'

import * as v from 'valibot'
import { db } from '@/lib/db'

const createUserSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  name: v.pipe(v.string(), v.minLength(1)),
})

export async function createUser(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries())

  // Validate
  const result = v.safeParse(createUserSchema, rawData)
  if (!result.success) {
    return {
      success: false,
      errors: result.issues.map(i => ({
        path: i.path?.map(p => p.key).join('.'),
        message: i.message,
      })),
    }
  }

  // Execute
  try {
    await db.insert(users).values(result.output)
    return { success: true }
  } catch (error) {
    return {
      success: false,
      errors: [{ message: 'Failed to create user' }],
    }
  }
}
```

### 3. Return Type Pattern

Use consistent return types for better type safety:

```tsx
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Array<{ path?: string; message: string }> }

export async function myAction(formData: FormData): Promise<ActionResult<User>> {
  // Implementation
}
```

### 4. Authentication & Authorization

Check authentication in Server Actions:

```tsx
'use server'

import { auth } from '@clerk/nextjs/server'

export async function deleteUser(userId: string) {
  const { userId: currentUserId } = await auth()

  if (!currentUserId) {
    return { success: false, errors: [{ message: 'Unauthorized' }] }
  }

  // Verify permissions
  if (currentUserId !== userId && !isAdmin(currentUserId)) {
    return { success: false, errors: [{ message: 'Forbidden' }] }
  }

  // Proceed with deletion
}
```

### 5. Revalidation

Use `revalidatePath` or `revalidateTag` after mutations:

```tsx
'use server'

import { revalidatePath } from 'next/cache'

export async function updateTournament(id: string, data: FormData) {
  // Update database
  await db.update(tournaments).set(data).where(eq(tournaments.id, id))

  // Revalidate affected pages
  revalidatePath('/tournaments')
  revalidatePath(`/tournaments/${id}`)

  return { success: true }
}
```

### 6. Error Handling

- Catch and handle database errors gracefully
- Never expose internal error details to clients
- Log errors server-side for debugging

```tsx
export async function myAction(formData: FormData) {
  try {
    // Action logic
  } catch (error) {
    console.error('Action failed:', error)
    return {
      success: false,
      errors: [{ message: 'An unexpected error occurred' }],
    }
  }
}
```

### 7. Type Safety

Leverage TypeScript for better DX:

```tsx
import type { InferOutput } from 'valibot'

const userSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  name: v.string(),
})

type UserInput = InferOutput<typeof userSchema>

export async function createUser(input: UserInput) {
  const validated = v.parse(userSchema, input)
  // validated is fully typed
}
```

## Testing Server Actions

```tsx
import { describe, test, expect } from 'bun:test'
import { createUser } from './actions'

describe('createUser', () => {
  test('creates user with valid data', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('name', 'Test User')

    const result = await createUser(formData)

    expect(result.success).toBe(true)
  })

  test('rejects invalid email', async () => {
    const formData = new FormData()
    formData.append('email', 'invalid')
    formData.append('name', 'Test User')

    const result = await createUser(formData)

    expect(result.success).toBe(false)
    expect(result.errors).toBeDefined()
  })
})
```

## Common Pitfalls

❌ **Don't**: Import Server Actions in client components without 'use server'
✅ **Do**: Mark Server Action files with 'use server' at the top

❌ **Don't**: Return sensitive data or internal errors
✅ **Do**: Return sanitized, user-friendly error messages

❌ **Don't**: Forget to revalidate after mutations
✅ **Do**: Use `revalidatePath` or `revalidateTag` after data changes

❌ **Don't**: Skip validation assuming client validation is enough
✅ **Do**: Always validate on the server for security
