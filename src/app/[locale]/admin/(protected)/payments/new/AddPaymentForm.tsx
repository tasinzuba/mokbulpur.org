"use client";

import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { addPaymentAction } from "./actions";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AlertCircle, Plus, Smartphone, Wallet, Banknote } from "lucide-react";
import type { Member, Collector } from "@/lib/supabase/types";
import type { Locale } from "@/i18n/routing";

export function AddPaymentForm({
  members,
  collectors,
  defaultMemberId,
  defaultYear,
  defaultMonth,
}: {
  members: Member[];
  collectors: Collector[];
  defaultMemberId?: string;
  defaultYear?: number;
  defaultMonth?: number;
}) {
  const t = useTranslations("paymentForm");
  const locale = useLocale() as Locale;
  const [state, formAction, pending] = useActionState(addPaymentAction, null);
  const [method, setMethod] = useState<"bkash" | "nagad" | "cash">("cash");

  const now = new Date();
  const currentYear = defaultYear ?? now.getFullYear();
  const currentMonth = defaultMonth ?? now.getMonth() + 1;
  const today = now.toISOString().slice(0, 10);

  const months = [
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

  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        {t("errorNoMembers")}
      </div>
    );
  }
  if (collectors.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        {t("errorNoCollectors")}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label={`${t("member")} *`}
          name="member_id"
          required
          defaultValue={defaultMemberId}
          placeholder={t("memberPlaceholder")}
        >
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {locale === "bn" ? m.name_bn : m.name_en}
              {m.country ? ` · ${m.country}` : ""}
            </option>
          ))}
        </SelectField>

        <SelectField
          label={`${t("collector")} *`}
          name="collector_id"
          required
          defaultValue={collectors[0]?.id}
          placeholder={t("collectorPlaceholder")}
        >
          {collectors.map((c) => (
            <option key={c.id} value={c.id}>
              {locale === "bn" ? c.name_bn : c.name_en}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label={`${t("amount")} *`}
          name="amount"
          required
          min={0}
          defaultValue={2000}
        />
        <NumberField
          label={t("fineAmount")}
          name="fine_amount"
          min={0}
          defaultValue={0}
        />
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-foreground">
          {t("method")} *
        </span>
        <div className="grid grid-cols-3 gap-2">
          <MethodRadio
            current={method}
            value="cash"
            label={t("methodCash")}
            Icon={Banknote}
            onChange={setMethod}
          />
          <MethodRadio
            current={method}
            value="bkash"
            label={t("methodBkash")}
            Icon={Smartphone}
            onChange={setMethod}
          />
          <MethodRadio
            current={method}
            value="nagad"
            label={t("methodNagad")}
            Icon={Wallet}
            onChange={setMethod}
          />
        </div>
        <input type="hidden" name="method" value={method} />
      </div>

      {method !== "cash" && (
        <TextField
          label={t("transactionId")}
          name="transaction_id"
          placeholder="9KE8X42M1Q"
          hint={t("transactionIdHint")}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <DateField
          label={`${t("paymentDate")} *`}
          name="payment_date"
          defaultValue={today}
          required
        />

        <SelectField
          label={`${t("forMonth")} *`}
          name="for_month"
          required
          defaultValue={String(currentMonth)}
        >
          {months.map((m, i) => (
            <option key={i + 1} value={i + 1}>
              {m}
            </option>
          ))}
        </SelectField>

        <NumberField
          label="Year"
          name="for_year"
          required
          min={2020}
          max={currentYear + 1}
          defaultValue={currentYear}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-card p-3">
        <input
          type="checkbox"
          name="is_joining_payment"
          className="mt-0.5 h-4 w-4 rounded border-border text-[#0284c7] focus:ring-[#48cae4]"
        />
        <span className="text-sm text-foreground">{t("joiningPayment")}</span>
      </label>

      <TextareaField label={t("note")} name="note" />

      {(() => {
        if (!state?.error) return null;
        const msg =
          state.error === "missing"
            ? t("errorMissing")
            : state.error === "duplicate"
              ? t("errorDuplicate")
              : state.error;
        return (
          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{msg}</span>
          </div>
        );
      })()}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className={buttonStyles({ size: "lg" })}
        >
          <Plus className="h-5 w-5" />
          {pending ? t("submitting") : t("submit")}
        </button>
        <Link
          href="/admin"
          className={buttonStyles({ variant: "secondary", size: "lg" })}
        >
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}

function MethodRadio({
  current,
  value,
  label,
  Icon,
  onChange,
}: {
  current: string;
  value: "bkash" | "nagad" | "cash";
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  onChange: (v: "bkash" | "nagad" | "cash") => void;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
        active
          ? "border-[#48cae4] bg-[#48cae4]/10 text-[#0284c7] shadow-sm"
          : "border-border bg-card text-muted hover:border-muted hover:bg-muted-bg"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function TextField({
  label,
  name,
  placeholder,
  required,
  hint,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
      />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

function NumberField({
  label,
  name,
  required,
  min,
  max,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  min?: number;
  max?: number;
  defaultValue?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <input
        type="number"
        name={name}
        required={required}
        min={min}
        max={max}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base tabular-nums focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
      />
    </label>
  );
}

function DateField({
  label,
  name,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <input
        type="date"
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  required,
  defaultValue,
  placeholder,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </label>
  );
}

function TextareaField({ label, name }: { label: string; name: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <textarea
        name={name}
        rows={2}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-base focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
      />
    </label>
  );
}
