import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/Card";
import { Building2, Trees, HeartHandshake, Route } from "lucide-react";

export async function WhatWeDo() {
  const t = await getTranslations("landing.whatWeDo");

  const items = [
    {
      title: t("mosqueTitle"),
      body: t("mosqueBody"),
      Icon: Building2,
      span: "sm:col-span-2 lg:col-span-2",
    },
    {
      title: t("graveyardTitle"),
      body: t("graveyardBody"),
      Icon: Trees,
      span: "",
    },
    {
      title: t("needyTitle"),
      body: t("needyBody"),
      Icon: HeartHandshake,
      span: "",
    },
    {
      title: t("roadTitle"),
      body: t("roadBody"),
      Icon: Route,
      span: "sm:col-span-2 lg:col-span-2",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#48cae4]/30 to-transparent" />
      <Container>
        <SectionHeader
          eyebrow="✦ Impact"
          title={t("title")}
          subtitle={t("subtitle")}
          align="center"
          className="mb-14"
        />
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ title, body, Icon, span }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[#48cae4]/40 hover:shadow-[var(--shadow-card)] ${span}`}
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#48cae4]/10 via-white to-transparent opacity-60" />
              <div className="absolute -right-12 -top-12 -z-10 h-44 w-44 rounded-full bg-[#48cae4]/10 blur-2xl transition-opacity duration-500 group-hover:opacity-150" />
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[#48cae4] to-[#0284c7] text-white shadow-md shadow-[#48cae4]/30">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
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
