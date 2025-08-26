import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

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

        // Use request origin as fallback for BASE_URL
        const envBase = process.env.BASE_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
        const base = envBase ?? `${request.nextUrl.protocol}//${request.nextUrl.host}`;

        const newUrl = new URL(redirectPath, base);
        if (pathname !== "/") {
          const redirectTo = new URL(pathname, base);
          redirectTo.search = request.nextUrl.search;
          newUrl.searchParams.set("redirectTo", redirectTo.toString());
        }
        return Response.redirect(newUrl);
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
  matcher: ["/((?!_next|static|favicon.ico|api/healthz).*)"],
};

function getUnauthenticatedRedirectPath(pathname: string) {
  if (pathname.startsWith("/o")) {
    const slug = pathname.split("/")[2];
    return `/check/${slug}`;
  } else {
    return "/sign-in";
  }
}
