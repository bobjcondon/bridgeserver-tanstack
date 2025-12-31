import { createServerFn } from '@tanstack/start/server'
import { getAuth } from '@clerk/tanstack-start/server'
import { db } from '@/lib/db'
import { users } from '@/models/schema'
import { eq } from 'drizzle-orm'

export const getAuthUser = createServerFn({ method: 'GET' })
  .handler(async (ctx) => {
    const auth = await getAuth(ctx)
    const clerkId = auth?.userId

    if (!clerkId) {
      return { userId: null, user: null }
    }

    // Find user in database by Clerk ID
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId)
    })

    return { userId: clerkId, user }
  })

export const requireAuth = createServerFn({ method: 'GET' })
  .handler(async (ctx) => {
    const { userId } = await getAuthUser()

    if (!userId) {
      throw new Error('Unauthorized')
    }

    return userId
  })
