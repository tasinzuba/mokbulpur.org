import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { HandHeart, Shield, Eye, Users } from "lucide-react";

export async function Footer() {
  const tCommon = await getTranslations("common");
  const tFooter = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  const navLinks = [
    { href: "/", label: tNav("home") },
    { href: "/sheet", label: tNav("sheet") },
    { href: "/members", label: tNav("members") },
    { href: "/expenses", label: tNav("expenses") },
    { href: "/rules", label: tNav("rules") },
  ];

  const trustPillars = [
    { Icon: Eye, label: tFooter("pillarTransparent") },
    { Icon: Shield, label: tFooter("pillarSecure") },
    { Icon: Users, label: tFooter("pillarCommunity") },
  ];

  return (
    <footer className="relative mt-24 border-t border-border bg-gradient-to-b from-white via-[#e0f7fa]/40 to-[#e0f7fa]/60">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#48cae4] to-[#0284c7] text-white shadow-[var(--shadow-brand)]">
                <HandHeart className="h-5 w-5" />
              </span>
              <span className="text-base font-semibold tracking-tight text-foreground">
                {tCommon("orgName")}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {tFooter("tagline")}
            </p>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
              {tFooter("explore")}
            </div>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-[#0284c7]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
              {tFooter("ourPromise")}
            </div>
            <ul className="space-y-3">
              {trustPillars.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2.5 text-sm text-muted"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#48cae4]/15 to-[#0284c7]/10 text-[#0284c7]">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center border-t border-border/60 pt-6">
          <div className="text-xs font-medium text-muted">
            Made by <span className="font-semibold text-foreground">Tasin</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
