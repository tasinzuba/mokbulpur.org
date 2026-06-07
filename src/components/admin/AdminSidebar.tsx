"use client";

import { useTransition } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Plus,
  Receipt,
  Settings,
  LogOut,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminSidebar({
  adminName,
  adminEmail,
}: {
  adminName: string;
  adminEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("admin");
  const [isPending, startTransition] = useTransition();

  const items = [
    {
      href: "/admin",
      label: t("dashboard"),
      Icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/sheet",
      label: t("monthlySheet.title"),
      Icon: CalendarCheck,
    },
    {
      href: "/admin/members",
      label: t("manageMembers"),
      Icon: Users,
    },
    {
      href: "/admin/payments/new",
      label: t("addPayment"),
      Icon: Plus,
    },
    {
      href: "/admin/expenses/new",
      label: t("addExpense"),
      Icon: Receipt,
    },
    {
      href: "/admin/settings",
      label: t("settings"),
      Icon: Settings,
    },
  ];

  const handleSignOut = () => {
    startTransition(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    });
  };

  return (
    <aside
      className={cn(
        "fixed bottom-0 left-0 top-16 z-30 hidden w-[240px] overflow-y-auto border-r border-border bg-white/80 backdrop-blur-md lg:block",
      )}
    >
      <div className="flex h-full flex-col px-4 py-6">
        {/* Admin identity */}
        <div className="mb-5 rounded-2xl border border-border bg-gradient-to-br from-[#48cae4]/8 to-white p-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#48cae4] to-[#0284c7] text-white shadow-sm">
              <UserCog className="h-4.5 w-4.5 h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">
                {adminName}
              </div>
              <div className="truncate text-xs text-muted">{adminEmail}</div>
            </div>
          </div>
        </div>

        <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
          {t("panel")}
        </div>

        <nav className="flex flex-col gap-1">
          {items.map(({ href, label, Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-[#48cae4]/15 to-[#0284c7]/8 text-[#0284c7] shadow-sm ring-1 ring-[#48cae4]/20"
                    : "text-muted hover:bg-muted-bg hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-[#0284c7]" : "text-muted/70",
                  )}
                />
                <span className="truncate">{label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#48cae4]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isPending}
            className="flex w-full items-center gap-3 rounded-xl border border-rose-200/60 bg-rose-50/40 px-3 py-2.5 text-sm font-medium text-rose-700 transition-all hover:border-rose-300 hover:bg-rose-50 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>{t("signOut")}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const t = useTranslations("admin");

  const items = [
    { href: "/admin", label: t("dashboard"), Icon: LayoutDashboard, exact: true },
    { href: "/admin/sheet", label: t("monthlySheet.title"), Icon: CalendarCheck },
    { href: "/admin/members", label: t("manageMembers"), Icon: Users },
    { href: "/admin/payments/new", label: t("addPayment"), Icon: Plus },
    { href: "/admin/expenses/new", label: t("addExpense"), Icon: Receipt },
    { href: "/admin/settings", label: t("settings"), Icon: Settings },
  ];

  return (
    <div className="sticky top-16 z-30 border-b border-border bg-background/85 backdrop-blur-md lg:hidden">
      <div className="flex gap-1 overflow-x-auto px-3 py-2">
        {items.map(({ href, label, Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-[#48cae4]/15 to-[#0284c7]/8 text-[#0284c7] ring-1 ring-[#48cae4]/30"
                  : "text-muted hover:bg-muted-bg hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
