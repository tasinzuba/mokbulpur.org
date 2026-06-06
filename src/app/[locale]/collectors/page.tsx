import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { getCollectorBalances } from "@/lib/db/collectors";
import { formatBDT } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import { UserCircle2, Phone, ArrowDownToLine, ArrowUpFromLine, Wallet, Hash } from "lucide-react";

export default async function CollectorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("collectorsPage");
  const tNav = await getTranslations("nav");
  const currentLocale = (await getLocale()) as Locale;
  const balances = await getCollectorBalances();

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {tNav("collectors")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
          {t("subtitle")}
        </p>
      </div>

      {balances.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted-bg/30 p-16 text-center text-muted">
          {t("empty")}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {balances.map((b, i) => {
            const name = currentLocale === "bn" ? b.collector.name_bn : b.collector.name_en;
            const altName = currentLocale === "bn" ? b.collector.name_en : b.collector.name_bn;
            const formatNum = (n: number) =>
              new Intl.NumberFormat(currentLocale === "bn" ? "bn-BD" : "en-US").format(n);

            return (
              <Card key={b.collector.id} className="relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#48cae4] via-[#22d3ee] to-[#0284c7]" />
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#48cae4]/8 blur-2xl" />

                <div className="relative flex items-start gap-5">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#48cae4]/20 to-[#0284c7]/10 text-[#0284c7] ring-1 ring-[#48cae4]/20">
                    <UserCircle2 className="h-9 w-9" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#0284c7]">
                      Collector {i + 1}
                    </div>
                    <h2 className="mt-1 text-xl font-bold tracking-tight text-foreground">
                      {name}
                      <span className="ml-1 text-sm font-normal text-muted">· {altName}</span>
                    </h2>
                    {b.collector.phone && (
                      <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
                        <Phone className="h-3.5 w-3.5" />
                        <span className="font-mono">{b.collector.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative mt-6 rounded-2xl border border-[#48cae4]/30 bg-gradient-to-br from-[#48cae4]/8 to-transparent p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0284c7]">
                    <Wallet className="h-3.5 w-3.5" />
                    {t("balance")}
                  </div>
                  <div className="mt-1 text-3xl font-bold tabular-nums text-foreground">
                    {formatBDT(b.balance, currentLocale)}
                  </div>
                </div>

                <dl className="relative mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-xl bg-muted-bg/40 p-3">
                    <dt className="flex items-center gap-1 text-xs text-muted">
                      <ArrowDownToLine className="h-3 w-3" />
                      {t("totalCollected")}
                    </dt>
                    <dd className="mt-0.5 font-semibold tabular-nums text-foreground">
                      {formatBDT(b.collected, currentLocale)}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-muted-bg/40 p-3">
                    <dt className="flex items-center gap-1 text-xs text-muted">
                      <ArrowUpFromLine className="h-3 w-3" />
                      {t("totalPaidOut")}
                    </dt>
                    <dd className="mt-0.5 font-semibold tabular-nums text-foreground">
                      {formatBDT(b.paidOut, currentLocale)}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-muted-bg/40 p-3">
                    <dt className="flex items-center gap-1 text-xs text-muted">
                      <Hash className="h-3 w-3" />
                      {t("transactionsReceived")}
                    </dt>
                    <dd className="mt-0.5 font-semibold tabular-nums text-foreground">
                      {formatNum(b.paymentCount)}
                    </dd>
                  </div>
                </dl>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
