import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/Card";

export async function About() {
  const t = await getTranslations("landing.about");

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader eyebrow={t("title")} title={t("title")} />
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted sm:text-lg lg:col-span-7">
            <p className="text-foreground/90">{t("p1")}</p>
            <p>{t("p2")}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
