import { SupabaseClient } from "@supabase/supabase-js";
import { Database, TablesInsert, TablesUpdate } from "../database.types";

export type UserInsertDto = TablesInsert<"users">;
export type UserUpdateDto = TablesUpdate<"users">;

type SupabaseClientType = SupabaseClient<Database>;

export const createAuthRepository = (client: SupabaseClientType) => ({
  async getUserProfile(userId: string) {
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, profile: UserUpdateDto) {
    const { data, error } = await client
      .from("users")
      .update(profile)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
});
