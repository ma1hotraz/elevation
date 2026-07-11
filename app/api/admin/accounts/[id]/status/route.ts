import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { accountStatusInputSchema, firstZodError } from "@/lib/portal/schemas";
import { requireAdmin } from "@/lib/portal/server-auth";
import { parseRouteUuid } from "@/lib/portal/server-utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorization = await requireAdmin(request);
  if ("error" in authorization) return authorization.error;

  const id = parseRouteUuid((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid account identifier." }, { status: 400 });

  const parsed = accountStatusInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: firstZodError(parsed.error) }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role, account_status")
    .eq("id", id)
    .single();

  if (profileError || !profile || profile.role === "admin") {
    return NextResponse.json({ error: "This account cannot be suspended here." }, { status: 400 });
  }

  const { status } = parsed.data;
  const { error: authError } = await admin.auth.admin.updateUserById(id, {
    ban_duration: status === "suspended" ? "876000h" : "none",
  });
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  const { error: updateError } = await admin.rpc("service_set_account_status", {
    p_user_id: id,
    p_status: status,
    p_actor_id: authorization.user.id,
  });
  if (updateError) {
    await admin.auth.admin.updateUserById(id, {
      ban_duration: profile.account_status === "suspended" ? "876000h" : "none",
    });
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
