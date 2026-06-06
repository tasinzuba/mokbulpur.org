import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/Card";
import { Sparkles, Calendar, Clock, Smartphone } from "lucide-react";

export async function HowToPay() {
  const t = await getTranslations("landing.howToPay");

  const steps = [
    {
      title: t("step1Title"),
      body: t("step1Body"),
      Icon: Sparkles,
      accent: "from-[#48cae4] to-[#0284c7]",
      barAccent: "from-[#48cae4] via-[#22d3ee] to-[#0284c7]",
    },
    {
      title: t("step2Title"),
      body: t("step2Body"),
      Icon: Calendar,
      accent: "from-[#22d3ee] to-[#0284c7]",
      barAccent: "from-[#22d3ee] via-[#48cae4] to-[#0284c7]",
    },
    {
      title: t("step3Title"),
      body: t("step3Body"),
      Icon: Clock,
      accent: "from-[#48cae4] to-[#075985]",
      barAccent: "from-[#48cae4] to-[#075985]",
    },
    {
      title: t("step4Title"),
      body: t("step4Body"),
      Icon: Smartphone,
      accent: "from-[#0284c7] to-[#075985]",
      barAccent: "from-[#22d3ee] via-[#0284c7] to-[#075985]",
    },
  ];

  return (
    <section
      id="how-to-pay"
      className="relative overflow-hidden py-12 sm:py-16 lg:py-24"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#e0f7fa]/30 via-white to-white" />

      <Container>
        <SectionHeader
          eyebrow={t("title")}
          title={t("title")}
          align="center"
          className="mb-14"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ title, body, Icon, accent, barAccent }, i) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
            >
              <div
                className={`absolute -top-px left-7 h-1 w-14 rounded-full bg-gradient-to-r ${barAccent}`}
              />
              <div className="absolute right-5 top-5 text-5xl font-bold leading-none text-[#48cae4]/15 transition-all duration-300 group-hover:text-[#48cae4]/30">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                className={`mb-5 mt-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-md shadow-[#48cae4]/20`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
