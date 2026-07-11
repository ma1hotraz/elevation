import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { accountInputSchema, firstZodError } from "@/lib/portal/schemas";
import { requireAdmin } from "@/lib/portal/server-auth";
import { generateTemporaryPassword } from "@/lib/portal/server-utils";

export async function POST(request: Request) {
  const authorization = await requireAdmin(request);
  if ("error" in authorization) return authorization.error;

  const parsed = accountInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: firstZodError(parsed.error) }, { status: 400 });
  }

  const input = parsed.data;
  const admin = createSupabaseAdminClient();
  const temporaryPassword = generateTemporaryPassword();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: input.email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { full_name: input.name },
  });

  if (createError || !created.user) {
    const duplicate = createError?.message.toLowerCase().includes("already") ?? false;
    return NextResponse.json(
      { error: duplicate ? "That email is already in use." : createError?.message || "Unable to create the account." },
      { status: duplicate ? 409 : 500 },
    );
  }

  const userId = created.user.id;

  try {
    if (input.accountStatus === "suspended") {
      const { error: banError } = await admin.auth.admin.updateUserById(userId, { ban_duration: "876000h" });
      if (banError) throw banError;
    }

    const { error: profileError } = await admin.rpc("service_save_managed_account", {
      p_user_id: userId,
      p_full_name: input.name,
      p_email: input.email,
      p_role: input.role,
      p_account_status: input.accountStatus,
      p_phone: input.phone,
      p_guardian_name: input.guardianName,
      p_address: input.address,
      p_courses: input.courses,
      p_actor_id: authorization.user.id,
      p_action: "account.created",
    });
    if (profileError) throw profileError;


    return NextResponse.json(
      {
        result: {
          userId,
          name: input.name,
          email: input.email,
          role: input.role,
          temporaryPassword,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    await admin.auth.admin.deleteUser(userId).catch(() => undefined);
    const message = error instanceof Error ? error.message : "Unable to finish account creation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
