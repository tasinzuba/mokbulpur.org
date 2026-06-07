import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import {
  Users,
  UserCheck,
  PiggyBank,
  CalendarClock,
  Landmark,
  Video,
  HandCoins,
  Ban,
  HeartHandshake,
  Scale,
  ScrollText,
} from "lucide-react";

export default async function RulesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rules");

  const sections = [
    { id: 1, Icon: Users, key: "section1" },
    { id: 2, Icon: UserCheck, key: "section2" },
    { id: 3, Icon: PiggyBank, key: "section3" },
    { id: 4, Icon: CalendarClock, key: "section4" },
    { id: 5, Icon: Landmark, key: "section5" },
    { id: 6, Icon: Video, key: "section6" },
    { id: 7, Icon: HandCoins, key: "section7" },
    { id: 8, Icon: Ban, key: "section8" },
    { id: 9, Icon: HeartHandshake, key: "section9" },
    { id: 10, Icon: Scale, key: "section10" },
  ] as const;

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#48cae4] to-[#0284c7] text-white shadow-[var(--shadow-brand)]">
            <ScrollText className="h-7 w-7" />
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-6">
          {sections.map(({ id, Icon, key }) => {
            const items = t.raw(`${key}List`) as string[];
            return (
              <section
                key={key}
                className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] sm:p-9"
              >
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#48cae4]/8 blur-2xl" />

                <div className="relative flex items-start gap-4 sm:gap-5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#48cae4] to-[#0284c7] text-white shadow-md shadow-[#48cae4]/20 sm:h-14 sm:w-14">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#0284c7]">
                      {String(id).padStart(2, "0")}
                    </div>
                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                      {t(`${key}Title`)}
                    </h2>
                  </div>
                </div>

                <ul className="relative mt-6 space-y-3 sm:ml-[68px] sm:mt-7">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 grid h-1.5 w-1.5 shrink-0 rounded-full bg-[#48cae4] sm:mt-2.5" />
                      <span className="text-base leading-relaxed text-foreground/90">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-border bg-gradient-to-br from-[#e0f7fa]/40 to-white p-6 text-center">
          <p className="text-sm leading-relaxed text-muted">
            {t("closingNote")}
          </p>
        </div>
      </div>
    </Container>
  );
}
