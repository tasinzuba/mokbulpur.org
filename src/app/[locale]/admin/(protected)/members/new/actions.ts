"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function addMemberAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const nameBn = String(formData.get("name_bn") ?? "").trim();
  const nameEn = String(formData.get("name_en") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const countryFlag = String(formData.get("country_flag") ?? "").trim();
  const photoUrl = String(formData.get("photo_url") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const joinedYear = Number(formData.get("joined_year"));
  const joinedMonth = Number(formData.get("joined_month"));

  if (!nameBn || !nameEn || !joinedYear || !joinedMonth) {
    return { error: "missing" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("members").insert({
    name_bn: nameBn,
    name_en: nameEn,
    phone: phone || null,
    country: country || null,
    country_flag: countryFlag || null,
    photo_url: photoUrl || null,
    notes: notes || null,
    joined_year: joinedYear,
    joined_month: joinedMonth,
    active: true,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  const locale = await getLocale();
  redirect(`/${locale}/admin/members`);
}
