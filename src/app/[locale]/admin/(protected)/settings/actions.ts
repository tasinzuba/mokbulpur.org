"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettingsAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const orgName = String(formData.get("org_name") ?? "").trim();
  const joiningAmount = Number(formData.get("joining_amount"));
  const monthlyAmount = Number(formData.get("monthly_amount"));
  const collectionDayStart = Number(formData.get("collection_day_start"));
  const collectionDayEnd = Number(formData.get("collection_day_end"));
  const finePerMonth = Number(formData.get("fine_per_month") ?? 0);
  const foundedYear = Number(formData.get("founded_year"));

  if (!orgName || !joiningAmount || !monthlyAmount || !foundedYear) {
    return { error: "missing" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({
      org_name: orgName,
      joining_amount: joiningAmount,
      monthly_amount: monthlyAmount,
      collection_day_start: collectionDayStart,
      collection_day_end: collectionDayEnd,
      fine_per_month: finePerMonth,
      founded_year: foundedYear,
    })
    .eq("id", 1);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}
