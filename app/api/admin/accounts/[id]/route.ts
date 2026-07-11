import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { accountUpdateSchema, firstZodError } from "@/lib/portal/schemas";
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

  const parsed = accountUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: firstZodError(parsed.error) }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const [{ data: existing, error: existingError }, { data: authRecord, error: authLookupError }] = await Promise.all([
    admin.from("profiles").select("id, role, email, full_name, account_status").eq("id", id).single(),
    admin.auth.admin.getUserById(id),
  ]);

  if (existingError || authLookupError || !existing || !authRecord.user) {
    return NextResponse.json({ error: "That account no longer exists." }, { status: 404 });
  }
  if (existing.role === "admin") {
    return NextResponse.json({ error: "Admin accounts are not editable here." }, { status: 400 });
  }

  const input = parsed.data;
  const previousMetadata = authRecord.user.user_metadata;
  const { error: authUpdateError } = await admin.auth.admin.updateUserById(id, {
    email: input.email,
    email_confirm: true,
    user_metadata: { ...previousMetadata, full_name: input.name },
    ban_duration: input.accountStatus === "suspended" ? "876000h" : "none",
  });

  if (authUpdateError) {
    const duplicate = authUpdateError.message.toLowerCase().includes("already");
    return NextResponse.json(
      { error: duplicate ? "That email is already in use." : authUpdateError.message },
      { status: duplicate ? 409 : 500 },
    );
  }

  const { error: profileError } = await admin.rpc("service_save_managed_account", {
    p_user_id: id,
    p_full_name: input.name,
    p_email: input.email,
    p_role: existing.role,
    p_account_status: input.accountStatus,
    p_phone: input.phone,
    p_guardian_name: input.guardianName,
    p_address: input.address,
    p_courses: input.courses,
    p_actor_id: authorization.user.id,
    p_action: "account.updated",
  });

  if (profileError) {
    await admin.auth.admin.updateUserById(id, {
      email: existing.email,
      email_confirm: true,
      user_metadata: previousMetadata,
      ban_duration: existing.account_status === "suspended" ? "876000h" : "none",
    });
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorization = await requireAdmin(request);
  if ("error" in authorization) return authorization.error;

  const id = parseRouteUuid((await params).id);
  if (!id) return NextResponse.json({ error: "Invalid account identifier." }, { status: 400 });
  if (id === authorization.user.id) {
    return NextResponse.json({ error: "You cannot delete your own admin account." }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();
  const { data: existing, error: existingError } = await admin
    .from("profiles")
    .select("role, email, full_name")
    .eq("id", id)
    .single();

  if (existingError || !existing) {
    return NextResponse.json({ error: "That account no longer exists." }, { status: 404 });
  }
  if (existing.role === "admin") {
    return NextResponse.json({ error: "Admin accounts cannot be deleted here." }, { status: 400 });
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  await admin.from("audit_logs").insert({
    actor_id: authorization.user.id,
    action: "account.deleted",
    entity_type: "profile",
    entity_id: id,
    metadata: { role: existing.role, email: existing.email, name: existing.full_name },
  });

  return NextResponse.json({ ok: true });
}
