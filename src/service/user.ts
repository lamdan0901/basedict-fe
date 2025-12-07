import { authRepo, client } from "@/lib/supabase/client";

export async function fetchUserProfile(): Promise<any> {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) return undefined;

  try {
    const profile = await authRepo.getUserProfile(user.id);
    return profile;
  } catch (err: any) {
    console.error("Error fetching user profile:", err);
    return undefined;
  }
}
