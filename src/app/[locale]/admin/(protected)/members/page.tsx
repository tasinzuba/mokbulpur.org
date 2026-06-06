import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { buttonStyles } from "@/components/ui/button";
import { getMembers } from "@/lib/db/members";
import type { Locale } from "@/i18n/routing";
import { Plus, UserPlus, ArrowLeft, Pencil } from "lucide-react";

export default async function AdminMembersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const currentLocale = (await getLocale()) as Locale;
  const members = await getMembers();

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

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("manageMembers")}
        </h1>
        <Link
          href="/admin/members/new"
          className={buttonStyles({ size: "md" })}
        >
          <Plus className="h-4 w-4" />
          {t("addNewMember")}
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted-bg/30 p-12 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-card text-muted">
            <UserPlus className="h-7 w-7" />
          </div>
          <p className="mb-6 text-muted">{t("noMembers")}</p>
          <Link
            href="/admin/members/new"
            className={buttonStyles({ size: "md" })}
          >
            <Plus className="h-4 w-4" />
            {t("addFirstMember")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => {
            const name = currentLocale === "bn" ? m.name_bn : m.name_en;
            const altName = currentLocale === "bn" ? m.name_en : m.name_bn;
            return (
              <Card key={m.id} className="flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted-bg">
                  {m.photo_url ? (
                    <Image
                      src={m.photo_url}
                      alt={name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#48cae4]/15 to-[#0284c7]/10 text-xl font-bold text-[#0284c7]">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-foreground">{name}</div>
                  <div className="text-xs text-muted">{altName}</div>
                  {(m.country_flag || m.country) && (
                    <div className="mt-1 text-xs text-muted">
                      {m.country_flag} {m.country}
                    </div>
                  )}
                  {!m.active && (
                    <span className="mt-2 inline-block rounded-full bg-muted-bg px-2 py-0.5 text-xs font-medium text-muted">
                      Inactive
                    </span>
                  )}
                </div>
                <Link
                  href={`/admin/members/${m.id}/edit`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-card text-muted transition-all hover:border-[#48cae4]/50 hover:bg-[#48cae4]/8 hover:text-[#0284c7]"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
}
