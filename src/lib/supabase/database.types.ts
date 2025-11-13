export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blacklists: {
        Row: {
          id: number
          lexeme: string
          type: Database["public"]["Enums"]["blacklist_type"]
        }
        Insert: {
          id?: number
          lexeme: string
          type?: Database["public"]["Enums"]["blacklist_type"]
        }
        Update: {
          id?: number
          lexeme?: string
          type?: Database["public"]["Enums"]["blacklist_type"]
        }
        Relationships: []
      }
      lexemes: {
        Row: {
          approved: boolean
          approved_at: string | null
          created_at: string
          frequency_ranking: number
          hanviet: string | null
          hiragana: string
          hiragana2: string | null
          id: number
          is_master: boolean
          ischecked: boolean
          jlptlevel: Database["public"]["Enums"]["jlptlevel"] | null
          lexeme: string
          old_jlpt_level: number
          part_of_speech: string[]
          reportcount: number
          searchcount: number
          similars: string[]
          standard: string
          updated_at: string
          word_origin: string
        }
        Insert: {
          approved?: boolean
          approved_at?: string | null
          created_at?: string
          frequency_ranking: number
          hanviet?: string | null
          hiragana: string
          hiragana2?: string | null
          id?: number
          is_master?: boolean
          ischecked?: boolean
          jlptlevel?: Database["public"]["Enums"]["jlptlevel"] | null
          lexeme: string
          old_jlpt_level: number
          part_of_speech?: string[]
          reportcount?: number
          searchcount?: number
          similars?: string[]
          standard: string
          updated_at?: string
          word_origin: string
        }
        Update: {
          approved?: boolean
          approved_at?: string | null
          created_at?: string
          frequency_ranking?: number
          hanviet?: string | null
          hiragana?: string
          hiragana2?: string | null
          id?: number
          is_master?: boolean
          ischecked?: boolean
          jlptlevel?: Database["public"]["Enums"]["jlptlevel"] | null
          lexeme?: string
          old_jlpt_level?: number
          part_of_speech?: string[]
          reportcount?: number
          searchcount?: number
          similars?: string[]
          standard?: string
          updated_at?: string
          word_origin?: string
        }
        Relationships: []
      }
      meanings: {
        Row: {
          context: string | null
          created_at: string
          example: string | null
          explaination: string
          id: number
          lexeme_id: number
          meaning: string
          updated_at: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          example?: string | null
          explaination: string
          id?: number
          lexeme_id: number
          meaning: string
          updated_at?: string
        }
        Update: {
          context?: string | null
          created_at?: string
          example?: string | null
          explaination?: string
          id?: number
          lexeme_id?: number
          meaning?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meanings_lexeme_id_fkey"
            columns: ["lexeme_id"]
            isOneToOne: false
            referencedRelation: "lexemes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          exampopular: number
          id: string
          jlptlevel: Database["public"]["Enums"]["jlptlevel"]
          name: string
          popular: number
          role: Database["public"]["Enums"]["role"]
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          exampopular?: number
          id: string
          jlptlevel?: Database["public"]["Enums"]["jlptlevel"]
          name: string
          popular?: number
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          exampopular?: number
          id?: string
          jlptlevel?: Database["public"]["Enums"]["jlptlevel"]
          name?: string
          popular?: number
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      blacklist_type: "Vietnamese" | "Japanese"
      jlptlevel: "N5" | "N4" | "N3" | "N2" | "N1"
      role: "user" | "vipuser" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blacklist_type: ["Vietnamese", "Japanese"],
      jlptlevel: ["N5", "N4", "N3", "N2", "N1"],
      role: ["user", "vipuser", "admin"],
    },
  },
} as const
