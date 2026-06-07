"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn, formatBDT, monthLabel, formatDate } from "@/lib/utils";
import {
  computeCellStatus,
  expectedAmount,
  monthsBetween,
  daysLate,
  type CellStatus,
} from "@/lib/payment-status";
import type {
  Member,
  Payment,
  Collector,
  Settings,
} from "@/lib/supabase/types";
import type { Locale } from "@/i18n/routing";
import { Check, Clock, AlertCircle, Minus, X } from "lucide-react";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface SheetGridProps {
  members: Member[];
  payments: Payment[];
  collectors: Collector[];
  settings: Settings;
}

interface SelectedCell {
  member: Member;
  year: number;
  month: number;
  payment: Payment | null;
  status: CellStatus;
}

export function SheetGrid({
  members,
  payments,
  collectors,
  settings,
}: SheetGridProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("sheet");
  const [selected, setSelected] = useState<SelectedCell | null>(null);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    setNow(new Date());
  }, []);

  const paymentMap = useMemo(() => {
    const map = new Map<string, Payment>();
    for (const p of payments) {
      map.set(`${p.member_id}:${p.for_year}:${p.for_month}`, p);
    }
    return map;
  }, [payments]);

  const collectorMap = useMemo(() => {
    const map = new Map<string, Collector>();
    for (const c of collectors) map.set(c.id, c);
    return map;
  }, [collectors]);

  const months = useMemo(() => {
    const nowY = now.getFullYear();
    const nowM = now.getMonth() + 1;

    let startY = settings.founded_year;
    let startM = 1;

    if (members.length > 0) {
      const earliest = members.reduce(
        (acc, m) =>
          m.joined_year < acc.year ||
          (m.joined_year === acc.year && m.joined_month < acc.month)
            ? { year: m.joined_year, month: m.joined_month }
            : acc,
        { year: members[0].joined_year, month: members[0].joined_month },
      );
      if (
        earliest.year < startY ||
        (earliest.year === startY && earliest.month < startM)
      ) {
        startY = earliest.year;
        startM = earliest.month;
      }
    }

    return monthsBetween(startY, startM, nowY, nowM);
  }, [members, settings.founded_year, now]);

  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted-bg/30 p-12 text-center text-muted">
        {t("empty")}
      </div>
    );
  }

  return (
    <>
      <Legend />

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-20 min-w-[180px] border-b border-r border-border bg-muted-bg/80 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted backdrop-blur"
              >
                {t("memberHeader")}
              </th>
              {months.map(({ year, month }) => (
                <th
                  key={`${year}-${month}`}
                  scope="col"
                  className="min-w-[88px] border-b border-r border-border bg-muted-bg/60 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  {monthLabel(year, month, locale)}
                </th>
              ))}
              <th
                scope="col"
                className="min-w-[110px] border-b border-border bg-muted-bg/80 px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted"
              >
                {t("totalHeader")}
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              let memberTotal = 0;
              return (
                <tr key={member.id} className="group">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border-b border-r border-border bg-card px-4 py-3 text-left font-medium text-foreground group-hover:bg-muted-bg/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted-bg">
                        {member.photo_url ? (
                          <Image
                            src={member.photo_url}
                            alt={locale === "bn" ? member.name_bn : member.name_en}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#48cae4]/15 to-[#0284c7]/10 text-xs font-semibold text-[#0284c7]">
                            {(locale === "bn" ? member.name_bn : member.name_en)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          {locale === "bn" ? member.name_bn : member.name_en}
                        </div>
                        {(member.country_flag || member.country) && (
                          <div className="inline-flex items-center gap-1 text-xs text-muted">
                            <CountryFlag flag={member.country_flag} alt={member.country ?? ""} />
                            {member.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                  {months.map(({ year, month }) => {
                    const payment =
                      paymentMap.get(`${member.id}:${year}:${month}`) ?? null;

                    let paidLate = false;
                    if (payment) {
                      const paidDate = new Date(payment.payment_date);
                      const lateAfter = new Date(
                        year,
                        month - 1,
                        settings.collection_day_end,
                      );
                      paidLate = paidDate > lateAfter;
                      memberTotal += payment.amount + payment.fine_amount;
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

                    return (
                      <td
                        key={`${year}-${month}`}
                        className="border-b border-r border-border p-1.5 align-middle"
                      >
                        <Cell
                          status={status}
                          payment={payment}
                          onClick={() => {
                            if (
                              status === "before-join" ||
                              status === "future"
                            )
                              return;
                            setSelected({
                              member,
                              year,
                              month,
                              payment,
                              status,
                            });
                          }}
                          locale={locale}
                        />
                      </td>
                    );
                  })}
                  <td className="border-b border-border bg-muted-bg/30 px-3 py-3 text-right font-semibold tabular-nums text-foreground">
                    {formatBDT(memberTotal, locale)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selected && (
        <CellDialog
          selected={selected}
          settings={settings}
          collectorMap={collectorMap}
          onClose={() => setSelected(null)}
          locale={locale}
          now={now}
        />
      )}
    </>
  );
}

function Legend() {
  const t = useTranslations("sheet");
  const items: Array<{ key: string; label: string; tone: string }> = [
    {
      key: "paid",
      label: t("legendPaid"),
      tone: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
    },
    {
      key: "paid-late",
      label: t("legendPaidLate"),
      tone: "bg-emerald-100 text-emerald-800 ring-1 ring-amber-400/60",
    },
    {
      key: "pending",
      label: t("legendPending"),
      tone: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
    },
    {
      key: "late",
      label: t("legendLate"),
      tone: "bg-rose-100 text-rose-800 ring-1 ring-rose-200",
    },
    {
      key: "future",
      label: t("legendFuture"),
      tone: "bg-stone-100 text-stone-600 ring-1 ring-stone-200",
    },
  ];
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {items.map((it) => (
        <span
          key={it.key}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
            it.tone,
          )}
        >
          <span className="h-2 w-2 rounded-full bg-current opacity-60" />
          {it.label}
        </span>
      ))}
    </div>
  );
}

function Cell({
  status,
  payment,
  onClick,
  locale,
}: {
  status: CellStatus;
  payment: Payment | null;
  onClick: () => void;
  locale: Locale;
}) {
  const base =
    "grid h-12 w-full place-items-center rounded-lg text-xs font-semibold transition-transform";

  if (status === "before-join") {
    return <div className={cn(base, "text-muted/30")}>—</div>;
  }
  if (status === "future") {
    return <div className={cn(base, "text-muted/40")}>—</div>;
  }
  if (status === "paid" || status === "paid-late") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          base,
          "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200 hover:scale-[1.04] hover:bg-emerald-200",
          status === "paid-late" && "ring-amber-400/70",
        )}
        aria-label="View payment details"
      >
        <Check className="h-4 w-4" />
        <span className="mt-0.5 text-[10px] font-semibold tabular-nums">
          {payment ? formatBDT(payment.amount + payment.fine_amount, locale) : ""}
        </span>
      </button>
    );
  }
  if (status === "pending") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          base,
          "bg-amber-100 text-amber-800 ring-1 ring-amber-200 hover:scale-[1.04] hover:bg-amber-200",
        )}
      >
        <Clock className="h-4 w-4" />
      </button>
    );
  }
  if (status === "late") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          base,
          "bg-rose-100 text-rose-800 ring-1 ring-rose-200 hover:scale-[1.04] hover:bg-rose-200",
        )}
      >
        <AlertCircle className="h-4 w-4" />
      </button>
    );
  }
  return <div className={cn(base, "text-muted")}><Minus className="h-3 w-3" /></div>;
}

