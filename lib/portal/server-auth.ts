import { NextResponse } from "next/server";
import { publicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthorizedUser = {
  id: string;
  email: string;
  role: "admin" | "teacher" | "student";
};

function trustedRequestOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const allowed = new Set<string>([new URL(request.url).origin]);
  if (publicEnv.siteUrl) {
    try {
      allowed.add(new URL(publicEnv.siteUrl).origin);
    } catch {
      // A malformed optional site URL should not crash authentication checks.
    }
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
    allowed.add(`${forwardedProto}://${forwardedHost.split(",")[0]?.trim()}`);
  }

  return allowed.has(origin);
}

export async function requireAdmin(request?: Request) {
  if (request && !trustedRequestOrigin(request)) {
    return {
      error: NextResponse.json({ error: "The request origin is not allowed." }, { status: 403 }),
    } as const;
  }

  const declaredLength = Number(request?.headers.get("content-length") || 0);
  if (Number.isFinite(declaredLength) && declaredLength > 64_000) {
    return {
      error: NextResponse.json({ error: "The request payload is too large." }, { status: 413 }),
    } as const;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      error: NextResponse.json({ error: "Your session has expired. Sign in again." }, { status: 401 }),
    } as const;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, account_status, email")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || profile.role !== "admin" || profile.account_status !== "active") {
    return {
      error: NextResponse.json({ error: "Administrator access is required." }, { status: 403 }),
    } as const;
  }

  return {
    user: {
      id: user.id,
      email: profile.email,
      role: profile.role,
    } satisfies AuthorizedUser,
  } as const;
}
