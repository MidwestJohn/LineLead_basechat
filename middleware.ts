import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import { createAbsoluteUrl } from "./lib/server/get-origin";

export async function middleware(request: NextRequest) {
  try {
    const sessionCookie = getSessionCookie(request);

    if (!sessionCookie) {
      const pathname = request.nextUrl.pathname;
      if (
        pathname !== "/sign-in" &&
        pathname !== "/sign-up" &&
        pathname !== "/reset" &&
        pathname !== "/change-password" &&
        !pathname.startsWith("/check") &&
        !pathname.startsWith("/api/auth/callback") &&
        !pathname.startsWith("/api/admin") &&
        !pathname.startsWith("/healthz") &&
        !pathname.startsWith("/images")
      ) {
        const redirectPath = getUnauthenticatedRedirectPath(pathname);

        // Use robust URL creation
        const newUrl = createAbsoluteUrl(request, redirectPath);

        if (pathname !== "/") {
          // Create the redirect URL with current search params
          const redirectTo = createAbsoluteUrl(request, pathname);
          redirectTo.search = request.nextUrl.search;
          newUrl.searchParams.set("redirectTo", redirectTo.toString());
        }

        return NextResponse.redirect(newUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Fallback to NextResponse.next() if middleware fails
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Match all paths except:
    // - Next.js internals (_next)
    // - Static files (static, favicon.ico, etc.)
    // - Health check endpoints
    // - API routes that should bypass auth
    // - Image assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$|api/healthz|api/auth/callback).*)",
  ],
};

function getUnauthenticatedRedirectPath(pathname: string) {
  if (pathname.startsWith("/o")) {
    const slug = pathname.split("/")[2];
    return `/check/${slug}`;
  } else {
    return "/sign-in";
  }
}
