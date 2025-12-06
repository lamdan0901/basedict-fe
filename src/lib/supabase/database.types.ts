export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      exam_learners: {
        Row: {
          created_at: string;
          exam_id: number;
          is_learning: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          exam_id: number;
          is_learning?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          exam_id?: number;
          is_learning?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exam_learners_exam_id_fkey";
            columns: ["exam_id"];
            isOneToOne: false;
            referencedRelation: "exams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exam_learners_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      exam_question_masters: {
        Row: {
          exam_id: number;
          question_master_id: number;
        };
        Insert: {
          exam_id: number;
          question_master_id: number;
        };
        Update: {
          exam_id?: number;
          question_master_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "exam_question_masters_exam_id_fkey";
            columns: ["exam_id"];
            isOneToOne: false;
            referencedRelation: "exams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exam_question_masters_question_master_id_fkey";
            columns: ["question_master_id"];
            isOneToOne: false;
            referencedRelation: "question_masters";
            referencedColumns: ["id"];
          }
        ];
      };
      exam_questions: {
        Row: {
          answers: string[];
          correct_answer: string;
          created_at: string;
          exam_id: number;
          explanation: string | null;
          id: number;
          question: string;
          updated_at: string;
        };
        Insert: {
          answers: string[];
          correct_answer: string;
          created_at?: string;
          exam_id: number;
          explanation?: string | null;
          id?: number;
          question: string;
          updated_at?: string;
        };
        Update: {
          answers?: string[];
          correct_answer?: string;
          created_at?: string;
          exam_id?: number;
          explanation?: string | null;
          id?: number;
          question?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exam_questions_exam_id_fkey";
            columns: ["exam_id"];
            isOneToOne: false;
            referencedRelation: "exams";
            referencedColumns: ["id"];
          }
        ];
      };
      exam_readings: {
        Row: {
          exam_id: number;
          reading_id: number;
        };
        Insert: {
          exam_id: number;
          reading_id: number;
        };
        Update: {
          exam_id?: number;
          reading_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "exam_readings_exam_id_fkey";
            columns: ["exam_id"];
            isOneToOne: false;
            referencedRelation: "exams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exam_readings_reading_id_fkey";
            columns: ["reading_id"];
            isOneToOne: false;
            referencedRelation: "readings";
            referencedColumns: ["id"];
          }
        ];
      };
      exam_tags: {
        Row: {
          created_at: string;
          exam_id: number;
          tag_id: number;
        };
        Insert: {
          created_at?: string;
          exam_id: number;
          tag_id: number;
        };
        Update: {
          created_at?: string;
          exam_id?: number;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "exam_tags_exam_id_fkey";
            columns: ["exam_id"];
            isOneToOne: false;
            referencedRelation: "exams";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exam_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      exams: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          is_public: boolean;
          jlpt_level: Database["public"]["Enums"]["jlptlevel"] | null;
          popular: number;
          popular_updated_at: string | null;
          source: Database["public"]["Enums"]["source_type"];
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          is_public?: boolean;
          jlpt_level?: Database["public"]["Enums"]["jlptlevel"] | null;
          popular?: number;
          popular_updated_at?: string | null;
          source: Database["public"]["Enums"]["source_type"];
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          is_public?: boolean;
          jlpt_level?: Database["public"]["Enums"]["jlptlevel"] | null;
          popular?: number;
          popular_updated_at?: string | null;
          source?: Database["public"]["Enums"]["source_type"];
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exams_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      question_masters: {
        Row: {
          answers: string[];
          correct_answer: string;
          created_at: string;
          explanation: string | null;
          id: number;
          jlpt_level: Database["public"]["Enums"]["jlptlevel"];
          question: string;
          source: Database["public"]["Enums"]["source_type"];
          type: Database["public"]["Enums"]["question_type"];
          updated_at: string;
        };
        Insert: {
          answers: string[];
          correct_answer: string;
          created_at?: string;
          explanation?: string | null;
          id?: number;
          jlpt_level: Database["public"]["Enums"]["jlptlevel"];
          question: string;
          source: Database["public"]["Enums"]["source_type"];
          type: Database["public"]["Enums"]["question_type"];
          updated_at?: string;
        };
        Update: {
          answers?: string[];
          correct_answer?: string;
          created_at?: string;
          explanation?: string | null;
          id?: number;
          jlpt_level?: Database["public"]["Enums"]["jlptlevel"];
          question?: string;
          source?: Database["public"]["Enums"]["source_type"];
          type?: Database["public"]["Enums"]["question_type"];
          updated_at?: string;
        };
        Relationships: [];
      };
      reading_questions: {
        Row: {
          answers: string[];
          correct_answer: string;
          id: number;
          question: string;
          reading_id: number;
        };
        Insert: {
          answers: string[];
          correct_answer: string;
          id?: number;
          question: string;
          reading_id: number;
        };
        Update: {
          answers?: string[];
          correct_answer?: string;
          id?: number;
          question?: string;
          reading_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "reading_questions_reading_id_fkey";
            columns: ["reading_id"];
            isOneToOne: false;
            referencedRelation: "readings";
            referencedColumns: ["id"];
          }
        ];
      };
      readings: {
        Row: {
          created_at: string;
          id: number;
          japanese: string;
          jlpt_level: Database["public"]["Enums"]["jlptlevel"];
          lexemes: string[] | null;
          reading_type: Database["public"]["Enums"]["reading_type"];
          source: Database["public"]["Enums"]["source_type"];
          title: string;
          topic: string | null;
          updated_at: string;
          vietnamese: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          japanese: string;
          jlpt_level: Database["public"]["Enums"]["jlptlevel"];
          lexemes?: string[] | null;
          reading_type: Database["public"]["Enums"]["reading_type"];
          source: Database["public"]["Enums"]["source_type"];
          title: string;
          topic?: string | null;
          updated_at?: string;
          vietnamese: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          japanese?: string;
          jlpt_level?: Database["public"]["Enums"]["jlptlevel"];
          lexemes?: string[] | null;
          reading_type?: Database["public"]["Enums"]["reading_type"];
          source?: Database["public"]["Enums"]["source_type"];
          title?: string;
          topic?: string | null;
          updated_at?: string;
          vietnamese?: string;
        };
        Relationships: [];
      };
      user_readings: {
        Row: {
          reading_id: number;
          user_id: string;
        };
        Insert: {
          reading_id: number;
          user_id: string;
        };
        Update: {
          reading_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_readings_reading_id_fkey";
            columns: ["reading_id"];
            isOneToOne: false;
            referencedRelation: "readings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_readings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      reports: {
        Row: {
          id: number;
          word: string;
          problem: string;
          user_suggest: string | null;
          status: number;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          word: string;
          problem: string;
          user_suggest?: string | null;
          user_id: string;
        };
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      blacklists: {
        Row: {
          id: number;
          lexeme: string;
          type: Database["public"]["Enums"]["blacklist_type"];
        };
        Insert: {
          id?: number;
          lexeme: string;
          type?: Database["public"]["Enums"]["blacklist_type"];
        };
        Update: {
          id?: number;
          lexeme?: string;
          type?: Database["public"]["Enums"]["blacklist_type"];
        };
        Relationships: [];
      };
      flash_card_learners: {
        Row: {
          created_at: string;
          flash_card_set_id: number;
          is_learning: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          flash_card_set_id: number;
          is_learning?: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          flash_card_set_id?: number;
          is_learning?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flash_card_learners_flash_card_set_id_fkey";
            columns: ["flash_card_set_id"];
            isOneToOne: false;
            referencedRelation: "flash_card_sets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flash_card_learners_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      flash_card_set_tags: {
        Row: {
          flash_card_set_id: number;
          tag_id: number;
        };
        Insert: {
          flash_card_set_id: number;
          tag_id: number;
        };
        Update: {
          flash_card_set_id?: number;
          tag_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "flash_card_set_tags_flash_card_set_id_fkey";
            columns: ["flash_card_set_id"];
            isOneToOne: false;
            referencedRelation: "flash_card_sets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flash_card_set_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      flash_card_sets: {
        Row: {
          created_at: string;
          description: string | null;
          id: number;
          is_public: boolean;
          popular: number;
          popular_updated_at: string | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: number;
          is_public?: boolean;
          popular?: number;
          popular_updated_at?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: number;
          is_public?: boolean;
          popular?: number;
          popular_updated_at?: string | null;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flash_card_sets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      flash_cards: {
        Row: {
          back_side: string;
          back_side_comment: string | null;
          created_at: string;
          flash_card_set_id: number;
          front_side: string;
          front_side_comment: string | null;
          id: number;
          updated_at: string;
        };
        Insert: {
          back_side: string;
          back_side_comment?: string | null;
          created_at?: string;
          flash_card_set_id: number;
          front_side: string;
          front_side_comment?: string | null;
          id?: number;
          updated_at?: string;
        };
        Update: {
          back_side?: string;
          back_side_comment?: string | null;
          created_at?: string;
          flash_card_set_id?: number;
          front_side?: string;
          front_side_comment?: string | null;
          id?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flash_cards_flash_card_set_id_fkey";
            columns: ["flash_card_set_id"];
            isOneToOne: false;
            referencedRelation: "flash_card_sets";
            referencedColumns: ["id"];
          }
        ];
      };
      lexemes: {
        Row: {
          approved: boolean;
          approved_at: string | null;
          created_at: string;
          frequency_ranking: number;
          hanviet: string | null;
          hiragana: string;
          hiragana2: string | null;
          id: number;
          is_master: boolean;
          ischecked: boolean;
          jlptlevel: Database["public"]["Enums"]["jlptlevel"] | null;
          lexeme: string;
          old_jlpt_level: number;
          part_of_speech: string[];
          reportcount: number;
          searchcount: number;
          similars: string[];
          standard: string;
          updated_at: string;
          word_origin: string;
        };
        Insert: {
          approved?: boolean;
          approved_at?: string | null;
          created_at?: string;
          frequency_ranking: number;
          hanviet?: string | null;
          hiragana: string;
          hiragana2?: string | null;
          id?: number;
          is_master?: boolean;
          ischecked?: boolean;
          jlptlevel?: Database["public"]["Enums"]["jlptlevel"] | null;
          lexeme: string;
          old_jlpt_level: number;
          part_of_speech?: string[];
          reportcount?: number;
          searchcount?: number;
          similars?: string[];
          standard: string;
          updated_at?: string;
          word_origin: string;
        };
        Update: {
          approved?: boolean;
          approved_at?: string | null;
          created_at?: string;
          frequency_ranking?: number;
          hanviet?: string | null;
          hiragana?: string;
          hiragana2?: string | null;
          id?: number;
          is_master?: boolean;
          ischecked?: boolean;
          jlptlevel?: Database["public"]["Enums"]["jlptlevel"] | null;
          lexeme?: string;
          old_jlpt_level?: number;
          part_of_speech?: string[];
          reportcount?: number;
          searchcount?: number;
          similars?: string[];
          standard?: string;
          updated_at?: string;
          word_origin?: string;
        };
        Relationships: [];
      };
      meanings: {
        Row: {
          context: string | null;
          created_at: string;
          example: string | null;
          explaination: string;
          id: number;
          lexeme_id: number;
          meaning: string;
          updated_at: string;
        };
        Insert: {
          context?: string | null;
          created_at?: string;
          example?: string | null;
          explaination: string;
          id?: number;
          lexeme_id: number;
          meaning: string;
          updated_at?: string;
        };
        Update: {
          context?: string | null;
          created_at?: string;
          example?: string | null;
          explaination?: string;
          id?: number;
          lexeme_id?: number;
          meaning?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meanings_lexeme_id_fkey";
            columns: ["lexeme_id"];
            isOneToOne: false;
            referencedRelation: "lexemes";
            referencedColumns: ["id"];
          }
        ];
      };
      tags: {
        Row: {
          count: number;
          id: number;
          name: string;
        };
        Insert: {
          count?: number;
          id?: number;
          name: string;
        };
        Update: {
          count?: number;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatar: string | null;
          created_at: string;
          exampopular: number;
          id: string;
          jlptlevel: Database["public"]["Enums"]["jlptlevel"];
          name: string;
          popular: number;
          role: Database["public"]["Enums"]["role"];
          updated_at: string;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string;
          exampopular?: number;
          id: string;
          jlptlevel?: Database["public"]["Enums"]["jlptlevel"];
          name: string;
          popular?: number;
          role?: Database["public"]["Enums"]["role"];
          updated_at?: string;
        };
        Update: {
          avatar?: string | null;
          created_at?: string;
          exampopular?: number;
          id?: string;
          jlptlevel?: Database["public"]["Enums"]["jlptlevel"];
          name?: string;
          popular?: number;
          role?: Database["public"]["Enums"]["role"];
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      blacklist_type: "Vietnamese" | "Japanese";
      jlptlevel: "N5" | "N4" | "N3" | "N2" | "N1";
      role: "user" | "vipuser" | "admin";
      source_type: "User" | "JLPT" | "BaseDict";
      question_type:
        | "KanjiToHiragara"
        | "HiraganaToKanji"
        | "SuffixPrefix"
        | "Lexeme"
        | "Synonym"
        | "ContextLexeme"
        | "Grammar"
        | "GrammarAlign";
      reading_type:
        | "GrammarReading"
        | "SumaryReading"
        | "MediumReading"
        | "LongReading"
        | "CompareReading"
        | "NoticeReaing";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {
      blacklist_type: ["Vietnamese", "Japanese"],
      jlptlevel: ["N5", "N4", "N3", "N2", "N1"],
      role: ["user", "vipuser", "admin"],
      source_type: ["User", "JLPT", "BaseDict"],
      question_type: [
        "KanjiToHiragara",
        "HiraganaToKanji",
        "SuffixPrefix",
        "Lexeme",
        "Synonym",
        "ContextLexeme",
        "Grammar",
        "GrammarAlign",
      ],
      reading_type: [
        "GrammarReading",
        "SumaryReading",
        "MediumReading",
        "LongReading",
        "CompareReading",
        "NoticeReaing",
      ],
    },
  },
} as const;
