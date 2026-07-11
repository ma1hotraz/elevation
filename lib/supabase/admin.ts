import { createClient } from "@supabase/supabase-js";
import { assertPublicSupabaseEnv, getSupabaseSecretKey } from "@/lib/env";
import type { Database } from "./database.types";

export function createSupabaseAdminClient() {
  const env = assertPublicSupabaseEnv();

  return createClient<Database>(env.supabaseUrl, getSupabaseSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
