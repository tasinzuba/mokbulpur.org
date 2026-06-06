export type PaymentMethod = "bkash" | "nagad" | "cash";
export type ExpenseCategory =
  | "mosque"
  | "graveyard"
  | "needy"
  | "road"
  | "event"
  | "other";

export type Settings = {
  id: number;
  org_name: string;
  joining_amount: number;
  monthly_amount: number;
  collection_day_start: number;
  collection_day_end: number;
  fine_per_month: number;
  founded_year: number;
  updated_at: string;
};

export type Collector = {
  id: string;
  name_bn: string;
  name_en: string;
  phone: string | null;
  display_order: number;
  active: boolean;
  created_at: string;
};

export type Member = {
  id: string;
  name_bn: string;
  name_en: string;
  phone: string | null;
  country: string | null;
  country_flag: string | null;
  photo_url: string | null;
  joined_year: number;
  joined_month: number;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  member_id: string;
  collector_id: string;
  amount: number;
  fine_amount: number;
  method: PaymentMethod;
  transaction_id: string | null;
  payment_date: string;
  for_year: number;
  for_month: number;
  is_joining_payment: boolean;
  note: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Expense = {
  id: string;
  title_bn: string;
  title_en: string;
  description_bn: string | null;
  description_en: string | null;
  category: ExpenseCategory;
  amount: number;
  expense_date: string;
  paid_from_collector_id: string | null;
  receipt_url: string | null;
  note: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Admin = {
  user_id: string;
  display_name: string | null;
  created_at: string;
};

type EmptyObject = Record<string, never>;

export type Database = {
  public: {
    Tables: {
      settings: {
        Row: Settings;
        Insert: Partial<Omit<Settings, "updated_at">> & { id?: number };
        Update: Partial<Omit<Settings, "id">>;
        Relationships: [];
      };
      collectors: {
        Row: Collector;
        Insert: Omit<Collector, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Collector, "id" | "created_at">>;
        Relationships: [];
      };
      members: {
        Row: Member;
        Insert: Omit<Member, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Member, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Payment, "id" | "created_at" | "updated_at">>;
        Relationships: [
          {
            foreignKeyName: "payments_member_id_fkey";
            columns: ["member_id"];
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_collector_id_fkey";
            columns: ["collector_id"];
            referencedRelation: "collectors";
            referencedColumns: ["id"];
          },
        ];
      };
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Expense, "id" | "created_at" | "updated_at">>;
        Relationships: [
          {
            foreignKeyName: "expenses_paid_from_collector_id_fkey";
            columns: ["paid_from_collector_id"];
            referencedRelation: "collectors";
            referencedColumns: ["id"];
          },
        ];
      };
      admins: {
        Row: Admin;
        Insert: { user_id: string; display_name?: string | null };
        Update: { display_name?: string | null };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: {
        Args: EmptyObject;
        Returns: boolean;
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
