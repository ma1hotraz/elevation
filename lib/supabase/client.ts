import { createBrowserClient } from "@supabase/ssr";
import { assertPublicSupabaseEnv, isSupabaseConfigured } from "@/lib/env";
import type { Database } from "./database.types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;

  if (!browserClient) {
    const env = assertPublicSupabaseEnv();
    browserClient = createBrowserClient<Database>(
      env.supabaseUrl,
      env.supabasePublishableKey,
    );
  }

  return browserClient;
}
