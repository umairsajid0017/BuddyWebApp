import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/settings", "/services", "/bookings"];
const PUBLIC_ROUTES = ["/login", "/register", "/about", "/contact", "/register/verify-otp", "/assets"];
const LOGIN_URL = "/login";
const HOME_URL = "/";

const matchesPattern = (path: string, patterns: string[]): boolean =>
  patterns.some((pattern) => path.startsWith(pattern));

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  console.log("Pathname:", pathname);
  console.log("Is Public Route:", matchesPattern(pathname, PUBLIC_ROUTES));
  // Allow access to public routes
  if (matchesPattern(pathname, PUBLIC_ROUTES)) {
    return NextResponse.next();
  }

  // Redirect to dashboard if logged in user tries to access login page
  if (token && pathname === LOGIN_URL) {
    return NextResponse.redirect(new URL(HOME_URL, req.url));
  }

  // Redirect to login if unauthenticated user tries to access protected route
  if (!token && matchesPattern(pathname, PROTECTED_ROUTES)) {
    return NextResponse.redirect(new URL(HOME_URL, req.url));
  }

  // Allow the request to continue for authenticated users or non-protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
