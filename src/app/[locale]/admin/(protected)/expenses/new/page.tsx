import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { AddExpenseForm } from "./AddExpenseForm";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Receipt } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function NewExpensePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const tForm = await getTranslations("expenseForm");

  const supabase = await createClient();
  const { data: collectors } = await supabase
    .from("collectors")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  return (
    <Container className="py-10">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("dashboard")}
        </Link>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md">
            <Receipt className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {tForm("title")}
          </h1>
          <p className="mt-2 text-muted">{tForm("subtitle")}</p>
        </div>

        <Card>
          <AddExpenseForm collectors={collectors ?? []} />
        </Card>
      </div>
    </Container>
  );
}
