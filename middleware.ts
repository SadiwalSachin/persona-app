// middleware.ts

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// 👇 Protect /create-persona, /chat and any nested routes
const isProtectedRoute = createRouteMatcher([
  '/create-persona(.*)',
  '/chat(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()

  // Redirect to sign-in if route is protected and user is not signed in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn()
  }
})

// Still required: middleware config for matcher
export const config = {
  matcher: [
    // Run middleware on all non-static paths
    '/((?!_next|.*\\..*|favicon.ico).*)',
  ],
}
