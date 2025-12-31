import { createServerFn } from '@tanstack/start/server'
import { db } from '@/lib/db'
import { tournaments, posts } from '@/models/schema'
import { desc, gte, lt } from 'drizzle-orm'

export const getRecentTournaments = createServerFn({ method: 'GET' })
  .handler(async () => {
    const now = new Date()

    return await db.query.tournaments.findMany({
      where: lt(tournaments.date, now),
      orderBy: [desc(tournaments.date)],
      limit: 5,
      with: {
        location: true,
      },
    })
  })

export const getUpcomingTournaments = createServerFn({ method: 'GET' })
  .handler(async () => {
    const now = new Date()

    return await db.query.tournaments.findMany({
      where: gte(tournaments.date, now),
      orderBy: [tournaments.date],
      limit: 5,
      with: {
        location: true,
      },
    })
  })

export const getRecentPosts = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await db.query.posts.findMany({
      orderBy: [desc(posts.date)],
      limit: 5,
      with: {
        author: {
          columns: {
            id: true,
            fullName: true,
          },
        },
      },
    })
  })
