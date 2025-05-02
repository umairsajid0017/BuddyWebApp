import { type NextRequest, NextResponse } from "next/server";
import { LoginType } from "./constants/constantValues";

const PROTECTED_ROUTES = ["/dashboard", "/settings", "/services", "/bookings"];
const GUEST_RESTRICTED_ROUTES = ["/settings", "/profile", "/account", "/payment"];
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/about",
  "/contact",
  "/verify-otp",
  "/assets",
];
const LOGIN_URL = "/login";
const HOME_URL = "/";

const matchesPattern = (path: string, patterns: string[]): boolean =>
  patterns.some((pattern) => path.startsWith(pattern));

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  
  // Try to get user data from cookie to check if user is guest
  let isGuestUser = false;
  try {
    const authCookie = req.cookies.get("auth-storage")?.value;
    // console.log("Auth Cookie:", authCookie);
    if (authCookie) {
      const authData = JSON.parse(decodeURIComponent(authCookie));
      // console.log("Auth Data:", authData);
      // Check if user email starts with guest_ to identify guest users
      isGuestUser = authData?.login_type === LoginType.GUEST || false;
      // console.log("Is Guest User:", isGuestUser);
    }
  } catch (error) {
    console.error("Error parsing auth cookie:", error);
  }

  console.log("Pathname:", pathname);
  console.log("Is Public Route:", matchesPattern(pathname, PUBLIC_ROUTES));
  console.log("Is Guest User:", isGuestUser);
  
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
  
  // Redirect guest users away from restricted routes
  if (isGuestUser && matchesPattern(pathname, GUEST_RESTRICTED_ROUTES)) {
    return NextResponse.redirect(new URL(HOME_URL, req.url));
  }

  // Allow the request to continue for authenticated users or non-protected routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
