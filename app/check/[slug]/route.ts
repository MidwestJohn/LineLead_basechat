import { NextRequest } from "next/server";

import auth from "@/auth";
import { getOrigin } from "@/lib/server/get-origin";
import { createProfile, findProfileByTenantIdAndUserId, findTenantBySlug } from "@/lib/server/service";
import getSession from "@/lib/server/session";
import { BASE_URL } from "@/lib/server/settings";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const tenant = await findTenantBySlug(slug);

  if (!tenant?.isPublic) {
    return Response.redirect(getSignInUrl(request));
  }

  const session = await getSession();

  if (session) {
    const profile = await findProfileByTenantIdAndUserId(tenant.id, session.user.id);
    if (!profile) {
      await createProfile(tenant.id, session.user.id, "guest");
    }
  } else {
    const data = await auth.api.signInAnonymous();
    if (!data) {
      throw new Error("Could not sign in");
    }
    const userId = data.user.id;
    await createProfile(tenant.id, userId, "guest");
  }

  // Use robust URL construction
  const origin = getOrigin(request);
  const redirectUrl = new URL(`/o/${slug}`, origin);
  return Response.redirect(redirectUrl);
}

function getSignInUrl(request: NextRequest) {
  const redirectToParam = request.nextUrl.searchParams.get("redirectTo");
  const origin = getOrigin(request);

  const signInUrl = new URL("/sign-in", origin);
  if (redirectToParam) {
    signInUrl.searchParams.set("redirectTo", redirectToParam);
  }
  return signInUrl;
}
