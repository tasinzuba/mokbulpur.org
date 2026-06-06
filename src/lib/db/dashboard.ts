import { createClient } from "@/lib/supabase/server";

export type MonthlyTotal = {
  year: number;
  month: number;
  collected: number;
  spent: number;
};

export async function getMonthlyTotals(
  monthsBack = 12,
): Promise<MonthlyTotal[]> {
  try {
    const supabase = await createClient();
    const now = new Date();

    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1);
    const startIso = startDate.toISOString().slice(0, 10);

    const [paymentsRes, expensesRes] = await Promise.all([
      supabase
        .from("payments")
        .select("for_year, for_month, amount, fine_amount")
        .gte("payment_date", startIso),
      supabase
        .from("expenses")
        .select("expense_date, amount")
        .gte("expense_date", startIso),
    ]);

    const payments = paymentsRes.data ?? [];
    const expenses = expensesRes.data ?? [];

    const buckets: MonthlyTotal[] = [];
    for (let i = 0; i < monthsBack; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1 - i), 1);
      buckets.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        collected: 0,
        spent: 0,
      });
    }

    for (const p of payments) {
      const bucket = buckets.find(
        (b) => b.year === p.for_year && b.month === p.for_month,
      );
      if (bucket) bucket.collected += p.amount + p.fine_amount;
    }
    for (const e of expenses) {
      const d = new Date(e.expense_date);
      const bucket = buckets.find(
        (b) => b.year === d.getFullYear() && b.month === d.getMonth() + 1,
      );
      if (bucket) bucket.spent += e.amount;
    }

    return buckets;
  } catch {
    return [];
  }
}

export type RecentActivity = {
  type: "payment" | "expense";
  id: string;
  title: string;
  amount: number;
  date: string;
  subtitle: string;
};

export async function getRecentActivity(limit = 10): Promise<RecentActivity[]> {
  try {
    const supabase = await createClient();
    const [paymentsRes, expensesRes] = await Promise.all([
      supabase
        .from("payments")
        .select(`*, member:members(name_bn, name_en)`)
        .order("payment_date", { ascending: false })
        .limit(limit),
      supabase
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false })
        .limit(limit),
    ]);

    const activities: RecentActivity[] = [];

    for (const p of paymentsRes.data ?? []) {
      const m = (p as { member?: { name_bn: string; name_en: string } }).member;
      activities.push({
        type: "payment",
        id: p.id,
        title: m ? `${m.name_bn}` : "Member",
        subtitle: m ? m.name_en : "",
        amount: p.amount + p.fine_amount,
        date: p.payment_date,
      });
    }
    for (const e of expensesRes.data ?? []) {
      activities.push({
        type: "expense",
        id: e.id,
        title: e.title_bn,
        subtitle: e.category,
        amount: e.amount,
        date: e.expense_date,
      });
    }

    activities.sort((a, b) => b.date.localeCompare(a.date));
    return activities.slice(0, limit);
  } catch {
    return [];
  }
}
