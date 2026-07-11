import { existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

if (typeof process.loadEnvFile === "function" && existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const secretKey = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || "Institute Administrator";
const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || "";

function fail(message) {
  console.error(`\nBootstrap failed: ${message}\n`);
  process.exit(1);
}

if (!supabaseUrl || !secretKey) fail("Add the Supabase URL and server secret to .env.local.");
if (!email || !/^\S+@\S+\.\S+$/.test(email)) fail("Set a valid BOOTSTRAP_ADMIN_EMAIL.");
if (password.length < 12) fail("BOOTSTRAP_ADMIN_PASSWORD must contain at least 12 characters.");
if (!/[A-Za-z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
  fail("BOOTSTRAP_ADMIN_PASSWORD must include a letter, number, and special character.");
}

const admin = createClient(supabaseUrl, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findExistingUser() {
  let page = 1;
  while (page <= 100) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === email);
    if (match) return match;
    if (data.users.length < 100) return null;
    page += 1;
  }
  throw new Error("Admin lookup exceeded 10,000 users. Create the account in Supabase Auth, then update its profile role.");
}

try {
  let user = await findExistingUser();

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    });
    if (error || !data.user) throw error || new Error("Supabase did not return the created user.");
    user = data.user;
  } else {
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: { ...user.user_metadata, full_name: name },
    });
    if (error) throw error;
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: user.id,
    full_name: name,
    email,
    role: "admin",
    account_status: "active",
    must_change_password: false,
  });
  if (profileError) throw profileError;

  const { error: courseError } = await admin.from("user_courses").delete().eq("user_id", user.id);
  if (courseError) throw courseError;

  console.log(`\nAdmin account is ready for ${email}.\n`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
