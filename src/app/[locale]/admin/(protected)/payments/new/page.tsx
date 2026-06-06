import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { AddPaymentForm } from "./AddPaymentForm";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function NewPaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    member_id?: string;
    year?: string;
    month?: string;
  }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const tForm = await getTranslations("paymentForm");

  const supabase = await createClient();
  const [membersRes, collectorsRes] = await Promise.all([
    supabase
      .from("members")
      .select("*")
      .eq("active", true)
      .order("name_en", { ascending: true }),
    supabase
      .from("collectors")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true }),
  ]);

  const members = membersRes.data ?? [];
  const collectors = collectorsRes.data ?? [];

  return (
    <Container className="py-10">
      <div className="mb-6">
        <Link
          href="/admin/sheet"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("monthlySheet.title")}
        </Link>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#48cae4] to-[#0284c7] text-white shadow-[var(--shadow-brand)]">
            <Plus className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {tForm("title")}
          </h1>
          <p className="mt-2 text-muted">{tForm("subtitle")}</p>
        </div>

        <Card>
          <AddPaymentForm
            members={members}
            collectors={collectors}
            defaultMemberId={sp.member_id}
            defaultYear={sp.year ? Number(sp.year) : undefined}
            defaultMonth={sp.month ? Number(sp.month) : undefined}
          />
        </Card>
      </div>
    </Container>
  );
}
