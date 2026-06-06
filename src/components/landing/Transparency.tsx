import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { buttonStyles } from "@/components/ui/button";
import { Eye, ArrowRight } from "lucide-react";

export async function Transparency() {
  const t = await getTranslations("landing.transparency");

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#48cae4]/30 bg-gradient-to-br from-[#48cae4] via-[#0284c7] to-[#075985] p-10 shadow-[var(--shadow-brand)] sm:p-14 lg:p-20">
          <div className="absolute inset-0 -z-10 bg-grid opacity-[0.10]" />
          <div className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 -z-10 h-96 w-96 rounded-full bg-[#22d3ee]/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-2xl border border-white/25 bg-white/15 text-white backdrop-blur-md">
              <Eye className="h-8 w-8" />
            </div>
            <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/90 sm:text-lg">
              {t("body")}
            </p>
            <div className="mt-9">
              <Link
                href="/sheet"
                className={buttonStyles({
                  size: "lg",
                  className:
                    "bg-white text-[#0284c7] hover:bg-white/95 hover:text-[#075985] hover:-translate-y-0.5",
                })}
              >
                {t("cta")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
