import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/Card";
import { UserCircle2, Phone } from "lucide-react";

const COLLECTORS = [
  { name: "Rahat", nameBn: "রাহাত", phone: "+880 1XXX XXXXXX" },
  { name: "Jubayer", nameBn: "জোবায়ের", phone: "+880 1XXX XXXXXX" },
];

export async function Collectors() {
  const t = await getTranslations("landing.collectors");

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow={t("title")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-12"
        />
        <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
          {COLLECTORS.map((c, i) => (
            <div
              key={c.name}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#48cae4]/40 hover:shadow-[var(--shadow-card)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#48cae4] via-[#22d3ee] to-[#0284c7]" />
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#48cae4]/8 blur-2xl" />

              <div className="relative flex items-start gap-5">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#48cae4]/15 to-[#0284c7]/10 text-[#0284c7] ring-1 ring-[#48cae4]/20">
                  <UserCircle2 className="h-9 w-9" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#0284c7]">
                    {t("collectorLabel")} {i + 1}
                  </div>
                  <h3 className="mt-1 text-xl font-bold tracking-tight text-foreground">
                    {c.nameBn}{" "}
                    <span className="text-sm font-normal text-muted">
                      · {c.name}
                    </span>
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                    <Phone className="h-3.5 w-3.5" />
                    <span className="font-mono">{c.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
