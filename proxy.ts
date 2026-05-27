import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_APP_URL || 'http://localhost:4000';

/**
 * Proxy middleware to forward requests to the backend server
 * Handles API requests by forwarding them to the configured backend URL
 */
export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Only proxy API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Forward the request to backend
  const url = new URL(pathname, BACKEND_URL);
  url.search = request.nextUrl.search;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
