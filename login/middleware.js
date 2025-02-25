import { NextResponse } from "next/server";

// Middleware function to protect routes
export function middleware(req) {
  const token = req.cookies.get("token")?.value; // Get token from cookies

  const loginPath = "/login";
  const homePath = "/home";
  const adminPath = "/admin";
  const userPath = "/user";
  const mainPath = "/";

  const protectedRoutes = ["/home", "/admin", "/user"];

  // If user is trying to access `/home` but is not authenticated, redirect to `/login`
  if (!token && req.nextUrl.pathname.startsWith(homePath)) {
    return NextResponse.redirect(new URL(mainPath, req.url));
  }
  if (!token && req.nextUrl.pathname.startsWith(adminPath)) {
    return NextResponse.redirect(new URL(mainPath, req.url));
  }
  if (!token && req.nextUrl.pathname.startsWith(userPath)) {
    return NextResponse.redirect(new URL(mainPath, req.url));
  }

  // If user is already authenticated and tries to access `/login`, redirect to `/home`
  if (token && req.nextUrl.pathname.startsWith(loginPath)) {
    return NextResponse.redirect(new URL(homePath, req.url));
  }

  return NextResponse.next(); // Continue if nothing needs redirection
}

// Define which routes middleware should run on
export const config = {
  matcher: ["/home", "/login", "/admin", "/user"], // Apply middleware to `/home` and `/login`
};
