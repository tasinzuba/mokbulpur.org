import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { buttonStyles } from "@/components/ui/button";
import { getStats } from "@/lib/db/stats";
import { getMonthlyTotals, getRecentActivity } from "@/lib/db/dashboard";
import { getExpensesByCategory } from "@/lib/db/expenses";
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { formatBDT, formatDate, monthLabel } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import {
  Wallet,
  TrendingDown,
  PiggyBank,
  Users,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboardPage");
  const tStats = await getTranslations("landing.stats");
  const tExpenses = await getTranslations("expensesList");
  const currentLocale = (await getLocale()) as Locale;

  const [stats, monthly, byCategory, activity] = await Promise.all([
    getStats(),
    getMonthlyTotals(12),
    getExpensesByCategory(),
    getRecentActivity(8),
  ]);

  const monthlyData = monthly.map((m) => ({
    label: monthLabel(m.year, m.month, currentLocale).split(" ")[0],
    collected: m.collected,
    spent: m.spent,
  }));

  const categoryData = Object.entries(byCategory).map(([key, value]) => ({
    label: tExpenses(
      `category${key.charAt(0).toUpperCase() + key.slice(1)}` as
        | "categoryMosque"
        | "categoryGraveyard"
        | "categoryNeedy"
        | "categoryRoad"
        | "categoryEvent"
        | "categoryOther",
    ),
    value,
  }));

  const statCards = [
    {
      label: tStats("totalCollected"),
      value: formatBDT(stats.totalCollected, currentLocale),
      Icon: Wallet,
      iconBg: "bg-[#48cae4]/15 text-[#0284c7]",
    },
    {
      label: tStats("totalSpent"),
      value: formatBDT(stats.totalSpent, currentLocale),
      Icon: TrendingDown,
      iconBg: "bg-amber-100 text-amber-700",
    },
    {
      label: tStats("balance"),
      value: formatBDT(stats.balance, currentLocale),
      Icon: PiggyBank,
      iconBg: "bg-[#0284c7]/10 text-[#0284c7]",
    },
    {
      label: tStats("members"),
      value: new Intl.NumberFormat(
        currentLocale === "bn" ? "bn-BD" : "en-US",
      ).format(stats.activeMembers),
      Icon: Users,
      iconBg: "bg-cyan-100 text-cyan-700",
    },
  ];

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
          {t("subtitle")}
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, Icon, iconBg }) => (
          <Card key={label} className="flex flex-col gap-4">
            <div
              className={`grid h-11 w-11 place-items-center rounded-xl ${iconBg}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted">{label}</div>
              <div className="mt-1 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                {value}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-8 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2" hover={false}>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {t("monthlyTrend")}
            </h2>
          </div>
          <MonthlyTrendChart
            data={monthlyData}
            collectedLabel={t("labelCollected")}
            spentLabel={t("labelSpent")}
          />
        </Card>

        <Card hover={false}>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {t("categoryBreakdown")}
            </h2>
          </div>
          <CategoryPieChart data={categoryData} />
        </Card>
      </div>

      <Card hover={false}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            {t("recentActivity")}
          </h2>
          <div className="flex gap-2 text-xs">
            <Link
              href="/payments"
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              {t("viewAllPayments")}
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link
              href="/expenses"
              className={buttonStyles({ variant: "secondary", size: "sm" })}
            >
              {t("viewAllExpenses")}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {activity.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted">
            {t("noActivity")}
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {activity.map((a) => (
              <li key={`${a.type}-${a.id}`} className="flex items-center gap-3 py-3">
                <div
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                    a.type === "payment"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {a.type === "payment" ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-foreground">
                    {a.title}
                  </div>
                  {a.subtitle && (
                    <div className="truncate text-xs text-muted">
                      {a.subtitle}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold tabular-nums ${
                      a.type === "payment"
                        ? "text-emerald-700"
                        : "text-amber-700"
                    }`}
                  >
                    {a.type === "payment" ? "+" : "−"}
                    {formatBDT(a.amount, currentLocale)}
                  </div>
                  <div className="text-xs text-muted">
                    {formatDate(a.date, currentLocale)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Container>
  );
}
