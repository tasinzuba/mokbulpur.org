import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { buttonStyles } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getStats } from "@/lib/db/stats";
import { formatBDT } from "@/lib/utils";
import { signOutAction } from "./actions";
import type { Locale } from "@/i18n/routing";
import {
  Plus,
  Receipt,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Wallet,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const user = await getCurrentUser();
  const stats = await getStats();
  const currentLocale = (await getLocale()) as Locale;

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email ??
    "Admin";

  const quickActions = [
    {
      href: "/admin/sheet",
      label: t("addPayment"),
      Icon: Plus,
      gradient: "from-[#48cae4] to-[#0284c7]",
    },
    {
      href: "/admin/expenses/new",
      label: t("addExpense"),
      Icon: Receipt,
      gradient: "from-amber-400 to-amber-600",
    },
    {
      href: "/admin/members",
      label: t("addMember"),
      Icon: Users,
      gradient: "from-[#22d3ee] to-[#0284c7]",
    },
    {
      href: "/admin/settings",
      label: t("settings"),
      Icon: SettingsIcon,
      gradient: "from-[#48cae4] to-[#075985]",
    },
  ];

  const statCards = [
    {
      label: t("totalCollected"),
      value: formatBDT(stats.totalCollected, currentLocale),
      Icon: Wallet,
      tone: "text-[#0284c7]",
    },
    {
      label: t("totalSpent"),
      value: formatBDT(stats.totalSpent, currentLocale),
      Icon: TrendingDown,
      tone: "text-amber-600",
    },
    {
      label: t("balance"),
      value: formatBDT(stats.balance, currentLocale),
      Icon: PiggyBank,
      tone: "text-[#22d3ee]",
    },
  ];

  return (
    <Container className="py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium uppercase tracking-wider text-primary">
            {t("panel")}
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("welcome", { name: displayName })}
          </h1>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className={buttonStyles({ variant: "secondary", size: "md" })}
          >
            <LogOut className="h-4 w-4" />
            {t("signOut")}
          </button>
        </form>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value, Icon, tone }) => (
          <Card key={label} className="flex items-start gap-4">
            <div className={`grid h-11 w-11 place-items-center rounded-xl bg-muted-bg ${tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted">{label}</div>
              <div className="mt-0.5 text-2xl font-bold tabular-nums text-foreground">
                {value}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {t("quickActions")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map(({ href, label, Icon, gradient }) => (
          <Link key={href} href={href} className="block">
            <Card className="flex flex-col items-start gap-3 transition-all hover:-translate-y-0.5 hover:border-[#48cae4]/40">
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md shadow-[#48cae4]/20`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="font-semibold text-foreground">{label}</div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
