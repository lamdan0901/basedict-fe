import { SupabaseClient } from "@supabase/supabase-js";
import { Database, TablesInsert, TablesUpdate } from "../database.types";

const TABLE_NAME = "users";

export type UserInsertDto = TablesInsert<"users">;
export type UserUpdateDto = TablesUpdate<"users">;

type SupabaseClientType = SupabaseClient<Database>;

export const createAuthRepository = (client: SupabaseClientType) => ({
  async getUserProfile(userId: string) {
    const { data, error } = await client
      .from(TABLE_NAME)
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async createUserProfile(profile: UserInsertDto) {
    const { data, error } = await client
      .from(TABLE_NAME)
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, profile: UserUpdateDto) {
    const { data, error } = await client
      .from(TABLE_NAME)
      .update(profile)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
});
