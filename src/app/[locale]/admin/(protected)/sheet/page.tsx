import Image from "next/image";
import { setRequestLocale, getTranslations, getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import { buttonStyles } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import type { Member, Payment, Collector, Settings } from "@/lib/supabase/types";
import type { Locale } from "@/i18n/routing";
import { formatBDT, formatDate, monthLabel } from "@/lib/utils";
import { computeCellStatus, type CellStatus } from "@/lib/payment-status";
import {
  ArrowLeft,
  Check,
  Clock,
  AlertCircle,
  Minus,
  Plus,
  Pencil,
} from "lucide-react";
import { CountryFlag } from "@/components/ui/CountryFlag";

const DEFAULT_SETTINGS: Settings = {
  id: 1,
  org_name: "Mokbulpur Probasi",
  joining_amount: 5000,
  monthly_amount: 2000,
  collection_day_start: 1,
  collection_day_end: 10,
  fine_per_month: 0,
  founded_year: new Date().getFullYear(),
  updated_at: new Date().toISOString(),
};

export default async function AdminMonthlySheet({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("admin.monthlySheet");
  const tAdmin = await getTranslations("admin");
  const currentLocale = (await getLocale()) as Locale;

  const now = new Date();
  const year = Number(sp.year) || now.getFullYear();
  const month = Number(sp.month) || now.getMonth() + 1;

  const supabase = await createClient();
  const [membersRes, paymentsRes, collectorsRes, settingsRes] =
    await Promise.all([
      supabase
        .from("members")
        .select("*")
        .order("joined_year", { ascending: true })
        .order("joined_month", { ascending: true })
        .order("name_en", { ascending: true }),
      supabase
        .from("payments")
        .select("*")
        .eq("for_year", year)
        .eq("for_month", month),
      supabase
        .from("collectors")
        .select("*")
        .order("display_order", { ascending: true }),
      supabase.from("settings").select("*").eq("id", 1).maybeSingle(),
    ]);

  const members: Member[] = membersRes.data ?? [];
  const payments: Payment[] = paymentsRes.data ?? [];
  const collectors: Collector[] = collectorsRes.data ?? [];
  const settings: Settings = settingsRes.data ?? DEFAULT_SETTINGS;

  const paymentMap = new Map<string, Payment>();
  for (const p of payments) paymentMap.set(p.member_id, p);
  const collectorMap = new Map<string, Collector>();
  for (const c of collectors) collectorMap.set(c.id, c);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  type Row = {
    member: Member;
    payment: Payment | null;
    status: CellStatus;
  };

  const rows: Row[] = members.map((member) => {
    const payment = paymentMap.get(member.id) ?? null;
    let paidLate = false;
    if (payment) {
      const paidDate = new Date(payment.payment_date);
      const deadline = new Date(year, month - 1, settings.collection_day_end);
      paidLate = paidDate > deadline;
    }
    const status = computeCellStatus({
      memberJoinedYear: member.joined_year,
      memberJoinedMonth: member.joined_month,
      year,
      month,
      hasPayment: !!payment,
      paidLate,
      collectionDayEnd: settings.collection_day_end,
      now,
    });
    return { member, payment, status };
  });

  const summary = {
    paid: rows.filter((r) => r.status === "paid" || r.status === "paid-late")
      .length,
    pending: rows.filter((r) => r.status === "pending").length,
    late: rows.filter((r) => r.status === "late").length,
    beforeJoin: rows.filter(
      (r) => r.status === "before-join" || r.status === "future",
    ).length,
  };

  const totalCollected = payments.reduce(
    (sum, p) => sum + p.amount + p.fine_amount,
    0,
  );

  return (
    <Container className="py-10">
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {tAdmin("dashboard")}
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </div>

      <form className="mb-8 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            {t("month")}
          </span>
          <select
            name="month"
            defaultValue={month}
            className="h-11 min-w-[160px] rounded-lg border border-border bg-card px-3 text-base focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
          >
            {monthNames.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
            {t("year")}
          </span>
          <input
            name="year"
            type="number"
            defaultValue={year}
            min={2020}
            max={now.getFullYear() + 1}
            className="h-11 w-28 rounded-lg border border-border bg-card px-3 text-base tabular-nums focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
          />
        </label>
        <button type="submit" className={buttonStyles({ size: "md" })}>
          {t("go")}
        </button>
        <div className="ml-auto text-sm text-muted">
          <span className="font-medium text-foreground">
            {monthLabel(year, month, currentLocale)}
          </span>
        </div>
      </form>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryStat
          label={t("summaryPaid")}
          value={summary.paid}
          tone="text-emerald-700 bg-emerald-50"
          locale={currentLocale}
        />
        <SummaryStat
          label={t("summaryPending")}
          value={summary.pending}
          tone="text-amber-700 bg-amber-50"
          locale={currentLocale}
        />
        <SummaryStat
          label={t("summaryLate")}
          value={summary.late}
          tone="text-rose-700 bg-rose-50"
          locale={currentLocale}
        />
        <SummaryStat
          label={t("summaryNotJoined")}
          value={summary.beforeJoin}
          tone="text-muted bg-muted-bg"
          locale={currentLocale}
        />
        <div className="rounded-2xl bg-gradient-to-br from-[#48cae4] to-[#0284c7] p-4 text-white shadow-[var(--shadow-brand)]">
          <div className="text-xs font-semibold uppercase tracking-wider opacity-90">
            {t("totalForMonth")}
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums">
            {formatBDT(totalCollected, currentLocale)}
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted-bg/30 p-12 text-center text-muted">
          {t("noMembers")}
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] lg:block">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted-bg/40">
                <tr>
                  <Th>{t("colMember")}</Th>
                  <Th align="center">{t("colStatus")}</Th>
                  <Th>{t("colDate")}</Th>
                  <Th>{t("colCollector")}</Th>
                  <Th align="right">{t("colAmount")}</Th>
                  <Th>{t("colMethod")}</Th>
                  <Th>{t("colTxnId")}</Th>
                  <Th align="center">{t("colActions")}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <AdminRow
                    key={row.member.id}
                    row={row}
                    locale={currentLocale}
                    year={year}
                    month={month}
                    collectorMap={collectorMap}
                    t={t}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {rows.map((row) => (
              <MobileRow
                key={row.member.id}
                row={row}
                locale={currentLocale}
                year={year}
                month={month}
                collectorMap={collectorMap}
                t={t}
              />
            ))}
          </div>
        </>
      )}
    </Container>
  );
}

