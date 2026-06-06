import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/lib/supabase/types";

export async function getMembers(): Promise<Member[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("joined_year", { ascending: true })
      .order("joined_month", { ascending: true })
      .order("name_en", { ascending: true });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getActiveMembers(): Promise<Member[]> {
  const all = await getMembers();
  return all.filter((m) => m.active);
}
