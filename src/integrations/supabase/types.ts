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
          currency: string | null
          current_balance: number | null
          debt_name: string | null
          debt_type: string | null
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
          currency?: string | null
          current_balance?: number | null
          debt_name?: string | null
          debt_type?: string | null
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
          currency?: string | null
          current_balance?: number | null
          debt_name?: string | null
          debt_type?: string | null
          due_date?: string | null
          id?: string
          interest_rate?: number | null
          minimum_payment?: number | null
          original_amount?: number | null
          paid_off_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      exchange_rates: {
        Row: {
          base_currency: string
          id: string
          rate: number
          target_currency: string
          updated_at: string
        }
        Insert: {
          base_currency: string
          id?: string
          rate: number
          target_currency: string
          updated_at?: string
        }
        Update: {
          base_currency?: string
          id?: string
          rate?: number
          target_currency?: string
          updated_at?: string
        }
        Relationships: []
      }
      financial_goals: {
        Row: {
          created_at: string
          currency: string
          current_amount: number
          goal_name: string
          id: string
          target_amount: number
          target_date: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          current_amount?: number
          goal_name: string
          id?: string
          target_amount?: number
          target_date?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          current_amount?: number
          goal_name?: string
          id?: string
          target_amount?: number
          target_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      milestones: {
        Row: {
          achieved_date: string | null
          created_at: string | null
          id: string
          milestone_percent: number | null
          user_id: string | null
        }
        Insert: {
          achieved_date?: string | null
          created_at?: string | null
          id?: string
          milestone_percent?: number | null
          user_id?: string | null
        }
        Update: {
          achieved_date?: string | null
          created_at?: string | null
          id?: string
          milestone_percent?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      net_worth_snapshots: {
        Row: {
          created_at: string
          id: string
          net_worth: number
          snapshot_date: string
          total_debt: number
          total_savings: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          net_worth?: number
          snapshot_date?: string
          total_debt?: number
          total_savings?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          net_worth?: number
          snapshot_date?: string
          total_debt?: number
          total_savings?: number
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          message: string | null
          read_status: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          message?: string | null
          read_status?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          message?: string | null
          read_status?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number | null
          created_at: string | null
          debt_id: string | null
          id: string
          is_extra_payment: boolean | null
          notes: string | null
          payment_date: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          debt_id?: string | null
          id?: string
          is_extra_payment?: boolean | null
          notes?: string | null
          payment_date?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
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
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          default_currency: string | null
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          default_currency?: string | null
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          default_currency?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      savings_accounts: {
        Row: {
          account_name: string
          balance: number
          created_at: string
          currency: string
          id: string
          user_id: string
        }
        Insert: {
          account_name: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          user_id: string
        }
        Update: {
          account_name?: string
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      savings_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          notes: string | null
          savings_account_id: string
          transaction_date: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          savings_account_id: string
          transaction_date?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          savings_account_id?: string
          transaction_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_transactions_savings_account_id_fkey"
            columns: ["savings_account_id"]
            isOneToOne: false
            referencedRelation: "savings_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          current_period_end: string | null
          end_date: string | null
          id: string
          is_founding_member: boolean | null
          is_trial: boolean | null
          plan: string | null
          start_date: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          end_date?: string | null
          id?: string
          is_founding_member?: boolean | null
          is_trial?: boolean | null
          plan?: string | null
          start_date?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          end_date?: string | null
          id?: string
          is_founding_member?: boolean | null
          is_trial?: boolean | null
          plan?: string | null
          start_date?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          identity: string | null
          journey_start_date: string | null
          journey_starting_debt: number | null
          journey_type: string | null
          name: string | null
          reason: string | null
          selected_strategy: string | null
          timezone: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity?: string | null
          journey_start_date?: string | null
          journey_starting_debt?: number | null
          journey_type?: string | null
          name?: string | null
          reason?: string | null
          selected_strategy?: string | null
          timezone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity?: string | null
          journey_start_date?: string | null
          journey_starting_debt?: number | null
          journey_type?: string | null
          name?: string | null
          reason?: string | null
          selected_strategy?: string | null
          timezone?: string | null
        }
        Relationships: []
      }
      weekly_reports: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          id: string
          notes: string | null
          progress_percent: number | null
          user_id: string | null
          week_start: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          progress_percent?: number | null
          user_id?: string | null
          week_start?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          progress_percent?: number | null
          user_id?: string | null
          week_start?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      subscriptions_safe: {
        Row: {
          billing_cycle: string | null
          created_at: string | null
          current_period_end: string | null
          end_date: string | null
          id: string | null
          is_founding_member: boolean | null
          is_trial: boolean | null
          plan: string | null
          start_date: string | null
          status: string | null
          trial_ends_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          end_date?: string | null
          id?: string | null
          is_founding_member?: boolean | null
          is_trial?: boolean | null
          plan?: string | null
          start_date?: string | null
          status?: string | null
          trial_ends_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_cycle?: string | null
          created_at?: string | null
          current_period_end?: string | null
          end_date?: string | null
          id?: string | null
          is_founding_member?: boolean | null
          is_trial?: boolean | null
          plan?: string | null
          start_date?: string | null
          status?: string | null
          trial_ends_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
