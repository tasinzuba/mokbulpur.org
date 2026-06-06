import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentUser, isCurrentUserAdmin, getAdminCount } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const adminCount = await getAdminCount();
  if (adminCount === 0) {
    redirect({ href: "/admin/setup", locale });
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect({ href: "/admin/login", locale });
  }

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    redirect({ href: "/admin/login", locale });
  }

  return <>{children}</>;
}
