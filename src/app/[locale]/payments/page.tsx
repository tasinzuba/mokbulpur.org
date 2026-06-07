import Image from "next/image";
import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getAllPayments, type PaymentWithRelations } from "@/lib/db/payments";
import { formatBDT, formatDate, monthLabel } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import { Check, Receipt, Sparkles } from "lucide-react";
import { CountryFlag } from "@/components/ui/CountryFlag";

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("paymentsList");
  const tNav = await getTranslations("nav");
  const currentLocale = (await getLocale()) as Locale;
  const payments = await getAllPayments();

  return (
    <Container className="py-12 sm:py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {tNav("payments")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">
            {t("subtitle")}
          </p>
        </div>
        <div className="text-sm font-medium text-muted">
          {payments.length > 0 && (
            <span>
              {new Intl.NumberFormat(
                currentLocale === "bn" ? "bn-BD" : "en-US",
              ).format(payments.length)}{" "}
              · {t("title")}
            </span>
          )}
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted-bg/30 p-16 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#48cae4] to-[#0284c7] text-white">
            <Receipt className="h-7 w-7" />
          </div>
          <p className="text-muted">{t("empty")}</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] lg:block">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted-bg/40">
                <tr>
                  <Th>{t("colMember")}</Th>
                  <Th>{t("colPaidOn")}</Th>
                  <Th>{t("colForMonth")}</Th>
                  <Th align="right">{t("colAmount")}</Th>
                  <Th>{t("colMethod")}</Th>
                  <Th>{t("colTxnId")}</Th>
                  <Th>{t("colCollector")}</Th>
                  <Th align="center">{t("colStatus")}</Th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <PaymentRow
                    key={p.id}
                    payment={p}
                    locale={currentLocale}
                    t={t}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {payments.map((p) => (
              <MobilePaymentCard
                key={p.id}
                payment={p}
                locale={currentLocale}
                t={t}
              />
            ))}
          </div>
        </>
      )}
    </Container>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right" | "center";
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted ${
        align === "right"
          ? "text-right"
          : align === "center"
            ? "text-center"
            : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

type TFn = (key: string) => string;

function PaymentRow({
  payment,
  locale,
  t,
}: {
  payment: PaymentWithRelations;
  locale: Locale;
  t: TFn;
}) {
  const name = payment.member
    ? locale === "bn"
      ? payment.member.name_bn
      : payment.member.name_en
    : "—";
  const collectorName = payment.collector
    ? locale === "bn"
      ? payment.collector.name_bn
      : payment.collector.name_en
    : "—";

  return (
    <tr className="border-b border-border/60 last:border-b-0 hover:bg-muted-bg/30">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted-bg">
            {payment.member?.photo_url ? (
              <Image
                src={payment.member.photo_url}
                alt={name}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#48cae4]/15 to-[#0284c7]/10 text-sm font-semibold text-[#0284c7]">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-foreground">
              {name}
            </div>
            {payment.member?.country && (
              <div className="truncate inline-flex items-center gap-1 text-xs text-muted">
                <CountryFlag flag={payment.member.country_flag} alt={payment.member.country ?? ""} />
                {payment.member.country}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-foreground/80">
        {formatDate(payment.payment_date, locale)}
      </td>
      <td className="whitespace-nowrap px-4 py-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#48cae4]/10 px-2.5 py-1 text-xs font-medium text-[#0284c7]">
          {monthLabel(payment.for_year, payment.for_month, locale)}
        </span>
        {payment.is_joining_payment && (
          <span className="ml-1.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
            <Sparkles className="h-2.5 w-2.5" />
            {t("joiningTag")}
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-right">
        <div className="font-semibold tabular-nums text-foreground">
          {formatBDT(payment.amount, locale)}
        </div>
        {payment.fine_amount > 0 && (
          <div className="text-xs text-amber-600">
            + {formatBDT(payment.fine_amount, locale)}
          </div>
        )}
      </td>
      <td className="whitespace-nowrap px-4 py-4">
        <MethodBadge method={payment.method} t={t} />
      </td>
      <td className="px-4 py-4 font-mono text-xs text-muted">
        {payment.transaction_id || t("noTxnId")}
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-foreground/80">
        {collectorName}
      </td>
      <td className="px-4 py-4 text-center">
        <ApprovedBadge label={t("approved")} />
      </td>
    </tr>
  );
}

function MobilePaymentCard({
  payment,
  locale,
  t,
}: {
  payment: PaymentWithRelations;
  locale: Locale;
  t: TFn;
}) {
  const name = payment.member
    ? locale === "bn"
      ? payment.member.name_bn
      : payment.member.name_en
    : "—";
  const collectorName = payment.collector
    ? locale === "bn"
      ? payment.collector.name_bn
      : payment.collector.name_en
    : "—";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted-bg">
            {payment.member?.photo_url ? (
              <Image
                src={payment.member.photo_url}
                alt={name}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#48cae4]/15 to-[#0284c7]/10 text-base font-semibold text-[#0284c7]">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-foreground">
              {name}
            </div>
            {payment.member?.country && (
              <div className="truncate inline-flex items-center gap-1 text-xs text-muted">
                <CountryFlag flag={payment.member.country_flag} alt={payment.member.country ?? ""} />
                {payment.member.country}
              </div>
            )}
          </div>
        </div>
        <ApprovedBadge label={t("approved")} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <DlRow k={t("colAmount")}>
          <span className="font-semibold tabular-nums text-foreground">
            {formatBDT(payment.amount, locale)}
          </span>
        </DlRow>
        <DlRow k={t("colForMonth")}>
          {monthLabel(payment.for_year, payment.for_month, locale)}
        </DlRow>
        <DlRow k={t("colPaidOn")}>
          {formatDate(payment.payment_date, locale)}
        </DlRow>
        <DlRow k={t("colMethod")}>
          <MethodBadge method={payment.method} t={t} small />
        </DlRow>
        <DlRow k={t("colCollector")}>{collectorName}</DlRow>
        <DlRow k={t("colTxnId")}>
          <span className="font-mono text-xs">
            {payment.transaction_id || t("noTxnId")}
          </span>
        </DlRow>
      </dl>
    </div>
  );
}

function DlRow({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}

function MethodBadge({
  method,
  t,
  small = false,
}: {
  method: "bkash" | "nagad" | "cash";
  t: TFn;
  small?: boolean;
}) {
  const styles = {
    bkash: "bg-pink-100 text-pink-700",
    nagad: "bg-orange-100 text-orange-700",
    cash: "bg-emerald-100 text-emerald-700",
  };
  const label = t(
    method === "bkash"
      ? "methodBkash"
      : method === "nagad"
        ? "methodNagad"
        : "methodCash",
  );
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-semibold ${styles[method]} ${
        small ? "text-[10px]" : "text-xs"
      }`}
    >
      {label}
    </span>
  );
}

function ApprovedBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <Check className="h-3 w-3" />
      {label}
    </span>
  );
}
