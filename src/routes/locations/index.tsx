import { createFileRoute, Link } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { createServerFn } from '@tanstack/start/server'
import { db } from '@/lib/db'
import { locations } from '@/models/schema'
import { desc } from 'drizzle-orm'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const getLocations = createServerFn({ method: 'GET' })
  .handler(async () => {
    return await db.query.locations.findMany({
      orderBy: [desc(locations.createdAt)],
      limit: 50,
    })
  })

export const Route = createFileRoute('/locations/')({
  loader: async () => {
    const locationList = await getLocations()
    return { locations: locationList }
  },
  component: LocationsList,
})

function LocationsList() {
  const { locations } = Route.useLoaderData()

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Locations</h1>
          <Link to="/locations/create">
            <Button>New Location</Button>
          </Link>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No locations found
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <Link
                        to="/locations/$id"
                        params={{ id: location.id.toString() }}
                        className="text-primary-600 hover:underline"
                      >
                        {location.name}
                      </Link>
                    </TableCell>
                    <TableCell>{location.city}</TableCell>
                    <TableCell>{location.state}</TableCell>
                    <TableCell>{location.address}</TableCell>
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
