import Image from "next/image";
import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { getMembers } from "@/lib/db/members";
import { getStats } from "@/lib/db/stats";
import type { Locale } from "@/i18n/routing";
import { Users, UserPlus, Wallet } from "lucide-react";
import { formatBDT } from "@/lib/utils";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing.members");
  const tNav = await getTranslations("nav");
  const tStats = await getTranslations("landing.stats");
  const currentLocale = (await getLocale()) as Locale;
  const [members, stats] = await Promise.all([getMembers(), getStats()]);

  return (
    <Container className="py-10 sm:py-14">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {tNav("members")}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          {t("subtitle")}
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatPill
          Icon={Users}
          label={tStats("members")}
          value={String(stats.activeMembers)}
        />
        <StatPill
          Icon={Wallet}
          label={tStats("totalCollected")}
          value={formatBDT(stats.totalCollected, currentLocale)}
        />
        <StatPill
          Icon={UserPlus}
          label={t("memberCount", { count: members.length })}
          value=""
        />
      </div>

      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted-bg/30 p-16 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-card text-muted">
            <UserPlus className="h-7 w-7" />
          </div>
          <p className="text-muted">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((m) => {
            const name = currentLocale === "bn" ? m.name_bn : m.name_en;
            const altName = currentLocale === "bn" ? m.name_en : m.name_bn;
            return (
              <Card key={m.id} className="flex flex-col items-center text-center">
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-border bg-muted-bg shadow-sm">
                  {m.photo_url ? (
                    <Image
                      src={m.photo_url}
                      alt={name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/15 to-primary/5 text-4xl font-bold text-primary">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-lg font-semibold text-foreground">
                    {name}
                  </div>
                  <div className="text-sm text-muted">{altName}</div>
                  {(m.country_flag || m.country) && (
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-muted-bg px-3 py-1 text-xs font-medium text-muted">
                      <CountryFlag flag={m.country_flag} alt={m.country ?? ""} />
                      {m.country}
                    </div>
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

function StatPill({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </div>
        {value && (
          <div className="text-lg font-bold tabular-nums text-foreground">
            {value}
          </div>
        )}
      </div>
    </div>
  );
}
