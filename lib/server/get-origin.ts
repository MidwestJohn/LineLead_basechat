import type { NextRequest } from "next/server";

/**
 * Get the origin for the current request - NEVER throws
 */
export function getOrigin(req?: NextRequest): string {
  const cand =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    process.env.NEXTAUTH_URL ||
    process.env.BASE_URL ||
    process.env.VERCEL_URL ||
    "";

  if (cand) return cand.startsWith("http") ? cand : `https://${cand}`;
  // last-ditch fallback
  return req ? req.nextUrl.origin : "http://localhost:3000";
}

/**
 * Create an absolute URL from a path using the request origin.
 * Fallback-safe version that never throws.
 */
export function createAbsoluteUrl(request: NextRequest, path: string): URL {
  try {
    const origin = getOrigin(request);
    return new URL(path, origin);
  } catch {
    // Ultra-safe fallback
    return new URL(path, "http://localhost:3000");
  }
}

/**
 * Create a URL by cloning the request URL and updating the pathname.
 * This is more efficient when you only need to change the path.
 */
export function cloneUrlWithPath(request: NextRequest, pathname: string): URL {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return url;
}
