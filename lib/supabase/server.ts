import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertPublicSupabaseEnv } from "@/lib/env";
import type { Database } from "./database.types";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = assertPublicSupabaseEnv();

  return createServerClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Cookie writes can be unavailable from a Server Component.
          // The proxy refreshes the browser session in that case.
        }
      },
    },
  });
}
