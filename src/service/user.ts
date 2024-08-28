import { createClient } from "@/utils/supabase/client";
import axios from "axios";

export async function fetchUserProfile(): Promise<any> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) return undefined;

  try {
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

    if (err?.response?.data?.message === "common.undefinedError") {
      const user = await supabase.auth.getUser();
      return await createUserProfile(
        {
          name: user.data.user?.user_metadata.name,
          avatar: user.data.user?.user_metadata.avatar_url,
        },
        token
      );
    }
  }
}

async function createUserProfile(
  user: {
    name: string;
    avatar: string | null;
  },
  token: string
) {
  try {
    const { data } = await axios.post<{ data: TUser }>(
      `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/v1/users`,
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.data;
  } catch (err: any) {
    console.log("err: ", err?.response?.data?.message);
    return undefined;
  }
}
