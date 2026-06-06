import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { getAllExpenses } from "@/lib/db/expenses";
import { formatBDT, formatDate } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import { Receipt, Building2, Trees, HeartHandshake, Route, PartyPopper, MoreHorizontal, ExternalLink } from "lucide-react";

const CATEGORY_META: Record<
  string,
  { Icon: React.ComponentType<{ className?: string }>; tone: string }
> = {
  mosque: { Icon: Building2, tone: "bg-emerald-100 text-emerald-700" },
  graveyard: { Icon: Trees, tone: "bg-green-100 text-green-700" },
  needy: { Icon: HeartHandshake, tone: "bg-rose-100 text-rose-700" },
  road: { Icon: Route, tone: "bg-amber-100 text-amber-700" },
  event: { Icon: PartyPopper, tone: "bg-purple-100 text-purple-700" },
  other: { Icon: MoreHorizontal, tone: "bg-stone-100 text-stone-700" },
};

export default async function ExpensesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("expensesList");
  const tNav = await getTranslations("nav");
  const currentLocale = (await getLocale()) as Locale;
  const expenses = await getAllExpenses();
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {tNav("expenses")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            {t("subtitle")}
          </p>
        </div>
        {expenses.length > 0 && (
          <div className="rounded-2xl border border-border bg-gradient-to-br from-[#48cae4] to-[#0284c7] px-5 py-3 text-white shadow-[var(--shadow-brand)]">
            <div className="text-xs font-semibold uppercase tracking-wider opacity-90">
              {t("totalSpent")}
            </div>
            <div className="mt-0.5 text-2xl font-bold tabular-nums">
              {formatBDT(total, currentLocale)}
            </div>
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted-bg/30 p-16 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white">
            <Receipt className="h-7 w-7" />
          </div>
          <p className="text-muted">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expenses.map((e) => {
            const meta = CATEGORY_META[e.category] ?? CATEGORY_META.other;
            const title = currentLocale === "bn" ? e.title_bn : e.title_en;
            const desc =
              currentLocale === "bn" ? e.description_bn : e.description_en;
            const categoryLabel = t(
              `category${e.category.charAt(0).toUpperCase() + e.category.slice(1)}` as
                | "categoryMosque"
                | "categoryGraveyard"
                | "categoryNeedy"
                | "categoryRoad"
                | "categoryEvent"
                | "categoryOther",
            );
            const collectorName = e.paid_from
              ? currentLocale === "bn"
                ? e.paid_from.name_bn
                : e.paid_from.name_en
              : null;

            return (
              <Card key={e.id} className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${meta.tone}`}
                  >
                    <meta.Icon className="h-5 w-5" />
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold tabular-nums text-foreground">
                      {formatBDT(e.amount, currentLocale)}
                    </div>
                    <div className="text-xs text-muted">
                      {formatDate(e.expense_date, currentLocale)}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold leading-tight text-foreground">
                    {title}
                  </h3>
                  {desc && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {desc}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 text-xs">
                  <span className={`rounded-full px-2 py-0.5 font-semibold ${meta.tone}`}>
                    {categoryLabel}
                  </span>
                  {collectorName && (
                    <span className="text-muted">
                      {t("colCollector")}: <strong className="text-foreground">{collectorName}</strong>
                    </span>
                  )}
                  {e.receipt_url && (
                    <a
                      href={e.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 font-medium text-[#0284c7] hover:bg-[#48cae4]/8"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {t("viewReceipt")}
                    </a>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
