import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getOrigin } from "@/lib/server/get-origin";

export async function middleware(req: NextRequest) {
  try {
    // Circuit breaker - can disable middleware without renaming file
    if (process.env.DISABLE_MIDDLEWARE === "1") {
      return NextResponse.next();
    }

    // Guard against missing auth dependencies
    let sessionCookie;
    try {
      const { getSessionCookie } = await import("better-auth/cookies");
      sessionCookie = getSessionCookie(req);
    } catch {
      // If auth system isn't available, allow through
      return NextResponse.next();
    }

    if (!sessionCookie) {
      const pathname = req.nextUrl.pathname;

      // Check if path needs authentication
      if (needsAuth(pathname)) {
        const redirectPath = getUnauthenticatedRedirectPath(pathname);

        // Use req.nextUrl.clone() when only changing path (more efficient)
        const newUrl = req.nextUrl.clone();
        newUrl.pathname = redirectPath;

        if (pathname !== "/") {
          // Build redirectTo param safely
          const origin = getOrigin(req);
          const redirectToUrl = new URL(pathname, origin);
          redirectToUrl.search = req.nextUrl.search;
          newUrl.searchParams.set("redirectTo", redirectToUrl.toString());
        }

        return NextResponse.redirect(newUrl);
      }
    }

    return NextResponse.next();
  } catch (err) {
    // Never surface a crash from middleware - always allow through
    console.error("middleware error (swallowed):", err);
    return NextResponse.next();
  }
}

function needsAuth(pathname: string): boolean {
  return (
    pathname !== "/sign-in" &&
    pathname !== "/sign-up" &&
    pathname !== "/reset" &&
    pathname !== "/change-password" &&
    !pathname.startsWith("/check") &&
    !pathname.startsWith("/api/auth/callback") &&
    !pathname.startsWith("/api/admin") &&
    !pathname.startsWith("/healthz") &&
    !pathname.startsWith("/images")
  );
}

function getUnauthenticatedRedirectPath(pathname: string): string {
  if (pathname.startsWith("/o")) {
    const slug = pathname.split("/")[2];
    return `/check/${slug}`;
  } else {
    return "/sign-in";
  }
}

// Keep middleware away from static/assets/api to reduce blast radius
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!_next|favicon.ico|api).*)",
  ],
};
