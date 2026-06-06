"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

const CATEGORIES = ["mosque", "graveyard", "needy", "road", "event", "other"] as const;

export async function addExpenseAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const titleBn = String(formData.get("title_bn") ?? "").trim();
  const titleEn = String(formData.get("title_en") ?? "").trim();
  const descriptionBn = String(formData.get("description_bn") ?? "").trim();
  const descriptionEn = String(formData.get("description_en") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const expenseDate = String(formData.get("expense_date") ?? "").trim();
  const paidFromCollectorId = String(
    formData.get("paid_from_collector_id") ?? "",
  ).trim();
  const receiptUrl = String(formData.get("receipt_url") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!titleBn || !titleEn || !category || !amount || !expenseDate) {
    return { error: "missing" };
  }
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { error: "invalid-category" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("expenses").insert({
    title_bn: titleBn,
    title_en: titleEn,
    description_bn: descriptionBn || null,
    description_en: descriptionEn || null,
    category: category as (typeof CATEGORIES)[number],
    amount,
    expense_date: expenseDate,
    paid_from_collector_id: paidFromCollectorId || null,
    receipt_url: receiptUrl || null,
    note: note || null,
    created_by: user?.id ?? null,
  });

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  const locale = await getLocale();
  redirect(`/${locale}/expenses`);
}
