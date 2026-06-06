import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SetupForm } from "./SetupForm";
import { redirect } from "@/i18n/navigation";
import { getAdminCount } from "@/lib/auth";
import { Sparkles } from "lucide-react";

export default async function SetupPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  const adminCount = await getAdminCount();
  if (adminCount > 0) {
    redirect({ href: "/admin/login", locale });
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-emerald-700 text-primary-fg shadow-lg shadow-primary/20">
            <Sparkles className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("setupTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted">{t("setupSubtitle")}</p>
        </div>

        <Card>
          <SetupForm />
        </Card>
      </div>
    </Container>
  );
}
