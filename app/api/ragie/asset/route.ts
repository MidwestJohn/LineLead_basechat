import { NextRequest } from "next/server";
import { z } from "zod";

import { getRagieApiKey } from "@/lib/server/ragie";
import { RAGIE_API_BASE_URL } from "@/lib/server/settings";
import { requireAuthContextFromRequest } from "@/lib/server/utils";

const paramsSchema = z.object({
  href: z.string(),
});

// Use Node runtime to handle binary data properly
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params = paramsSchema.parse({
      href: request.nextUrl.searchParams.get("href"),
    });

    if (!params.href) {
      return new Response("Missing href parameter", { status: 400 });
    }

    // Validate that the URL is from Ragie to prevent SSRF
    if (!params.href.startsWith(RAGIE_API_BASE_URL)) {
      return new Response("Invalid URL - must be from Ragie", { status: 400 });
    }

    // Get auth context to ensure user is authenticated
    const { tenant } = await requireAuthContextFromRequest(request);

    // Get the Ragie API key for this tenant
    const ragieApiKey = await getRagieApiKey(tenant);

    // Fetch the asset from Ragie with authentication
    const upstreamResponse = await fetch(params.href, {
      headers: {
        Authorization: `Bearer ${ragieApiKey}`,
        partition: tenant.ragiePartition || tenant.id,
      },
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text().catch(() => "");
      console.error("Ragie asset fetch failed:", upstreamResponse.status, errorText);
      return new Response(`Asset fetch failed: ${upstreamResponse.status}`, { status: 502 });
    }

    if (!upstreamResponse.body) {
      return new Response("No content received from Ragie", { status: 502 });
    }

    // Stream the asset back to the client with proper headers
    return new Response(upstreamResponse.body, {
      status: 200,
      headers: {
        "Content-Type": upstreamResponse.headers.get("content-type") || "application/octet-stream",
        "Cache-Control": "private, max-age=300", // Cache for 5 minutes
        "Content-Length": upstreamResponse.headers.get("content-length") || "",
      },
    });
  } catch (error) {
    console.error("Error in asset proxy route:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
