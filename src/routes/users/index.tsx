import { createFileRoute, Link } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { createServerFn } from '@tanstack/start/server'
import { db } from '@/lib/db'
import { users } from '@/models/schema'
import { desc } from 'drizzle-orm'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const getUsers = createServerFn({ method: 'GET' })
  .handler(async () => {
    // Simple pagination - start with first 50 users
    return await db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
      limit: 50,
    })
  })

export const Route = createFileRoute('/users/')({
  loader: async () => {
    const userList = await getUsers()
    return { users: userList }
  },
  component: UsersList,
})

function UsersList() {
  const { users } = Route.useLoaderData()

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Users</h1>
          <Link to="/users/create">
            <Button>New User</Button>
          </Link>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link
                        to="/users/$id"
                        params={{ id: user.id.toString() }}
                        className="text-primary-600 hover:underline"
                      >
                        {user.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  )
}