function CellDialog({
  selected,
  settings,
  collectorMap,
  onClose,
  locale,
  now,
}: {
  selected: SelectedCell;
  settings: Settings;
  collectorMap: Map<string, Collector>;
  onClose: () => void;
  locale: Locale;
  now: Date;
}) {
  const t = useTranslations("sheet");
  const { member, year, month, payment, status } = selected;
  const collector = payment ? collectorMap.get(payment.collector_id) : null;
  const expected = expectedAmount(
    year,
    month,
    member.joined_year,
    member.joined_month,
    settings.joining_amount,
    settings.monthly_amount,
  );
  const late = status === "late" ? daysLate(year, month, settings.collection_day_end, now) : 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted">
              {monthLabel(year, month, locale)}
            </div>
            <h3 className="mt-0.5 text-xl font-bold text-foreground">
              {locale === "bn" ? member.name_bn : member.name_en}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-muted-bg hover:text-foreground"
            aria-label={t("close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {payment ? (
          <dl className="space-y-3">
            <Row label={t("amount")} value={formatBDT(payment.amount, locale)} />
            {payment.fine_amount > 0 && (
              <Row
                label={t("fine")}
                value={formatBDT(payment.fine_amount, locale)}
              />
            )}
            <Row
              label={t("paidOn")}
              value={formatDate(payment.payment_date, locale)}
            />
            <Row
              label={t("method")}
              value={t(
                payment.method === "bkash"
                  ? "methodBkash"
                  : payment.method === "nagad"
                    ? "methodNagad"
                    : "methodCash",
              )}
            />
            {collector && (
              <Row
                label={t("collector")}
                value={locale === "bn" ? collector.name_bn : collector.name_en}
              />
            )}
            {payment.is_joining_payment && (
              <div className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                ✨ {t("joiningPayment")}
              </div>
            )}
            {payment.note && (
              <Row label={t("note")} value={payment.note} />
            )}
          </dl>
        ) : status === "late" ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-rose-50 px-4 py-3 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              <div className="text-sm font-medium">
                {t("daysLate", { days: late })}
              </div>
              <div className="mt-1 text-xs opacity-80">
                {t("amount")}: {formatBDT(expected, locale)}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-amber-50 px-4 py-3 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            <div className="text-sm font-medium">{t("legendPending")}</div>
            <div className="mt-1 text-xs opacity-80">
              {t("amount")}: {formatBDT(expected, locale)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-2 last:border-b-0 last:pb-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
