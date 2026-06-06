import { createClient } from "@/lib/supabase/server";

export interface OrgStats {
  totalCollected: number;
  totalSpent: number;
  balance: number;
  activeMembers: number;
}

const ZERO: OrgStats = {
  totalCollected: 0,
  totalSpent: 0,
  balance: 0,
  activeMembers: 0,
};

export async function getStats(): Promise<OrgStats> {
  try {
    const supabase = await createClient();

    const [paymentsRes, expensesRes, membersRes] = await Promise.all([
      supabase.from("payments").select("amount, fine_amount"),
      supabase.from("expenses").select("amount"),
      supabase
        .from("members")
        .select("id", { count: "exact", head: true })
        .eq("active", true),
    ]);

    if (paymentsRes.error) {
      console.warn("[stats] payments query failed — run schema.sql?", paymentsRes.error.message);
      return ZERO;
    }
    if (expensesRes.error) {
      console.warn("[stats] expenses query failed", expensesRes.error.message);
      return ZERO;
    }
    if (membersRes.error) {
      console.warn("[stats] members query failed", membersRes.error.message);
      return ZERO;
    }

    const totalCollected = paymentsRes.data.reduce(
      (sum, p) => sum + p.amount + p.fine_amount,
      0,
    );
    const totalSpent = expensesRes.data.reduce(
      (sum, e) => sum + e.amount,
      0,
    );

    return {
      totalCollected,
      totalSpent,
      balance: totalCollected - totalSpent,
      activeMembers: membersRes.count ?? 0,
    };
  } catch (error) {
    console.error("[stats] unexpected error", error);
    return ZERO;
  }
}
