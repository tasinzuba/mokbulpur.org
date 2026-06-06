import { createClient } from "@/lib/supabase/server";
import type { Member, Payment, Collector, Settings } from "@/lib/supabase/types";

export interface SheetData {
  members: Member[];
  payments: Payment[];
  collectors: Collector[];
  settings: Settings;
  error?: string;
}

const DEFAULT_SETTINGS: Settings = {
  id: 1,
  org_name: "Mokbulpur Probasi",
  joining_amount: 5000,
  monthly_amount: 2000,
  collection_day_start: 1,
  collection_day_end: 10,
  fine_per_month: 0,
  founded_year: new Date().getFullYear(),
  updated_at: new Date().toISOString(),
};

export async function getSheetData(): Promise<SheetData> {
  try {
    const supabase = await createClient();

    const [membersRes, paymentsRes, collectorsRes, settingsRes] =
      await Promise.all([
        supabase
          .from("members")
          .select("*")
          .order("joined_year", { ascending: true })
          .order("joined_month", { ascending: true })
          .order("name_en", { ascending: true }),
        supabase.from("payments").select("*"),
        supabase
          .from("collectors")
          .select("*")
          .order("display_order", { ascending: true }),
        supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
      ]);

    if (membersRes.error) {
      return {
        members: [],
        payments: [],
        collectors: [],
        settings: DEFAULT_SETTINGS,
        error: membersRes.error.message,
      };
    }

    return {
      members: membersRes.data ?? [],
      payments: paymentsRes.data ?? [],
      collectors: collectorsRes.data ?? [],
      settings: settingsRes.data ?? DEFAULT_SETTINGS,
    };
  } catch (error) {
    return {
      members: [],
      payments: [],
      collectors: [],
      settings: DEFAULT_SETTINGS,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
