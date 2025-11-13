"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/supabase/database.types";
import { createLexemeRepository } from "./repositories/lexemeRepo";

export type SupabaseClient = ReturnType<typeof createClient>;

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null =
  null;

export function getSupabaseClient() {
  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return clientInstance;
}

export const lexemeRepo = createLexemeRepository(getSupabaseClient());

export function createClient() {
  return getSupabaseClient();
}
