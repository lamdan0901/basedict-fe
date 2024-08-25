"use server";

import { createClient } from "@/utils/supabase/server";
import axios from "axios";

export async function fetchUserProfile() {
  const supabase = createClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) return undefined;

    const { data } = await axios.get<{ data: TUser }>(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/v1/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.data;
  } catch (err: any) {
    console.log("err: ", err?.response?.data?.message);
  }
}
