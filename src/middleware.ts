import { type NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest): NextResponse {
  console.log('Middleware called for:', req.nextUrl.pathname);

  // Get the token from the cookies
  const token = req.cookies.get('token')?.value;

  // Check if the user is trying to access a protected route
  if (!token && (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/settings'))) {
    // If there's no token, redirect to the login page
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If there's a token or the route is not protected, continue
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  // matcher: ['/dashboard', '/dashboard/:path*', '/settings', '/settings/:path*']
  matcher: ['/settings', '/settings/:path*']
};