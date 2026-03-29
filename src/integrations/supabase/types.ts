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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      debts: {
        Row: {
          created_at: string | null
          current_balance: number | null
          debt_name: string | null
          due_date: string | null
          id: string
          interest_rate: number | null
          minimum_payment: number | null
          original_amount: number | null
          paid_off_date: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_balance?: number | null
          debt_name?: string | null
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          minimum_payment?: number | null
          original_amount?: number | null
          paid_off_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_balance?: number | null
          debt_name?: string | null
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          minimum_payment?: number | null
          original_amount?: number | null
          paid_off_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          achieved_date: string | null
          id: string
          milestone_percent: number | null
          user_id: string | null
        }
        Insert: {
          achieved_date?: string | null
          id?: string
          milestone_percent?: number | null
          user_id?: string | null
        }
        Update: {
          achieved_date?: string | null
          id?: string
          milestone_percent?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          date: string | null
          id: string
          message: string | null
          read_status: boolean | null
          user_id: string | null
        }
        Insert: {
          date?: string | null
          id?: string
          message?: string | null
          read_status?: boolean | null
          user_id?: string | null
        }
        Update: {
          date?: string | null
          id?: string
          message?: string | null
          read_status?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          debt_id: string | null
          id: string
          is_extra_payment: boolean | null
          notes: string | null
          payment_date: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          debt_id?: string | null
          id?: string
          is_extra_payment?: boolean | null
          notes?: string | null
          payment_date?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          debt_id?: string | null
          id?: string
          is_extra_payment?: boolean | null
          notes?: string | null
          payment_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "debts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          current_streak: number | null
          last_activity_date: string | null
          user_id: string | null
        }
        Insert: {
          current_streak?: number | null
          last_activity_date?: string | null
          user_id?: string | null
        }
        Update: {
          current_streak?: number | null
          last_activity_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          end_date: string | null
          id: string
          plan: string | null
          start_date: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          end_date?: string | null
          id?: string
          plan?: string | null
          start_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          end_date?: string | null
          id?: string
          plan?: string | null
          start_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          identity: string | null
          journey_type: string | null
          name: string | null
          password: string | null
          reason: string | null
          selected_strategy: string | null
          timezone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity?: string | null
          journey_type?: string | null
          name?: string | null
          password?: string | null
          reason?: string | null
          selected_strategy?: string | null
          timezone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity?: string | null
          journey_type?: string | null
          name?: string | null
          password?: string | null
          reason?: string | null
          selected_strategy?: string | null
          timezone?: string | null
        }
        Relationships: []
      }
      weekly_reports: {
        Row: {
          amount_paid: number | null
          id: string
          notes: string | null
          progress_percent: number | null
          user_id: string | null
          week_start: string | null
        }
        Insert: {
          amount_paid?: number | null
          id?: string
          notes?: string | null
          progress_percent?: number | null
          user_id?: string | null
          week_start?: string | null
        }
        Update: {
          amount_paid?: number | null
          id?: string
          notes?: string | null
          progress_percent?: number | null
          user_id?: string | null
          week_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
