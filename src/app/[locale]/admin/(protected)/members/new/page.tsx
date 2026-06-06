import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { AddMemberForm } from "./AddMemberForm";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";

export default async function NewMemberPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const tForm = await getTranslations("admin.memberForm");

  return (
    <Container className="py-10">
      <div className="mb-6">
        <Link
          href="/admin/members"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("manageMembers")}
        </Link>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-fg shadow-sm">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {tForm("title")}
          </h1>
          <p className="mt-2 text-muted">{tForm("subtitle")}</p>
        </div>

        <Card>
          <AddMemberForm />
        </Card>
      </div>
    </Container>
  );
}
