import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/portal/server-auth";
import { generateTemporaryPassword, parseRouteUuid } from "@/lib/portal/server-utils";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorization = await requireAdmin(request);
  if ("error" in authorization) return authorization.error;

  const id = parseRouteUuid((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid account identifier." }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", id)
    .single();

  if (profileError || !profile || profile.role === "admin") {
    return NextResponse.json(
      { error: "Only teacher and student passwords can be reset here." },
      { status: 400 },
    );
  }

  const temporaryPassword = generateTemporaryPassword();
  const { error: passwordError } = await admin.auth.admin.updateUserById(id, {
    password: temporaryPassword,
    ban_duration: "none",
  });
  if (passwordError) {
    return NextResponse.json({ error: passwordError.message }, { status: 500 });
  }

  const { error: updateError } = await admin.rpc("service_mark_password_reset", {
    p_user_id: id,
    p_actor_id: authorization.user.id,
  });
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    result: {
      userId: id,
      name: profile.full_name,
      email: profile.email,
      role: profile.role,
      temporaryPassword,
    },
  });
}
