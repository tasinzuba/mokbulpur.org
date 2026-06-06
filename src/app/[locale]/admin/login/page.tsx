import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "./LoginForm";
import { redirect } from "@/i18n/navigation";
import { getAdminCount, isCurrentUserAdmin } from "@/lib/auth";
import { Shield } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  if (await isCurrentUserAdmin()) {
    redirect({ href: "/admin", locale });
  }

  const adminCount = await getAdminCount();
  if (adminCount === 0) {
    redirect({ href: "/admin/setup", locale });
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-fg shadow-lg shadow-primary/20">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("loginTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted">{t("loginSubtitle")}</p>
        </div>

        <Card>
          <LoginForm />
        </Card>

        <div className="mt-6 text-center text-sm">
          <Link href="/" className="text-muted hover:text-foreground">
            ← {t("dashboard").toLowerCase()}
          </Link>
        </div>
      </div>
    </Container>
  );
}
