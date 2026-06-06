"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function addPaymentAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const memberId = String(formData.get("member_id") ?? "").trim();
  const collectorId = String(formData.get("collector_id") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const fineAmount = Number(formData.get("fine_amount") ?? 0);
  const method = String(formData.get("method") ?? "").trim();
  const transactionId = String(formData.get("transaction_id") ?? "").trim();
  const paymentDate = String(formData.get("payment_date") ?? "").trim();
  const forYear = Number(formData.get("for_year"));
  const forMonth = Number(formData.get("for_month"));
  const isJoiningPayment = formData.get("is_joining_payment") === "on";
  const note = String(formData.get("note") ?? "").trim();

  if (
    !memberId ||
    !collectorId ||
    !amount ||
    !method ||
    !paymentDate ||
    !forYear ||
    !forMonth
  ) {
    return { error: "missing" };
  }
  if (!["bkash", "nagad", "cash"].includes(method)) {
    return { error: "invalid-method" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("payments").insert({
    member_id: memberId,
    collector_id: collectorId,
    amount,
    fine_amount: fineAmount || 0,
    method: method as "bkash" | "nagad" | "cash",
    transaction_id: transactionId || null,
    payment_date: paymentDate,
    for_year: forYear,
    for_month: forMonth,
    is_joining_payment: isJoiningPayment,
    note: note || null,
    created_by: user?.id ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "duplicate" };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  const locale = await getLocale();
  redirect(`/${locale}/payments`);
}
