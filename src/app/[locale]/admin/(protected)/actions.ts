"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = await getLocale();
  redirect(`/${locale}`);
}
