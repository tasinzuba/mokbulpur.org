import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/landing/Hero";
import { LiveStats } from "@/components/landing/LiveStats";
import { About } from "@/components/landing/About";
import { MembersGallery } from "@/components/landing/MembersGallery";
import { WhatWeDo } from "@/components/landing/WhatWeDo";
import { Collectors } from "@/components/landing/Collectors";
import { HowToPay } from "@/components/landing/HowToPay";
import { Transparency } from "@/components/landing/Transparency";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <LiveStats />
      <About />
      <MembersGallery />
      <WhatWeDo />
      <Collectors />
      <HowToPay />
      <Transparency />
    </>
  );
}
