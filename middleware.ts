import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to handle authentication and user sessions with Supabase
 * This runs on every request to manage auth state
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req: request, res: response })
  
  // Refresh session if expired - required for server components
  await supabase.auth.getSession()
  
  return response
}

// Optional: Configure middleware to run on specific paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
