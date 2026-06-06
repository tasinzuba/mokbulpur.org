import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/Card";
import { buttonStyles } from "@/components/ui/button";
import { getActiveMembers } from "@/lib/db/members";
import type { Locale } from "@/i18n/routing";
import { ArrowRight, UserPlus } from "lucide-react";

export async function MembersGallery() {
  const t = await getTranslations("landing.members");
  const locale = (await getLocale()) as Locale;
  const members = await getActiveMembers();

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="✦"
            title={t("title")}
            subtitle={t("subtitle")}
          />
          {members.length > 0 && (
            <div className="text-sm font-medium text-muted">
              {t("memberCount", { count: members.length })}
            </div>
          )}
        </div>

        {members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-muted-bg/30 p-12 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-card text-muted">
              <UserPlus className="h-7 w-7" />
            </div>
            <p className="text-muted">{t("empty")}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} locale={locale} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/members"
                className={buttonStyles({ variant: "secondary", size: "md" })}
              >
                {t("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}

function MemberCard({
  member,
  locale,
}: {
  member: import("@/lib/supabase/types").Member;
  locale: Locale;
}) {
  const name = locale === "bn" ? member.name_bn : member.name_en;
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="group flex flex-col items-center text-center">
      <div className="relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-border bg-muted-bg shadow-sm transition-all group-hover:border-primary/40 group-hover:shadow-md sm:h-28 sm:w-28">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={name}
            fill
            sizes="(max-width: 768px) 96px, 112px"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/15 to-primary/5 text-3xl font-bold text-primary">
            {initial}
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="font-semibold leading-tight text-foreground">
          {name}
        </div>
        {(member.country_flag || member.country) && (
          <div className="mt-0.5 text-xs text-muted">
            {member.country_flag} {member.country}
          </div>
        )}
      </div>
    </div>
  );
}
