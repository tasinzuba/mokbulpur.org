"use client";

import { useActionState, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { addExpenseAction } from "./actions";
import { buttonStyles } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  AlertCircle,
  Plus,
  Building2,
  Trees,
  HeartHandshake,
  Route,
  PartyPopper,
  MoreHorizontal,
} from "lucide-react";
import type { Collector } from "@/lib/supabase/types";
import type { Locale } from "@/i18n/routing";

type CategoryKey = "mosque" | "graveyard" | "needy" | "road" | "event" | "other";

export function AddExpenseForm({ collectors }: { collectors: Collector[] }) {
  const t = useTranslations("expenseForm");
  const tList = useTranslations("expensesList");
  const locale = useLocale() as Locale;
  const [state, formAction, pending] = useActionState(addExpenseAction, null);
  const [category, setCategory] = useState<CategoryKey>("mosque");

  const today = new Date().toISOString().slice(0, 10);

  const categories: Array<{
    key: CategoryKey;
    label: string;
    Icon: React.ComponentType<{ className?: string }>;
    accent: string;
  }> = [
    {
      key: "mosque",
      label: tList("categoryMosque"),
      Icon: Building2,
      accent: "text-emerald-700 ring-emerald-500/30 bg-emerald-50",
    },
    {
      key: "graveyard",
      label: tList("categoryGraveyard"),
      Icon: Trees,
      accent: "text-green-700 ring-green-500/30 bg-green-50",
    },
    {
      key: "needy",
      label: tList("categoryNeedy"),
      Icon: HeartHandshake,
      accent: "text-rose-700 ring-rose-500/30 bg-rose-50",
    },
    {
      key: "road",
      label: tList("categoryRoad"),
      Icon: Route,
      accent: "text-amber-700 ring-amber-500/30 bg-amber-50",
    },
    {
      key: "event",
      label: tList("categoryEvent"),
      Icon: PartyPopper,
      accent: "text-purple-700 ring-purple-500/30 bg-purple-50",
    },
    {
      key: "other",
      label: tList("categoryOther"),
      Icon: MoreHorizontal,
      accent: "text-stone-700 ring-stone-500/30 bg-stone-50",
    },
  ];

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`${t("titleBn")} *`} name="title_bn" required />
        <Field label={`${t("titleEn")} *`} name="title_en" required />
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium text-foreground">
          {t("category")} *
        </span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((c) => {
            const active = category === c.key;
            return (
              <button
                type="button"
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium transition-all ${
                  active
                    ? `border-[#48cae4] bg-[#48cae4]/10 text-[#0284c7] shadow-sm`
                    : "border-border bg-card text-muted hover:border-muted hover:bg-muted-bg"
                }`}
              >
                <c.Icon className="h-4 w-4" />
                {c.label}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="category" value={category} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label={`${t("amount")} *`}
          name="amount"
          required
          min={1}
        />
        <DateField
          label={`${t("expenseDate")} *`}
          name="expense_date"
          required
          defaultValue={today}
        />
      </div>

      <SelectField label={t("paidFromCollector")} name="paid_from_collector_id">
        <option value="">{t("noCollector")}</option>
        {collectors.map((c) => (
          <option key={c.id} value={c.id}>
            {locale === "bn" ? c.name_bn : c.name_en}
          </option>
        ))}
      </SelectField>

      <Field
        label={t("receiptUrl")}
        name="receipt_url"
        type="url"
        placeholder="https://i.ibb.co/.../receipt.jpg"
        hint={t("receiptHint")}
      />

      <TextareaField label={t("descriptionBn")} name="description_bn" />
      <TextareaField label={t("descriptionEn")} name="description_en" />
      <TextareaField label={t("note")} name="note" />

      {state?.error && (
        <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {state.error === "missing" ? t("errorMissing") : state.error}
          </span>
        </div>
      )}

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

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
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
        type={type}
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
}: {
  label: string;
  name: string;
  required?: boolean;
  min?: number;
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
  children,
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </span>
      <select
        name={name}
        className="h-11 w-full rounded-lg border border-border bg-card px-3 text-base focus:border-[#48cae4] focus:outline-none focus:ring-2 focus:ring-[#48cae4]/30"
      >
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
