import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SettingsForm } from "./SettingsForm";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const tSettings = await getTranslations("adminSettings");

  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (!settings) notFound();

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
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#48cae4] to-[#075985] text-white shadow-[var(--shadow-brand)]">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {tSettings("title")}
          </h1>
          <p className="mt-2 text-muted">{tSettings("subtitle")}</p>
        </div>

        <Card>
          <SettingsForm settings={settings} />
        </Card>
      </div>
    </Container>
  );
}
