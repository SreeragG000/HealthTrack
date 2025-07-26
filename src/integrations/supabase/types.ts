export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      exercises: {
        Row: {
          created_at: string
          equipment: string | null
          exercise_type: string | null
          id: string
          image_url: string | null
          name: string
          other_muscles: string[] | null
          primary_muscle_group: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          equipment?: string | null
          exercise_type?: string | null
          id?: string
          image_url?: string | null
          name: string
          other_muscles?: string[] | null
          primary_muscle_group?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          equipment?: string | null
          exercise_type?: string | null
          id?: string
          image_url?: string | null
          name?: string
          other_muscles?: string[] | null
          primary_muscle_group?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_plan_exercises: {
        Row: {
          created_at: string
          id: string
          order_index: number
          workout_id: string
          workout_plan_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_index?: number
          workout_id: string
          workout_plan_id: string
        }
        Update: {
          created_at?: string
          id?: string
          order_index?: number
          workout_id?: string
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_plan_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_plan_exercises_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string
          days_of_week: number[] | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: number[] | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: number[] | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      workout_routines: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          total_calories: number
          total_duration: number
          updated_at: string
          user_id: string
          workout_ids: string[]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          total_calories?: number
          total_duration?: number
          updated_at?: string
          user_id: string
          workout_ids?: string[]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          total_calories?: number
          total_duration?: number
          updated_at?: string
          user_id?: string
          workout_ids?: string[]
        }
        Relationships: []
      }
      workouts: {
        Row: {
          calories_burned: number | null
          completed: boolean
          completed_at: string | null
          created_at: string
          duration_minutes: number
          id: string
          image_url: string | null
          name: string
          notes: string | null
          scheduled_date: string
          type: Database["public"]["Enums"]["workout_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          image_url?: string | null
          name: string
          notes?: string | null
          scheduled_date?: string
          type?: Database["public"]["Enums"]["workout_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          duration_minutes?: number
          id?: string
          image_url?: string | null
          name?: string
          notes?: string | null
          scheduled_date?: string
          type?: Database["public"]["Enums"]["workout_type"]
          updated_at?: string
          user_id?: string
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
      workout_type:
        | "cardio"
        | "strength"
        | "flexibility"
        | "sports"
        | "yoga"
        | "pilates"
        | "hiit"
        | "other"
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
      workout_type: [
        "cardio",
        "strength",
        "flexibility",
        "sports",
        "yoga",
        "pilates",
        "hiit",
        "other",
      ],
    },
  },
} as const
