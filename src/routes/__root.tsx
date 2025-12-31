import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ClerkProvider } from '@clerk/tanstack-start'
import { getAuthUser } from '@/lib/auth.server'
import '@/styles/app.css'

export const Route = createRootRoute({
  beforeLoad: async () => {
    const { userId, user } = await getAuthUser()
    return { userId, user }
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>BridgeServer - Duplicate Bridge Club Management</title>
        </head>
        <body className="min-h-screen bg-gray-50">
          <Outlet />
        </body>
      </html>
    </ClerkProvider>
  )
}
