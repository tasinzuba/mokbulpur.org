import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { EditMemberForm } from "./EditMemberForm";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const tForm = await getTranslations("admin.memberForm");

  const supabase = await createClient();
  const { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !member) {
    notFound();
  }

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
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#48cae4] to-[#0284c7] text-white shadow-[var(--shadow-brand)]">
            <Pencil className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {tForm("editTitle")}
          </h1>
          <p className="mt-2 text-muted">{tForm("editSubtitle")}</p>
        </div>

        <Card>
          <EditMemberForm member={member} />
        </Card>
      </div>
    </Container>
  );
}
