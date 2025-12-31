'use client'

import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/tanstack-start'

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-primary-600">
              BridgeServer
            </Link>

            <div className="hidden md:flex gap-6">
              <Link
                to="/tournaments"
                className="text-gray-700 hover:text-primary-600"
              >
                Tournaments
              </Link>
              <Link
                to="/locations"
                className="text-gray-700 hover:text-primary-600"
              >
                Locations
              </Link>
              <Link
                to="/posts"
                className="text-gray-700 hover:text-primary-600"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn-primary">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link to="/registrations" className="text-gray-700 hover:text-primary-600">
                My Registrations
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}
