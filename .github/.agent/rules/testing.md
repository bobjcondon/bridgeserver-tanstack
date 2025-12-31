---
trigger: model_decision
description: When writing tests with Bun's test runner
---

# Testing Rules

## Test Runner

Use [Bun's built-in test runner](https://bun.sh/docs/cli/test) for all tests.

```bash
bun test                    # Run all tests
bun test --watch           # Watch mode
bun test path/to/test.ts   # Run specific test
```

## File Organization

- Place unit tests next to the code they test: `schema.test.ts` next to `schema.ts`
- Place integration tests in `src/tests/`
- Use `.test.ts` extension for all test files

## Test Structure

```tsx
import { describe, test, expect, beforeAll, afterAll } from 'bun:test'

describe('Feature name', () => {
  beforeAll(() => {
    // Setup before all tests in this describe block
  })

  afterAll(() => {
    // Cleanup after all tests
  })

  test('should do something specific', () => {
    // Arrange
    const input = 'test'

    // Act
    const result = processInput(input)

    // Assert
    expect(result).toBe('processed test')
  })
})
```

## Database Testing

### Use Pglite for Fast Test Database

```tsx
import { describe, test, expect, beforeAll, afterAll } from 'bun:test'
import { drizzle } from 'drizzle-orm/pglite'
import { PGlite } from '@electric-sql/pglite'
import * as schema from '@/models/schema'

describe('User model', () => {
  let db: ReturnType<typeof drizzle>
  let client: PGlite

  beforeAll(async () => {
    // Create in-memory test database
    client = new PGlite()
    db = drizzle(client, { schema })

    // Run migrations
    await migrate(db, { migrationsFolder: './drizzle' })
  })

  afterAll(async () => {
    await client.close()
  })

  test('creates user', async () => {
    const user = await db.insert(schema.users).values({
      email: 'test@example.com',
      name: 'Test User',
    }).returning()

    expect(user[0].email).toBe('test@example.com')
  })
})
```

### Test Transactions

```tsx
test('rolls back on error', async () => {
  await expect(async () => {
    await db.transaction(async (tx) => {
      await tx.insert(schema.users).values({ email: 'test@example.com', name: 'Test' })
      throw new Error('Simulated error')
    })
  }).toThrow()

  // Verify rollback
  const users = await db.select().from(schema.users)
  expect(users.length).toBe(0)
})
```

## Testing Server Actions

```tsx
import { describe, test, expect } from 'bun:test'
import { createUser } from './actions'

describe('createUser action', () => {
  test('creates user with valid data', async () => {
    const formData = new FormData()
    formData.append('email', 'test@example.com')
    formData.append('name', 'Test User')

    const result = await createUser(formData)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('test@example.com')
    }
  })

  test('rejects invalid email', async () => {
    const formData = new FormData()
    formData.append('email', 'invalid')
    formData.append('name', 'Test User')

    const result = await createUser(formData)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.errors.length).toBeGreaterThan(0)
    }
  })
})
```

## Testing React Components

Use `@testing-library/react` with Bun:

```tsx
import { describe, test, expect } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  test('renders user information', () => {
    render(<UserCard name="John Doe" email="john@example.com" />)

    expect(screen.getByText('John Doe')).toBeTruthy()
    expect(screen.getByText('john@example.com')).toBeTruthy()
  })
})
```

## Mocking

### Mock Functions

```tsx
import { mock } from 'bun:test'

test('calls callback', () => {
  const callback = mock(() => {})

  processWithCallback(callback)

  expect(callback).toHaveBeenCalledTimes(1)
})
```

### Mock Modules

```tsx
import { mock } from 'bun:test'

mock.module('@/lib/db', () => ({
  db: {
    query: {
      users: {
        findFirst: mock(() => ({ id: 1, email: 'test@example.com' })),
      },
    },
  },
}))
```

## Validation Schema Testing

```tsx
import { describe, test, expect } from 'bun:test'
import * as v from 'valibot'
import { createUserSchema } from '@/models/schema'

describe('User validation schema', () => {
  test('accepts valid data', () => {
    const data = {
      email: 'test@example.com',
      name: 'Test User',
    }

    const result = v.safeParse(createUserSchema, data)
    expect(result.success).toBe(true)
  })

  test('rejects invalid email', () => {
    const data = {
      email: 'not-an-email',
      name: 'Test User',
    }

    const result = v.safeParse(createUserSchema, data)
    expect(result.success).toBe(false)
  })

  test('rejects missing required fields', () => {
    const data = { email: 'test@example.com' }

    const result = v.safeParse(createUserSchema, data)
    expect(result.success).toBe(false)
  })
})
```

## Snapshot Testing

```tsx
import { describe, test, expect } from 'bun:test'

test('matches snapshot', () => {
  const result = generateComplexObject()
  expect(result).toMatchSnapshot()
})
```

## Performance Testing

```tsx
import { describe, test, expect } from 'bun:test'

test('completes within time limit', async () => {
  const start = performance.now()

  await expensiveOperation()

  const duration = performance.now() - start
  expect(duration).toBeLessThan(1000) // Should complete in less than 1 second
})
```

## Best Practices

1. ✅ **Write tests before or alongside code** (TDD approach)
2. ✅ **Test behavior, not implementation** - tests should survive refactoring
3. ✅ **Use descriptive test names** - "should create user with valid data"
4. ✅ **Follow AAA pattern**: Arrange, Act, Assert
5. ✅ **One assertion per test** when possible for clarity
6. ✅ **Use Pglite for database tests** - fast in-memory testing
7. ✅ **Clean up after tests** - use `afterAll` and `afterEach`
8. ✅ **Mock external dependencies** - keep tests isolated and fast
9. ✅ **Test edge cases and error conditions** - not just happy paths
10. ✅ **Ensure `bun test` passes before committing** (enforced by Husky)

## Coverage

```bash
bun test --coverage  # Generate coverage report
```

Aim for meaningful coverage, not 100% coverage for the sake of it.

## CI Integration

Tests run automatically via GitHub Actions on push and PR (see `.github/workflows/CI.yml`).

## References

- [Bun Test Runner](https://bun.sh/docs/cli/test)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
