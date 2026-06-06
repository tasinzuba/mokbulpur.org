"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export async function setupFirstAdminAction(
  _prev: { error?: string } | null,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim();

  if (!email || !password || !displayName) {
    return { error: "missing-fields" };
  }
  if (password.length < 8) {
    return { error: "password-too-short" };
  }

  const admin = createAdminClient();

  const { count, error: countError } = await admin
    .from("admins")
    .select("user_id", { count: "exact", head: true });

  if (countError) {
    return { error: `schema-not-ready: ${countError.message}` };
  }
  if ((count ?? 0) > 0) {
    return { error: "already-set-up" };
  }

  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });

  if (createError || !created.user) {
    return { error: createError?.message ?? "create-failed" };
  }

  const { error: insertError } = await admin.from("admins").insert({
    user_id: created.user.id,
    display_name: displayName,
  });

  if (insertError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { error: insertError.message };
  }

  const supabase = await createClient();
  await supabase.auth.signInWithPassword({ email, password });

  const locale = await getLocale();
  redirect(`/${locale}/admin`);
}
