import { createClient } from "@/lib/supabase/server";
import type { Expense, Collector } from "@/lib/supabase/types";

export type ExpenseWithCollector = Expense & {
  paid_from: Pick<Collector, "id" | "name_bn" | "name_en"> | null;
};

export async function getAllExpenses(): Promise<ExpenseWithCollector[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("expenses")
      .select(`*, paid_from:collectors(id, name_bn, name_en)`)
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data ?? []) as unknown as ExpenseWithCollector[];
  } catch {
    return [];
  }
}

export async function getExpensesByCategory(): Promise<
  Record<string, number>
> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("expenses")
      .select("category, amount");
    if (error || !data) return {};
    return data.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amount;
      return acc;
    }, {});
  } catch {
    return {};
  }
}
