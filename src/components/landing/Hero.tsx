import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/button";
import { ArrowRight, HandCoins, Sparkles, MapPin } from "lucide-react";

function heroImageExists(): boolean {
  try {
    return existsSync(join(process.cwd(), "public", "hero.jpg"));
  } catch {
    return false;
  }
}

export async function Hero() {
  const t = await getTranslations("landing.hero");
  const tCommon = await getTranslations("common");
  const hasHero = heroImageExists();

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-brand-radial" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="absolute -left-40 top-10 -z-10 h-[28rem] w-[28rem] rounded-full bg-[#48cae4]/25 blur-[140px]" />
      <div className="absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-[#22d3ee]/18 blur-[120px]" />

      <Container className="relative py-10 sm:py-16 lg:py-24">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
          {/* LEFT: Text + CTAs */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#48cae4]/30 bg-white/70 px-3 py-1 text-xs font-medium text-[#0284c7] shadow-sm backdrop-blur-md sm:px-4 sm:py-1.5 sm:text-sm">
              <Sparkles className="h-3 w-3 text-[#0284c7] sm:h-3.5 sm:w-3.5" />
              <span>{tCommon("orgName")}</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#48cae4] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#48cae4]" />
              </span>
            </div>

            <h1 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
              <span className="text-gradient">{t("title")}</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-relaxed text-muted sm:mt-6 sm:text-lg lg:mx-0 lg:text-xl">
              {t("subtitle")}
            </p>

            <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center lg:justify-start">
              <Link
                href="/sheet"
                className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}
              >
                {t("ctaPrimary")}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/#how-to-pay"
                className={buttonStyles({
                  variant: "secondary",
                  size: "lg",
                  className: "w-full sm:w-auto",
                })}
              >
                <HandCoins className="h-5 w-5" />
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>

          {/* RIGHT: Image */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-xl lg:max-w-none">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-[#48cae4]/30 via-transparent to-[#0284c7]/20 blur-2xl" />
              {hasHero ? (
                <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/40 shadow-[var(--shadow-elevated)] ring-1 ring-[#48cae4]/20">
                  <Image
                    src="/hero.jpg"
                    alt={tCommon("orgName")}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent p-5 text-white">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
                      <MapPin className="h-3 w-3" />
                      Mokbulpur Village
                    </div>
                  </div>
                </div>
              ) : (
                <PlaceholderImage orgName={tCommon("orgName")} />
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function PlaceholderImage({ orgName }: { orgName: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/40 bg-gradient-to-br from-[#48cae4] via-[#22d3ee] to-[#0284c7] shadow-[var(--shadow-elevated)] ring-1 ring-[#48cae4]/20">
      <div className="absolute inset-0 bg-grid opacity-15" />
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#075985]/30 blur-3xl" />

      <div className="relative grid h-full place-items-center p-8 text-center text-white">
        <div>
          <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl border border-white/30 bg-white/15 backdrop-blur-md">
            <MapPin className="h-10 w-10" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
            Village Image
          </div>
          <div className="mt-1 text-2xl font-bold tracking-tight drop-shadow-lg">
            {orgName}
          </div>
          <div className="mt-3 max-w-xs text-xs leading-relaxed text-white/80">
            Drop your village photo at <code className="rounded bg-white/20 px-1.5 py-0.5">public/hero.jpg</code> to replace this.
          </div>
        </div>
      </div>
    </div>
  );
}
