import { SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables } from "@/lib/supabase/database.types";

export type Lexeme = Tables<"lexemes">;
export type Meaning = Tables<"meanings">;

export type LexemeWithMeanings = Lexeme & {
  meanings: Meaning[];
};

type SupabaseClientType = SupabaseClient<Database>;

// Transform database result to match TLexeme interface
function transformLexeme(data: any): any {
  if (!data) return null;

  const { meanings, id, ...rest } = data;
  return {
    ...rest,
    id: id.toString(),
    meaning: meanings || [],
  };
}

function transformLexemes(data: any[]): any[] {
  return data.map((item) => {
    const { id, ...rest } = item;
    return {
      ...rest,
      id: id.toString(),
      meaning: [],
    };
  });
}

export const createLexemeRepository = (client: SupabaseClientType) => ({
  /**
   * Search for a lexeme by its standard form or lexeme
   */
  async searchLexeme(word: string): Promise<any> {
    // First try exact match - limit to 1 result to handle multiple matches
    const { data, error } = await client
      .from("lexemes")
      .select(
        `
        *,
        meanings (*)
      `
      )
      .or(`standard.eq.${word},lexeme.eq.${word}`)
      .eq("approved", true)
      .limit(1);

    if (error) throw error;

    // If no exact match found, try case-insensitive search
    if (!data || data.length === 0) {
      const { data: fuzzyData, error: fuzzyError } = await client
        .from("lexemes")
        .select(
          `
          *,
          meanings (*)
        `
        )
        .or(`standard.ilike.${word},lexeme.ilike.${word}`)
        .eq("approved", true)
        .limit(1);

      if (fuzzyError) throw fuzzyError;

      if (!fuzzyData || fuzzyData.length === 0) {
        throw "NOT_FOUND";
      }

      return transformLexeme(fuzzyData[0]);
    }

    return transformLexeme(data[0]);
  },

  /**
   * Get lexeme suggestions based on search term
   */
  async getLexemeSuggestions(search: string): Promise<any[]> {
    const { data, error } = await client
      .from("lexemes")
      .select("*")
      .or(
        `standard.ilike.%${search}%,lexeme.ilike.%${search}%,hiragana.ilike.%${search}%`
      )
      .eq("approved", true)
      .limit(10)
      .order("searchcount", { ascending: false });

    if (error) throw error;

    return transformLexemes(data || []);
  },

  /**
   * Get paginated lexemes with optional search
   */
  async getLexemes(params: {
    search?: string;
    page?: number;
    limit?: number;
    jlptLevel?: string;
  }): Promise<{ data: any[]; total: number }> {
    const { search, page = 1, limit = 20, jlptLevel } = params;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = client
      .from("lexemes")
      .select("*", { count: "exact" })
      .eq("approved", true);

    if (search) {
      query = query.or(
        `standard.ilike.%${search}%,lexeme.ilike.%${search}%,hiragana.ilike.%${search}%`
      );
    }

    if (jlptLevel) {
      query = query.eq("jlptlevel", jlptLevel);
    }

    query = query.range(from, to).order("searchcount", { ascending: false });

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: transformLexemes(data || []), total: count || 0 };
  },

  /**
   * Increment search count for a lexeme
   */
  async incrementSearchCount(lexemeId: number): Promise<void> {
    const { data: lexeme } = await client
      .from("lexemes")
      .select("searchcount")
      .eq("id", lexemeId)
      .single();

    if (lexeme) {
      const { error } = await client
        .from("lexemes")
        .update({ searchcount: lexeme.searchcount + 1 })
        .eq("id", lexemeId);

      if (error) throw error;
    }
  },

  /**
   * Get lexeme by ID with meanings
   */
  async getLexemeById(id: number): Promise<any> {
    const { data, error } = await client
      .from("lexemes")
      .select(
        `
        *,
        meanings (*)
      `
      )
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return transformLexeme(data);
  },
});
