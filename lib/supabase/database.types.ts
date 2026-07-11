export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: Database["public"]["Enums"]["user_role"];
          account_status: Database["public"]["Enums"]["account_status"];
          phone: string;
          guardian_name: string;
          address: string;
          must_change_password: boolean;
          joined_on: string;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: Database["public"]["Enums"]["user_role"];
          account_status?: Database["public"]["Enums"]["account_status"];
          phone?: string;
          guardian_name?: string;
          address?: string;
          must_change_password?: boolean;
          joined_on?: string;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      user_courses: {
        Row: { user_id: string; course: Database["public"]["Enums"]["course_code"]; created_at: string };
        Insert: { user_id: string; course: Database["public"]["Enums"]["course_code"]; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["user_courses"]["Insert"]>;
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          title: string;
          course: Database["public"]["Enums"]["course_code"];
          category: Database["public"]["Enums"]["resource_type"];
          status: Database["public"]["Enums"]["resource_status"];
          url: string;
          answer_url: string | null;
          answer_release_status: Database["public"]["Enums"]["answer_release_status"];
          description: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          course: Database["public"]["Enums"]["course_code"];
          category: Database["public"]["Enums"]["resource_type"];
          status?: Database["public"]["Enums"]["resource_status"];
          url: string;
          answer_url?: string | null;
          answer_release_status?: Database["public"]["Enums"]["answer_release_status"];
          description?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["resources"]["Insert"]>;
        Relationships: [];
      };
      student_performance: {
        Row: {
          student_id: string;
          attendance: number;
          completion: number;
          rank: number;
          last_assessment: string;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          student_id: string;
          attendance?: number;
          completion?: number;
          rank?: number;
          last_assessment?: string;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["student_performance"]["Insert"]>;
        Relationships: [];
      };
      student_scores: {
        Row: {
          id: string;
          student_id: string;
          course: Database["public"]["Enums"]["course_code"];
          test_name: string;
          score: number;
          assessment_date: string;
          notes: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course: Database["public"]["Enums"]["course_code"];
          test_name: string;
          score: number;
          assessment_date: string;
          notes?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["student_scores"]["Insert"]>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          student_id: string;
          label: string;
          amount: number;
          payment_date: string;
          method: Database["public"]["Enums"]["payment_method"];
          invoice_number: string;
          status: Database["public"]["Enums"]["payment_status"];
          notes: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          label: string;
          amount: number;
          payment_date: string;
          method: Database["public"]["Enums"]["payment_method"];
          invoice_number?: string;
          status?: Database["public"]["Enums"]["payment_status"];
          notes?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [];
      };
      enquiries: {
        Row: {
          id: string;
          full_name: string;
          contact: string;
          course: string;
          preferred_time: string;
          message: string;
          status: Database["public"]["Enums"]["enquiry_status"];
          source: string;
          ip_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          contact: string;
          course: string;
          preferred_time: string;
          message?: string;
          status?: Database["public"]["Enums"]["enquiry_status"];
          source?: string;
          ip_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["enquiries"]["Insert"]>;
        Relationships: [];
      };
      request_rate_limits: {
        Row: { rate_key: string; window_started_at: string; request_count: number; updated_at: string };
        Insert: { rate_key: string; window_started_at?: string; request_count?: number; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["request_rate_limits"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: number;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: never;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      update_my_profile: { Args: { p_phone: string; p_guardian_name: string; p_address: string }; Returns: undefined };
      mark_password_changed: { Args: Record<PropertyKey, never>; Returns: undefined };
      touch_last_seen: { Args: Record<PropertyKey, never>; Returns: undefined };
      current_user_role: { Args: Record<PropertyKey, never>; Returns: Database["public"]["Enums"]["user_role"] };
      consume_request_rate_limit: {
        Args: { p_key: string; p_limit: number; p_window_seconds: number };
        Returns: Array<{ allowed: boolean; retry_after: number }>;
      };
      service_save_managed_account: {
        Args: {
          p_user_id: string;
          p_full_name: string;
          p_email: string;
          p_role: Database["public"]["Enums"]["user_role"];
          p_account_status: Database["public"]["Enums"]["account_status"];
          p_phone: string;
          p_guardian_name: string;
          p_address: string;
          p_courses: Database["public"]["Enums"]["course_code"][];
          p_actor_id: string;
          p_action: string;
        };
        Returns: Database["public"]["Enums"]["user_role"];
      };
      service_set_account_status: {
        Args: {
          p_user_id: string;
          p_status: Database["public"]["Enums"]["account_status"];
          p_actor_id: string;
        };
        Returns: undefined;
      };
      service_mark_password_reset: {
        Args: { p_user_id: string; p_actor_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      user_role: "admin" | "teacher" | "student";
      account_status: "active" | "suspended";
      course_code: "PCM" | "IELTS" | "French";
      resource_type: "Live Test" | "Previous Test" | "Revision Material" | "Study Material";
      resource_status: "Upcoming" | "Live" | "Archived";
      answer_release_status: "Hidden" | "Published";
      payment_method: "UPI" | "Card" | "Cash" | "Bank Transfer" | "Other";
      payment_status: "Paid" | "Pending" | "Refunded";
      enquiry_status: "new" | "contacted" | "qualified" | "closed";
    };
    CompositeTypes: Record<string, never>;
  };
};
