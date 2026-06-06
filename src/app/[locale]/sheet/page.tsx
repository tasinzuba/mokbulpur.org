import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SheetGrid } from "@/components/sheet/SheetGrid";
import { getSheetData } from "@/lib/db/sheet";
import { AlertTriangle } from "lucide-react";

export default async function SheetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sheet");
  const data = await getSheetData();

  return (
    <Container className="py-10 sm:py-14">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
          {t("subtitle")}
        </p>
      </div>

      {data.error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <h2 className="font-semibold">{t("errorTitle")}</h2>
              <p className="mt-1 text-sm opacity-90">{t("errorBody")}</p>
              <code className="mt-3 block rounded bg-amber-100/60 px-2 py-1 text-xs dark:bg-amber-900/40">
                {data.error}
              </code>
            </div>
          </div>
        </div>
      ) : (
        <SheetGrid
          members={data.members}
          payments={data.payments}
          collectors={data.collectors}
          settings={data.settings}
        />
      )}
    </Container>
  );
}
