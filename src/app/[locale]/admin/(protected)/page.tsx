import Image from "next/image";
import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { buttonStyles } from "@/components/ui/button";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { getCurrentUser } from "@/lib/auth";
import { getStats } from "@/lib/db/stats";
import { getMemberContributions } from "@/lib/db/admin-dashboard";
import { formatBDT, formatDate } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import {
  Plus,
  Receipt,
  UserPlus,
  Wallet,
  TrendingDown,
  PiggyBank,
  Trophy,
  Check,
  Clock,
} from "lucide-react";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const tDash = await getTranslations("adminDashboard");
  const tStats = await getTranslations("landing.stats");
  const user = await getCurrentUser();
  const stats = await getStats();
  const contributions = await getMemberContributions();
  const currentLocale = (await getLocale()) as Locale;

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    user?.email ??
    "Admin";

  const statCards = [
    {
      label: tStats("totalCollected"),
      value: formatBDT(stats.totalCollected, currentLocale),
      Icon: Wallet,
      tone: "from-[#48cae4]/15 to-[#48cae4]/0 text-[#0284c7]",
      iconBg: "bg-[#48cae4]/15 text-[#0284c7] ring-1 ring-[#48cae4]/30",
    },
    {
      label: tStats("totalSpent"),
      value: formatBDT(stats.totalSpent, currentLocale),
      Icon: TrendingDown,
      tone: "from-amber-200/30 to-amber-200/0 text-amber-700",
      iconBg: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    },
    {
      label: tStats("balance"),
      value: formatBDT(stats.balance, currentLocale),
      Icon: PiggyBank,
      tone: "from-cyan-200/30 to-cyan-200/0 text-cyan-700",
      iconBg: "bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200",
    },
  ];

  return (
    <Container className="py-8 sm:py-10">
      {/* Welcome */}
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#0284c7]">
          {t("panel")}
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {t("welcome", { name: displayName })}
        </h1>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value, Icon, tone, iconBg }) => (
          <Card
            key={label}
            className="group relative overflow-hidden"
            hover={false}
          >
            <div
              className={`absolute inset-0 -z-10 bg-gradient-to-br opacity-50 ${tone}`}
            />
            <div className="flex items-start justify-between gap-3">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5">
              <div className="text-sm font-medium text-muted">{label}</div>
              <div className="mt-1 text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                {value}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick action buttons */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/admin/payments/new"
          className={buttonStyles({ size: "sm" })}
        >
          <Plus className="h-4 w-4" />
          {t("addPayment")}
        </Link>
        <Link
          href="/admin/expenses/new"
          className={buttonStyles({ variant: "secondary", size: "sm" })}
        >
          <Receipt className="h-4 w-4" />
          {t("addExpense")}
        </Link>
        <Link
          href="/admin/members/new"
          className={buttonStyles({ variant: "secondary", size: "sm" })}
        >
          <UserPlus className="h-4 w-4" />
          {t("addNewMember")}
        </Link>
      </div>

      {/* Member contributions */}
      <Card hover={false}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
              <Trophy className="h-5 w-5 text-amber-500" />
              {tDash("memberContributionsTitle")}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {tDash("contributionsSubtitle")}
            </p>
          </div>
        </div>

        {contributions.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted">
            {tDash("emptyMembers")}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-xl border border-border lg:block">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted-bg/40">
                  <tr>
                    <Th align="center" width="w-12">{tDash("colRank")}</Th>
                    <Th>{tDash("colMember")}</Th>
                    <Th>{tDash("colCountry")}</Th>
                    <Th align="right">{tDash("colTotalPaid")}</Th>
                    <Th align="center">{tDash("colPayments")}</Th>
                    <Th>{tDash("colLastPaid")}</Th>
                    <Th align="center">{tDash("colThisMonth")}</Th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((c, i) => {
                    const name =
                      currentLocale === "bn"
                        ? c.member.name_bn
                        : c.member.name_en;
                    const altName =
                      currentLocale === "bn"
                        ? c.member.name_en
                        : c.member.name_bn;
                    return (
                      <tr
                        key={c.member.id}
                        className="border-b border-border/60 last:border-b-0 hover:bg-muted-bg/30"
                      >
                        <td className="px-4 py-3 text-center">
                          <RankBadge rank={i + 1} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar member={c.member} name={name} />
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-foreground">
                                {name}
                              </div>
                              <div className="truncate text-xs text-muted">
                                {altName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                          {(c.member.country_flag || c.member.country) && (
                            <div className="inline-flex items-center gap-1.5">
                              <CountryFlag
                                flag={c.member.country_flag}
                                alt={c.member.country ?? ""}
                              />
                              {c.member.country}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="font-bold tabular-nums text-foreground">
                            {formatBDT(c.totalPaid, currentLocale)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-medium tabular-nums text-foreground">
                          {new Intl.NumberFormat(
                            currentLocale === "bn" ? "bn-BD" : "en-US",
                          ).format(c.paymentCount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-muted">
                          {c.latestPaymentDate
                            ? formatDate(c.latestPaymentDate, currentLocale)
                            : tDash("noPayments")}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {c.paidThisMonth ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                              <Check className="h-3 w-3" />
                              {tDash("statusPaidThisMonth")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                              <Clock className="h-3 w-3" />
                              {tDash("statusPendingThisMonth")}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 lg:hidden">
              {contributions.map((c, i) => {
                const name =
                  currentLocale === "bn"
                    ? c.member.name_bn
                    : c.member.name_en;
                return (
                  <div
                    key={c.member.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start gap-3">
                      <RankBadge rank={i + 1} />
                      <Avatar member={c.member} name={name} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold text-foreground">
                          {name}
                        </div>
                        {(c.member.country_flag || c.member.country) && (
                          <div className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted">
                            <CountryFlag
                              flag={c.member.country_flag}
                              alt={c.member.country ?? ""}
                            />
                            {c.member.country}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold tabular-nums text-foreground">
                          {formatBDT(c.totalPaid, currentLocale)}
                        </div>
                        <div className="text-xs text-muted">
                          {c.paymentCount} {tDash("colPayments")}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                      <span className="text-muted">
                        {c.latestPaymentDate
                          ? formatDate(c.latestPaymentDate, currentLocale)
                          : tDash("noPayments")}
                      </span>
                      {c.paidThisMonth ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          <Check className="h-3 w-3" />
                          {tDash("statusPaidThisMonth")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700 ring-1 ring-amber-200">
                          <Clock className="h-3 w-3" />
                          {tDash("statusPendingThisMonth")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </Container>
  );
}

function Th({
  children,
  align = "left",
  width,
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
  width?: string;
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted ${
        align === "right"
          ? "text-right"
          : align === "center"
            ? "text-center"
            : "text-left"
      } ${width ?? ""}`}
    >
      {children}
    </th>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-xs font-bold text-white shadow-sm">
        🥇
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-stone-300 to-stone-500 text-xs font-bold text-white shadow-sm">
        🥈
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-700 text-xs font-bold text-white shadow-sm">
        🥉
      </span>
    );
  }
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted-bg text-xs font-bold text-muted">
      {rank}
    </span>
  );
}

function Avatar({
  member,
  name,
}: {
  member: { photo_url?: string | null };
  name: string;
}) {
  return (
    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted-bg">
      {member.photo_url ? (
        <Image
          src={member.photo_url}
          alt={name}
          fill
          sizes="40px"
          className="object-cover"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#48cae4]/15 to-[#0284c7]/10 text-sm font-semibold text-[#0284c7]">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}
