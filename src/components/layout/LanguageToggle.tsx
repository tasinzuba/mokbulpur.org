"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const nextLocale = locale === "bn" ? "en" : "bn";
  const label = nextLocale === "bn" ? t("bangla") : t("english");

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => {
          router.replace(pathname, { locale: nextLocale });
        });
      }}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted-bg disabled:opacity-50"
      aria-label={t("language")}
    >
      <Languages className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
