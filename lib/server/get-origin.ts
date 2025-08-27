import { NextRequest } from "next/server";

/**
 * Get the origin (protocol + host) for the current request.
 *
 * Priority:
 * 1. Environment variables (BASE_URL, AUTH_URL, NEXTAUTH_URL, NEXT_PUBLIC_APP_URL)
 * 2. Request headers (for production deployments like Vercel)
 * 3. Constructed from request.nextUrl (fallback)
 */
export function getOrigin(request: NextRequest): string {
  // Try environment variables first (most reliable)
  const envUrls = [
    process.env.BASE_URL,
    process.env.AUTH_URL,
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ];

  for (const envUrl of envUrls) {
    if (envUrl) {
      try {
        const url = new URL(envUrl);
        return `${url.protocol}//${url.host}`;
      } catch {
        // Invalid URL in env, continue to next option
        console.warn(`Invalid URL in environment variable: ${envUrl}`);
      }
    }
  }

  // Try request headers (for deployments like Vercel)
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  // Fallback to request URL (development)
  try {
    return `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  } catch {
    // Last resort fallback
    return "http://localhost:3000";
  }
}

/**
 * Create an absolute URL from a path using the request origin.
 */
export function createAbsoluteUrl(request: NextRequest, path: string): URL {
  const origin = getOrigin(request);
  return new URL(path, origin);
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
