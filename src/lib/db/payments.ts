import { createClient } from "@/lib/supabase/server";
import type {
  Payment,
  Member,
  Collector,
} from "@/lib/supabase/types";

export type PaymentWithRelations = Payment & {
  member: Pick<
    Member,
    "id" | "name_bn" | "name_en" | "photo_url" | "country" | "country_flag"
  > | null;
  collector: Pick<Collector, "id" | "name_bn" | "name_en"> | null;
};

export async function getAllPayments(): Promise<PaymentWithRelations[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payments")
      .select(
        `
        *,
        member:members(id, name_bn, name_en, photo_url, country, country_flag),
        collector:collectors(id, name_bn, name_en)
      `,
      )
      .order("payment_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data ?? []) as unknown as PaymentWithRelations[];
  } catch {
    return [];
  }
}
