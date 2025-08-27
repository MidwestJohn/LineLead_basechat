import assert from "assert";

import { NextRequest } from "next/server";
import { z } from "zod";

import { getDataPath } from "@/lib/paths";
import { createAbsoluteUrl } from "@/lib/server/get-origin";
import { saveConnection } from "@/lib/server/service";
import * as settings from "@/lib/server/settings";
import { requireAdminContext } from "@/lib/server/utils";

const querySchema = z.object({
  tenant: z.string(),
  connection_id: z.string(),
});

export async function GET(request: NextRequest) {
  const params = querySchema.parse({
    tenant: request.nextUrl.searchParams.get("tenant"),
    connection_id: request.nextUrl.searchParams.get("connection_id"),
  });

  const { tenant, session } = await requireAdminContext(params.tenant);
  await saveConnection(tenant.id, params.connection_id, "syncing", session.user.name);

  const redirectUrl = createAbsoluteUrl(request, getDataPath(tenant.slug));
  return Response.redirect(redirectUrl);
}
