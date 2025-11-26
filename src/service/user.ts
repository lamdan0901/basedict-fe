import { authRepo } from "@/lib/supabase/client";
import { createClient } from "@/utils/supabase/client";

export async function fetchUserProfile(): Promise<any> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return undefined;

  try {
    const profile = await authRepo.getUserProfile(user.id);
    return profile;
  } catch (err: any) {
    console.error("Error fetching user profile:", err);
    return undefined;
  }
}
