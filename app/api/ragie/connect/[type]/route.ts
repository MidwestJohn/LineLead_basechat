import { NextRequest } from "next/server";
import { ConnectorSource } from "ragie/models/components";

import { createAbsoluteUrl } from "@/lib/server/get-origin";
import { getRagieClientAndPartition } from "@/lib/server/ragie";
import * as settings from "@/lib/server/settings";
import { requireAdminContextFromRequest } from "@/lib/server/utils";

export const dynamic = "force-dynamic"; // no caching

interface Params {
  type: string;
}

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
  const { tenant } = await requireAdminContextFromRequest(request);

  const { client, partition } = await getRagieClientAndPartition(tenant.id);
  const { type } = await params;

  const redirectUri = createAbsoluteUrl(request, "/api/ragie/callback");
  redirectUri.searchParams.set("tenant", tenant.slug);

  const payload = await client.connections.createOAuthRedirectUrl({
    redirectUri: redirectUri.toString(),
    sourceType: type as ConnectorSource | undefined,
    partition,
    mode: "hi_res",
    theme: "light",
  });

  return Response.json(payload);
}
