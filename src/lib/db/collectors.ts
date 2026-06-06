import { createClient } from "@/lib/supabase/server";
import type { Collector } from "@/lib/supabase/types";

export type CollectorBalance = {
  collector: Collector;
  collected: number;
  paidOut: number;
  balance: number;
  paymentCount: number;
};

export async function getCollectorBalances(): Promise<CollectorBalance[]> {
  try {
    const supabase = await createClient();
    const [collectorsRes, paymentsRes, expensesRes] = await Promise.all([
      supabase
        .from("collectors")
        .select("*")
        .order("display_order", { ascending: true }),
      supabase.from("payments").select("collector_id, amount, fine_amount"),
      supabase.from("expenses").select("paid_from_collector_id, amount"),
    ]);

    if (collectorsRes.error) return [];

    const collectors = collectorsRes.data ?? [];
    const payments = paymentsRes.data ?? [];
    const expenses = expensesRes.data ?? [];

    return collectors.map((c) => {
      const collected = payments
        .filter((p) => p.collector_id === c.id)
        .reduce((sum, p) => sum + p.amount + p.fine_amount, 0);
      const paidOut = expenses
        .filter((e) => e.paid_from_collector_id === c.id)
        .reduce((sum, e) => sum + e.amount, 0);
      const paymentCount = payments.filter(
        (p) => p.collector_id === c.id,
      ).length;
      return {
        collector: c,
        collected,
        paidOut,
        balance: collected - paidOut,
        paymentCount,
      };
    });
  } catch {
    return [];
  }
}
