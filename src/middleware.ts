import { type NextRequest, NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard', '/settings'];

// Define public routes (login must be here to prevent redirect loops)
const publicRoutes = ['/login','/',  '/register', '/about', '/contact'];

function isProtectedRoute(path: string): boolean {
  return protectedRoutes.some(route => path.startsWith(route));
}

function isPublicRoute(path: string): boolean {
  return publicRoutes.some(route => path.startsWith(route));
}

export function middleware(req: NextRequest): NextResponse {
  console.log('Middleware called for:', req.nextUrl.pathname);

  // Get the token from the cookies
  const token = req.cookies.get('token')?.value;

  // Check if the user is trying to access a protected route
  if (!token && isProtectedRoute(req.nextUrl.pathname) && !isPublicRoute(req.nextUrl.pathname)) {
    // If there's no token and it's a protected route, redirect to the login page
    // But first, check if we're already on the login page to prevent redirect loops
    if (req.nextUrl.pathname !== '/login') {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If there's a token or the route is public, continue
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};