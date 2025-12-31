import { createFileRoute, Link } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { getRecentTournaments, getUpcomingTournaments, getRecentPosts } from '@/lib/dashboard.server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  loader: async () => {
    const [recent, upcoming, posts] = await Promise.all([
      getRecentTournaments(),
      getUpcomingTournaments(),
      getRecentPosts(),
    ])

    return { recent, upcoming, posts }
  },
  component: Dashboard,
})

function Dashboard() {
  const { recent, upcoming, posts } = Route.useLoaderData()

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Welcome to BridgeServer</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your hub for duplicate bridge tournaments and community
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Tournaments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tournaments</CardTitle>
              <CardDescription>Past events</CardDescription>
            </CardHeader>
            <CardContent>
              {recent.length === 0 ? (
                <p className="text-sm text-gray-500">No recent tournaments</p>
              ) : (
                <div className="space-y-4">
                  {recent.map((tournament) => (
                    <Link
                      key={tournament.id}
                      to="/tournaments/$id"
                      params={{ id: tournament.id.toString() }}
                      className="block hover:bg-gray-50 p-3 rounded"
                    >
                      <div className="font-medium">{tournament.location?.name || 'Unknown Location'}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(tournament.date).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tournaments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tournaments</CardTitle>
              <CardDescription>Register now!</CardDescription>
            </CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming tournaments</p>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((tournament) => (
                    <Link
                      key={tournament.id}
                      to="/tournaments/$id"
                      params={{ id: tournament.id.toString() }}
                      className="block hover:bg-gray-50 p-3 rounded"
                    >
                      <div className="font-medium">{tournament.location?.name || 'Unknown Location'}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(tournament.date).toLocaleDateString()}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Blog Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-sm text-gray-500">No blog posts yet</p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to="/posts/$id"
                    params={{ id: post.id.toString() }}
                    className="block hover:bg-gray-50 p-3 rounded"
                  >
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-gray-600">
                      By {post.author?.fullName || 'Unknown'} on {new Date(post.date).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
