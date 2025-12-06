import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/database.types";

type SupabaseClientType = SupabaseClient<Database>;

export const createReadingRepository = (client: SupabaseClientType) => ({
  async getReadingList(options?: {
    jlptLevel?: string;
    readingType?: string;
    source?: "BaseDict" | "User" | "JLPT";
    userId?: string;
    examId?: string;
  }): Promise<TReadingMaterial[]> {
    let selectQuery = `
        id, title, jlpt_level, reading_type, created_at, source,
        user_readings (user_id)
      `;

    if (options?.examId) {
      selectQuery += `, exam_readings!inner(exam_id)`;
    }

    let query = client
      .from("readings")
      .select(selectQuery)
      .order("created_at", { ascending: false });

    if (options?.source) {
      query = query.eq("source", options.source);
    }

    if (options?.jlptLevel) {
      query = query.eq("jlpt_level", options.jlptLevel);
    }

    if (options?.readingType && options.readingType !== "all") {
      query = query.eq("reading_type", options.readingType);
    }

    if (options?.examId) {
      query = query.eq("exam_readings.exam_id", options.examId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (
      (data as any)?.map((item: any) => ({
        id: item.id,
        title: item.title,
        jlptLevel: item.jlpt_level,
        readingType: item.reading_type,
        isRead:
          options?.userId && item.user_readings
            ? item.user_readings.some(
                ({ user_id }: any) => user_id === options.userId
              )
            : false,
        createdAt: item.created_at,
      })) || []
    );
  },

  async getReadingDetail(id: number, userId?: string): Promise<TReadingDetail> {
    const { data, error } = await client
      .from("readings")
      .select(
        `
        *,
        reading_questions (*),
        user_readings (user_id)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      jlptLevel: data.jlpt_level,
      readingType: data.reading_type,
      isRead:
        userId && data.user_readings
          ? data.user_readings.some(({ user_id }: any) => user_id === userId)
          : false,
      createdAt: data.created_at,
      japanese: data.japanese,
      vietnamese: data.vietnamese,
      topic: data.topic || "",
      lexemes: data.lexemes || [],
      readingQuestions:
        data.reading_questions?.map((q: any) => ({
          id: q.id,
          question: q.question,
          answers: q.answers,
          correctAnswer: q.correct_answer,
        })) || [],
    };
  },
});
