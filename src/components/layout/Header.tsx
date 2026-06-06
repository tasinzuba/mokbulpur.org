import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { LanguageToggle } from "./LanguageToggle";
import { HandHeart, Shield } from "lucide-react";
import { isCurrentUserAdmin } from "@/lib/auth";

function getLogoSrc(): string | null {
  try {
    for (const filename of ["logo.png", "logo.jpg", "logo.webp", "logo.svg"]) {
      if (existsSync(join(process.cwd(), "public", filename))) {
        return `/${filename}`;
      }
    }
  } catch {}
  return null;
}

export async function Header() {
  const tNav = await getTranslations("nav");
  const tCommon = await getTranslations("common");
  const tAdmin = await getTranslations("admin");
  const isAdmin = await isCurrentUserAdmin();
  const logoSrc = getLogoSrc();
  const orgName = tCommon("orgName");

  const navItems = [
    { href: "/", label: tNav("home") },
    { href: "/sheet", label: tNav("sheet") },
    { href: "/members", label: tNav("members") },
    { href: "/expenses", label: tNav("expenses") },
    { href: "/rules", label: tNav("rules") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-3 font-semibold transition-opacity hover:opacity-90"
        >
          {logoSrc ? (
            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl shadow-[var(--shadow-brand)] ring-1 ring-[#48cae4]/20">
              <Image
                src={logoSrc}
                alt={orgName}
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </span>
          ) : (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#48cae4] to-[#0284c7] text-white shadow-[var(--shadow-brand)]">
              <HandHeart className="h-5 w-5" />
            </span>
          )}
          <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            {orgName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-all hover:bg-[#48cae4]/8 hover:text-[#0284c7]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-[#48cae4] to-[#0284c7] px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-[#48cae4]/30 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-brand)]"
              aria-label={tAdmin("dashboard")}
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{tAdmin("dashboard")}</span>
            </Link>
          )}
          <LanguageToggle />
        </div>
      </Container>

      <Container className="flex items-center gap-1 overflow-x-auto pb-2 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-[#48cae4]/8 hover:text-[#0284c7]"
          >
            {item.label}
          </Link>
        ))}
      </Container>
    </header>
  );
}
