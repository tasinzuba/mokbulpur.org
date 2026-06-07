import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/lib/supabase/types";

export type MemberContribution = {
  member: Member;
  totalPaid: number;
  paymentCount: number;
  latestPaymentDate: string | null;
  paidThisMonth: boolean;
};

export async function getMemberContributions(): Promise<MemberContribution[]> {
  try {
    const supabase = await createClient();
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth() + 1;

    const [membersRes, paymentsRes] = await Promise.all([
      supabase
        .from("members")
        .select("*")
        .order("name_en", { ascending: true }),
      supabase
        .from("payments")
        .select("member_id, amount, fine_amount, payment_date, for_year, for_month"),
    ]);

    if (membersRes.error || paymentsRes.error) return [];

    const members = membersRes.data ?? [];
    const payments = paymentsRes.data ?? [];

    const list = members.map((m) => {
      const memberPayments = payments.filter((p) => p.member_id === m.id);
      const totalPaid = memberPayments.reduce(
        (s, p) => s + p.amount + p.fine_amount,
        0,
      );
      const dates = memberPayments
        .map((p) => p.payment_date)
        .sort();
      const latestPaymentDate = dates.at(-1) ?? null;
      const paidThisMonth = memberPayments.some(
        (p) => p.for_year === thisYear && p.for_month === thisMonth,
      );
      return {
        member: m,
        totalPaid,
        paymentCount: memberPayments.length,
        latestPaymentDate,
        paidThisMonth,
      };
    });

    return list.sort((a, b) => b.totalPaid - a.totalPaid);
  } catch {
    return [];
  }
}
