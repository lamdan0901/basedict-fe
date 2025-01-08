"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/shared/lib/supabase/server";

export async function login() {
  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
      // https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client#saving-google-tokens
      //The tokens saved by your application are the Supabase Auth tokens. Your app might additionally need the Google OAuth 2.0 tokens to access Google services on the user's behalf.
      // Google does not send out a refresh token by default, so you will need to pass parameters like these to signInWithOAuth() in order to extract the provider_refresh_token:
      // queryParams: {
      //   access_type: "offline",
      //   prompt: "consent",
      // },
    },
  });

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect(data.url);
}
