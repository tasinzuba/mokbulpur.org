import { getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/Card";
import { Wallet, TrendingDown, PiggyBank, Users } from "lucide-react";
import { getStats } from "@/lib/db/stats";
import { formatBDT } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export async function LiveStats() {
  const t = await getTranslations("landing.stats");
  const locale = (await getLocale()) as Locale;
  const stats = await getStats();

  const formatNum = (n: number) =>
    new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US").format(n);

  const cards = [
    {
      label: t("totalCollected"),
      value: formatBDT(stats.totalCollected, locale),
      Icon: Wallet,
      glow: "from-[#48cae4]/20 to-[#48cae4]/0",
      iconBg: "bg-[#48cae4]/15 text-[#0284c7] ring-1 ring-[#48cae4]/30",
    },
    {
      label: t("totalSpent"),
      value: formatBDT(stats.totalSpent, locale),
      Icon: TrendingDown,
      glow: "from-amber-400/15 to-amber-600/0",
      iconBg: "bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/25",
    },
    {
      label: t("balance"),
      value: formatBDT(stats.balance, locale),
      Icon: PiggyBank,
      glow: "from-[#0284c7]/20 to-[#0284c7]/0",
      iconBg: "bg-[#0284c7]/10 text-[#0284c7] ring-1 ring-[#0284c7]/25",
    },
    {
      label: t("members"),
      value: formatNum(stats.activeMembers),
      Icon: Users,
      glow: "from-cyan-400/20 to-cyan-600/0",
      iconBg: "bg-cyan-500/10 text-cyan-700 ring-1 ring-cyan-500/25",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24">
      <Container>
        <div className="mb-12 flex items-end justify-between gap-6">
          <SectionHeader eyebrow={t("title")} title={t("title")} />
          <div className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0284c7] sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#48cae4] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#48cae4]" />
            </span>
            LIVE
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ label, value, Icon, glow, iconBg }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-white via-white to-[#48cae4]/8 p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[#48cae4]/40 hover:shadow-[var(--shadow-card)]"
            >
              <div
                className={`absolute -right-12 -top-12 -z-10 h-40 w-40 rounded-full bg-gradient-to-br ${glow} blur-2xl transition-opacity duration-300 opacity-60 group-hover:opacity-100`}
              />
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl ${iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-6">
                <div className="text-sm font-medium text-muted">{label}</div>
                <div className="mt-1.5 text-3xl font-bold tracking-tight tabular-nums text-foreground sm:text-4xl">
                  {value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