type TFn = (key: string) => string;

function SummaryStat({
  label,
  value,
  tone,
  locale,
}: {
  label: string;
  value: number;
  tone: string;
  locale: Locale;
}) {
  const formatted = new Intl.NumberFormat(
    locale === "bn" ? "bn-BD" : "en-US",
  ).format(value);
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </div>
      <div
        className={`mt-1 inline-flex items-center rounded-lg px-2 py-0.5 text-2xl font-bold tabular-nums ${tone}`}
      >
        {formatted}
      </div>
    </div>
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

function StatusBadge({ status, t }: { status: CellStatus; t: TFn }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <Check className="h-3 w-3" />
        {t("statusPaid")}
      </span>
    );
  }
  if (status === "paid-late") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-amber-400/50">
        <Check className="h-3 w-3" />
        {t("statusPaidLate")}
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <Clock className="h-3 w-3" />
        {t("statusPending")}
      </span>
    );
  }
  if (status === "late") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">
        <AlertCircle className="h-3 w-3" />
        {t("statusLate")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted-bg px-2.5 py-1 text-xs font-medium text-muted">
      <Minus className="h-3 w-3" />
      {t("statusBeforeJoin")}
    </span>
  );
}

function MethodLabel({ method }: { method: "bkash" | "nagad" | "cash" }) {
  const styles = {
    bkash: "bg-pink-100 text-pink-700",
    nagad: "bg-orange-100 text-orange-700",
    cash: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${styles[method]}`}
    >
      {method}
    </span>
  );
}

function MemberCell({
  member,
  locale,
}: {
  member: Member;
  locale: Locale;
}) {
  const name = locale === "bn" ? member.name_bn : member.name_en;
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-muted-bg">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
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
        <div className="truncate font-semibold text-foreground">{name}</div>
        {member.country && (
          <div className="truncate inline-flex items-center gap-1 text-xs text-muted">
            <CountryFlag flag={member.country_flag} alt={member.country ?? ""} />
            {member.country}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminRow({
  row,
  locale,
  year,
  month,
  collectorMap,
  t,
}: {
  row: { member: Member; payment: Payment | null; status: CellStatus };
  locale: Locale;
  year: number;
  month: number;
  collectorMap: Map<string, Collector>;
  t: TFn;
}) {
  const { member, payment, status } = row;
  const collector = payment ? collectorMap.get(payment.collector_id) : null;
  const collectorName = collector
    ? locale === "bn"
      ? collector.name_bn
      : collector.name_en
    : "—";

  return (
    <tr className="border-b border-border/60 last:border-b-0 hover:bg-muted-bg/30">
      <td className="px-4 py-3">
        <MemberCell member={member} locale={locale} />
      </td>
      <td className="px-4 py-3 text-center">
        <StatusBadge status={status} t={t} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-foreground/80">
        {payment ? formatDate(payment.payment_date, locale) : "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-foreground/80">
        {payment ? collectorName : "—"}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
        {payment ? (
          <>
            <div className="font-semibold text-foreground">
              {formatBDT(payment.amount, locale)}
            </div>
            {payment.fine_amount > 0 && (
              <div className="text-xs text-amber-600">
                + {formatBDT(payment.fine_amount, locale)}
              </div>
            )}
          </>
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        {payment ? <MethodLabel method={payment.method} /> : "—"}
      </td>
      <td className="px-4 py-3 font-mono text-xs text-muted">
        {payment?.transaction_id || "—"}
      </td>
      <td className="px-4 py-3 text-center">
        {payment ? (
          <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted">
            <Pencil className="h-3 w-3" />
            ID: {payment.id.slice(0, 6)}
          </span>
        ) : status === "before-join" || status === "future" ? (
          <span className="text-xs text-muted">—</span>
        ) : (
          <Link
            href={{
              pathname: "/admin/payments/new",
              query: {
                member_id: member.id,
                year: String(year),
                month: String(month),
              },
            }}
            className={buttonStyles({ size: "sm" })}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("addPayment")}
          </Link>
        )}
      </td>
    </tr>
  );
}

function MobileRow({
  row,
  locale,
  year,
  month,
  collectorMap,
  t,
}: {
  row: { member: Member; payment: Payment | null; status: CellStatus };
  locale: Locale;
  year: number;
  month: number;
  collectorMap: Map<string, Collector>;
  t: TFn;
}) {
  const { member, payment, status } = row;
  const collector = payment ? collectorMap.get(payment.collector_id) : null;
  const collectorName = collector
    ? locale === "bn"
      ? collector.name_bn
      : collector.name_en
    : "—";

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <MemberCell member={member} locale={locale} />
        <StatusBadge status={status} t={t} />
      </div>
      {payment ? (
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted">{t("colAmount")}</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">
              {formatBDT(payment.amount + payment.fine_amount, locale)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{t("colDate")}</dt>
            <dd className="mt-0.5">{formatDate(payment.payment_date, locale)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{t("colCollector")}</dt>
            <dd className="mt-0.5">{collectorName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{t("colMethod")}</dt>
            <dd className="mt-0.5">
              <MethodLabel method={payment.method} />
            </dd>
          </div>
          {payment.transaction_id && (
            <div className="col-span-2">
              <dt className="text-xs text-muted">{t("colTxnId")}</dt>
              <dd className="mt-0.5 font-mono text-xs">
                {payment.transaction_id}
              </dd>
            </div>
          )}
        </dl>
      ) : status !== "before-join" && status !== "future" ? (
        <div className="mt-4">
          <Link
            href={{
              pathname: "/admin/payments/new",
              query: {
                member_id: member.id,
                year: String(year),
                month: String(month),
              },
            }}
            className={buttonStyles({ size: "sm", className: "w-full" })}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("addPayment")}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
