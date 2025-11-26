"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/supabase/database.types";
import { createLexemeRepository } from "./repositories/lexemeRepo";
import { createFlashcardRepository } from "./repositories/flashcardRepo";
import { createAuthRepository } from "./repositories/authRepo";

const client: ReturnType<typeof createBrowserClient<Database>> =
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export const lexemeRepo = createLexemeRepository(client);
export const flashcardRepo = createFlashcardRepository(client);
export const authRepo = createAuthRepository(client);
